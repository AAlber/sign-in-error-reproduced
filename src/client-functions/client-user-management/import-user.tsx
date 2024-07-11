import type { TFunction } from "i18next";
import React from "react";
import * as xlsx from "xlsx";
import type { UserGroup } from "@/src/components/institution-settings/setting-containers/insti-settings-groups";
import type { ImportUserFieldsType } from "@/src/components/institution-user-management/data-table/toolbar/import-users/schema";
import { importUsersSchema } from "@/src/components/institution-user-management/data-table/toolbar/import-users/schema";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { CreateGroupArgs } from "@/src/server/functions/server-institution-user-group";
import type { CreateInstitutionUserDataField } from "@/src/types/institution-user-data-field.types";
import type {
  FieldIdToEmailsWithValueMapping,
  GroupIdToEmailIdsMapping,
} from "@/src/types/user-management.types";
import { mapObjectToLowercaseKeys } from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import { createInstitutionUserDataFields } from "../client-institution-user-data-field";
import { createInstitutionUserGroup } from "../client-institution-user-groups";
import confirmAction from "../client-options-modal";
import { importUsers } from "./index";

export function parseSpreadSheetFile({
  files,
  userDataFields,
  userGroups,
  setNewCustomFields,
  setNewUsers,
  setGroupsToCreate,
  translateFunc,
}: ParseFileArgs) {
  // return a promise as we want to wait until the excel/csv file parsing is complete
  return new Promise<boolean>((resolve, reject) => {
    {
      const file = files[0];
      if (!file?.type) return resolve(false);
      if (!/.sheet|text\/csv/.test(file.type)) {
        toast.error(
          translateFunc(
            "user_management.import_user.toast_invalid_file_type_title",
          ),
          {
            description: translateFunc(
              "user_management.import_user.toast_invalid_file_type_description",
            ),
          },
        );

        return resolve(false);
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result || !e.currentTarget) return resolve(false);

        const json = _transformSpreadSheetToJson<ImportUserFieldsType>(
          e.target.result,
        );

        const isFirstRowValid = validateFirstRow(json, translateFunc);
        if (!isFirstRowValid) return reject(false);

        const parsedResult = _safeParse(json, translateFunc);
        if (!parsedResult) return reject(false);

        const normalizedJson = json.map((rows) => {
          const cols = Object.keys(rows);
          // this will transform columns NAME or Email to name|email
          const keysToTransform = cols.filter((k) => /^(name|email)$/i.test(k));
          return mapObjectToLowercaseKeys(rows, keysToTransform);
        });

        // we dont use the zod-parsed value here so we can include all other columns
        const { fields, groups } = _extractNewUserGroupAndFields(
          userDataFields,
          userGroups,
          normalizedJson,
        );

        setNewCustomFields(fields);
        setGroupsToCreate(groups);
        setNewUsers(normalizedJson);
        return resolve(true);
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    }
  });
}

export async function importAction(args: ImportActionArgs) {
  const { groupsToCreate, newCustomFields, translateFunc, setIsLoading } = args;
  /**
   * if there are new custom fields or new groups, show a confirmAction prompt
   * onCancel of prompt, skip creating of fields and just continue with the user import
   */
  if (newCustomFields.length || groupsToCreate.length) {
    let title = "";
    let description = "";
    switch (true) {
      case !!newCustomFields.length && !groupsToCreate.length:
        title = translateFunc(
          "user_management.import_user.new_custom_fields_title",
        );
        description = `${translateFunc(
          "user_management.import_user.new_custom_fields_description",
        )} ${newCustomFields.join(", ")}`;
        break;
      case !newCustomFields.length && !!groupsToCreate.length:
        title = translateFunc(
          "user_management.import_user.new_user_group.title",
        );
        description = `${translateFunc(
          "user_management.import_user.new_user_group.description",
        )} ${groupsToCreate.join(", ")}`;
        break;
      case !!newCustomFields.length && !!groupsToCreate.length:
        title = translateFunc(
          "user_management.import_user.new_user_group_and_fields.title",
        );
        description = translateFunc(
          "user_management.import_user.new_user_group_and_fields.description",
        );
        break;
    }

    confirmAction(
      async () => {
        setIsLoading(true);
        if (newCustomFields.length) {
          const newFieldsResult = await createInstitutionUserDataFields(
            newCustomFields.map((name) => ({ name })),
          );

          if (!!newFieldsResult?.length) {
            /**
             * push the newFields into the existing data fields
             * so the newFields gets included when creating user data fields
             */
            newFieldsResult.forEach((f) => args.fields.push(f));
          }
        }

        if (groupsToCreate.length) {
          const institutionId = useUser.getState().user.id;
          const response = await createInstitutionUserGroup(
            groupsToCreate.map((groupName) => ({
              name: groupName,
              additionalInformation: "",
              color: "blue",
              institutionId,
            })),
          );

          const newGroupsResult = (await response.json()) as CreateGroupArgs[];

          if (!!newGroupsResult.length) {
            newGroupsResult.forEach((g) =>
              args.existingGroups.push({
                additionalInformation: "",
                id: g.id,
                members: 0,
                name: g.name,
              }),
            );
          }
        }

        await _importUser(args);
      },
      {
        actionName: translateFunc("general.create"),
        cancelName: translateFunc("general.ignore"),
        description,
        title,
        onCancel: () => _importUser(args),
      },
    );

    return;
  }

  await _importUser(args);
}

function _transformSpreadSheetToJson<T = object>(file: FileReader["result"]) {
  const workbook = xlsx.read(file, { type: "array" });
  const sheetName = workbook.SheetNames[0]!;
  const worksheet = workbook.Sheets[sheetName]!;
  return xlsx.utils.sheet_to_json(worksheet) as T;
}

// STEP 1 VALIDATION

function validateFirstRow(json: object, t: ParseFileArgs["translateFunc"]) {
  const firstRow = json[0];
  if (!firstRow) return false;

  // if first row is missing required columns, then all other rows do not contain the required columns as well
  const missingColumns = new Set<string>();

  ["Name", "Email"].forEach((k) => {
    const isValid = Object.keys(firstRow).some(
      (i) => i.toLowerCase() === k.toLowerCase(),
    );
    if (!isValid) missingColumns.add(k);
  });

  if (!!missingColumns.size) {
    const title = t("user_management.import_user.toast_invalid_columns_title");
    const description = `${t(
      "user_management.import_user.toast_invalid_columns_description.please_make_sure",
    )} ${
      missingColumns.size === 1
        ? t(
            "user_management.import_user.toast_invalid_columns_description.this_column",
          )
        : t(
            "user_management.import_user.toast_invalid_columns_description.these_columns",
          )
    } ${t(
      "user_management.import_user.toast_invalid_columns_description.exists",
    )}: ${Array.from(missingColumns).join(" | ")}`;
    toast.error(title, { description });
    return false;
  }

  return true;
}

function _safeParse<T extends object[]>(data: T, t: TFunction<"page">) {
  const result = importUsersSchema.safeParse(data);
  let isValid = true;

  if (!result.success) {
    const formatted = result.error.format();

    const errorsInFile: {
      missingName: string[];
      missingEmail: string[];
      invalidEmail: string[];
    } = {
      missingName: [],
      missingEmail: [],
      invalidEmail: [],
    };

    /**
     * extract the error from column
     *
     * zod errors appear in these format ex.
     * { [rowNumber]: {
     *  [column_name]: {
     *    _errors: [typeOfError]
     *    }
     *  }
     * }
     */
    for (const row in formatted) {
      if (row === "_errors") continue;
      const errors = formatted[row];
      if (!errors) continue;
      for (const e in errors) {
        if (e === "_errors") continue;
        const error = errors[e]?.["_errors"]?.[0];
        if (!error) continue;

        if (error.toLowerCase() === "required") {
          switch (e.toLowerCase()) {
            case "name": {
              errorsInFile.missingName.push(row);
              break;
            }
            case "email": {
              errorsInFile.missingEmail.push(row);
              break;
            }
          }
        } else {
          errorsInFile.invalidEmail.push(row);
        }
      }
    }
    const errorTextArr: string[] = [];
    if (!!errorsInFile.missingName.length) {
      errorTextArr.push(
        `${t(
          "user_management.import_user.toast_invalid_file.missing_name_at_row",
        )}: ${errorsInFile.missingName.join(", ")}`,
      );
    }

    if (!!errorsInFile.missingEmail.length) {
      errorTextArr.push(
        `${t(
          "user_management.import_user.toast_invalid_file.missing_email_at_row",
        )}: ${errorsInFile.missingEmail.join(", ")}`,
      );
    }

    if (!!errorsInFile.invalidEmail.length) {
      errorTextArr.push(
        `${t(
          "user_management.import_user.toast_invalid_file.invalid_email_at_row",
        )}: ${errorsInFile.invalidEmail.join(", ")}`,
      );
    }

    const title = "user_management.import_user.toast_invalid_file_title";

    toast.error(t(title), {
      descriptionAsComponent: (
        <ul className="space-y-1 text-sm text-muted-contrast">
          {errorTextArr.map((e, idx) => (
            <li key={idx}>{e}</li>
          ))}
        </ul>
      ),
    });

    isValid = false;
  }

  return isValid;
}

const validGroupColumnRegex = /^(g|G)roup(_\d+)*$/;

// STEP 2
function _extractNewUserGroupAndFields(
  existingFields: ParseFileArgs["userDataFields"],
  existingUserGroups: ParseFileArgs["userGroups"],
  row: ImportUserFieldsType,
) {
  const currentFields = existingFields.map((i) => i.name);
  const newFields = new Set<string>([]);

  const currentGroups = existingUserGroups.map((i) => i.name);
  const newGroups = new Set<string>([]);

  row.forEach((columns, idx) => {
    const { email: _email, name: _name, ...rest } = columns;
    const k = Object.keys(rest);
    k.forEach((key) => {
      /**
       * if there are multiple "Group" columns, the parser will separate them like:
       * group, group_1, group_2
       */
      if (validGroupColumnRegex.test(key)) {
        const groupName = row?.[idx]?.[key];
        if (groupName && !currentGroups.includes(groupName)) {
          newGroups.add(groupName!);
        }
      } else if (!currentFields.includes(key)) {
        newFields.add(key);
      }
    });
  });

  return { fields: Array.from(newFields), groups: Array.from(newGroups) };
}

// STEP 3
async function _importUser({
  fields,
  isLoading,
  newUsers,
  existingGroups,
  refreshList,
  setIsLoading,
  toggleModal,
}: ImportActionArgs) {
  if (!isLoading) setIsLoading(true);

  const fieldValues: FieldIdToEmailsWithValueMapping = {};
  const groupValues: GroupIdToEmailIdsMapping = {};

  // map the email to the customFieldValue
  newUsers.forEach(({ email, name: _name, ...rest }, idx) => {
    const keys = Object.keys(rest);

    keys.forEach((key) => {
      if (validGroupColumnRegex.test(key)) {
        // if this case is true, then the column is a group
        const groupToAddUserTo = existingGroups.find((g) => {
          const groupName = newUsers[idx]?.[key];
          if (!groupName) return false;
          return g.name === groupName;
        });

        if (groupToAddUserTo) {
          if (Array.isArray(groupValues[groupToAddUserTo.id])) {
            groupValues[groupToAddUserTo.id]?.push(email);
          } else groupValues[groupToAddUserTo.id] = [email];
        }
        return;
      }

      const fieldIdx = fields?.findIndex(({ name }) => name === key) ?? -1;

      const _field = fields?.[fieldIdx];
      const userFieldValue = rest[key];
      if (_field && userFieldValue) {
        const exists = fieldValues[_field.id];
        const value = { [email]: userFieldValue };

        if (Array.isArray(exists)) exists.push(value);
        else fieldValues[_field.id] = [value];
      }
    });
  });

  // strip out customFields, include user group
  const normalized = newUsers.map((i) => ({
    email: i.email,
    name: i.name,
  }));

  await importUsers({
    users: normalized,
    fieldValues,
    groupValues,
  });
  toggleModal(false);
  refreshList();
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type ParseFileArgs = {
  files: FileList;
  userDataFields: Required<CreateInstitutionUserDataField>[];
  userGroups: UserGroup[];
  setNewCustomFields: SetState<string[]>;
  setNewUsers: SetState<ImportUserFieldsType>;
  setGroupsToCreate: SetState<string[]>;
  translateFunc: TFunction<"page", undefined>;
};

type ImportActionArgs = {
  fields: ParseFileArgs["userDataFields"];
  isLoading: boolean;
  newCustomFields: string[];
  newUsers: ImportUserFieldsType;
  groupsToCreate: string[];
  existingGroups: UserGroup[];
  refreshList: () => void;
  setIsLoading: SetState<boolean>;
  toggleModal: (bool: boolean) => void;
  translateFunc: TFunction<"page", undefined>;
};
