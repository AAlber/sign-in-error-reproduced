import { track } from "@vercel/analytics/react";
import cuid from "cuid";
import type { UseFormSetFocus } from "react-hook-form";
import type { CreateUserWithDataFieldsSchema } from "@/src/components/institution-user-management/data-table/create/user/schema";
import { useInstitutionUserManagement } from "@/src/components/institution-user-management/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import type {
  CreateInstitutionUser,
  InstitutionUserManagementUser,
} from "@/src/types/user-management.types";
import { log } from "@/src/utils/logger/logger";
import { filterUndefined } from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import { setInstitutionUserDataFieldValues } from "../client-institution-user-data-field";
import { goToBillingPage } from "../client-stripe/alerts";

export async function createUser({
  email,
  name,
  fields,
  setAlreadyExists,
  setFocus,
  setLoading,
  setOpen,
}: CreateUserArgs) {
  setLoading(true);

  const { users, setUsers } = useInstitutionUserManagement.getState();
  const institutionId = useUser.getState().user.currentInstitutionId;

  const response = await createInstitutionUser({
    name,
    email,
    giveAccessToLayer: undefined,
    role: undefined,
  });

  if (response.status === 409) {
    setAlreadyExists(true);
    setFocus("email");
  } else if (!response.ok) {
    if (response.status === 402) toastCantAddUser();
    else toast.responseError({ response });
  } else {
    const user = (await response.json()) as InstitutionUserManagementUser;

    // extract only data fields that has values
    const userFieldValues =
      fields
        ?.map(({ fieldId, value }) => {
          if (!value || !fieldId) return;
          return {
            fieldId,
            value,
            userId: user.id,
          };
        })
        .filter(filterUndefined) ?? [];

    if (!!userFieldValues.length) {
      await setInstitutionUserDataFieldValues({
        values: userFieldValues,
      });
    }

    setUsers([
      {
        ...user,
        fieldData: userFieldValues.map((i) => ({
          ...i,
          id: cuid(),
          institutionId,
        })),
      },
      ...users,
    ]);
    setOpen(false);
  }
  setLoading(false);
}

export async function createInstitutionUser(data: CreateInstitutionUser) {
  log.info("Creating institution user", data);
  const response = await fetch(api.createInstitutionUser, {
    method: "POST",
    body: JSON.stringify(data),
  });
  track("User created", { origin: "User Management" });
  return response;
}

export function toastCantAddUser() {
  toast.warning("cannot_add_one_more_user", {
    icon: "✋",
    description: "cannot_add_one_more_user_description",
    actionCTA: {
      label: "upgrade",
      onClick: () => {
        window.location.assign("/");
        goToBillingPage();
      },
    },
  });
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type CreateUserArgs = {
  setFocus: UseFormSetFocus<CreateUserWithDataFieldsSchema>;
  setLoading: SetState<boolean>;
  setAlreadyExists: SetState<boolean>;
  setOpen: SetState<boolean>;
} & CreateUserWithDataFieldsSchema;
