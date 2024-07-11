import type { InstitutionUserDataField } from "@prisma/client";
import dayjs from "dayjs";
import Papa from "papaparse";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type { CreateInstitutionUserDataFieldArgs } from "../pages/api/institution-user-data-field/create-institution-user-data-fields";
import type {
  CreateInstitutionUserDataField,
  InstitutionUserDataFieldWithValueData,
  SetInstitutionUserDataFieldValues,
  UpdateInstitutionUserDataField,
} from "../types/institution-user-data-field.types";
import { log } from "../utils/logger/logger";
import { downloadFileFromUrl } from "./client-utils";

export const createInstitutionUserDataField = async (
  institutionUserDataField: CreateInstitutionUserDataField,
): Promise<InstitutionUserDataField | void> => {
  const response = await fetch(api.createInstitutionUserDataField, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(institutionUserDataField),
  });

  if (!response.ok) return toast.responseError({ response });
  return await response.json();
};

export const createInstitutionUserDataFields = async (
  args: CreateInstitutionUserDataFieldArgs,
): Promise<InstitutionUserDataField[] | undefined> => {
  const response = await fetch(api.createInstitutionUserDataFields, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    toast.responseError({ response });
    return;
  }
  return await response.json();
};

export const getInstitutionUserDataFields = async (
  includeValues?: boolean,
): Promise<InstitutionUserDataFieldWithValueData[]> => {
  const url = new URL(api.getInstitutionUserDataFields, window.location.origin);
  if (typeof includeValues === "boolean") {
    url.searchParams.append("includeValues", includeValues ? "true" : "false");
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(response.statusText);

  return await response.json();
};

export const updateInstitutionUserDataField = async (
  data: UpdateInstitutionUserDataField,
) => {
  const response = await fetch(api.updateInstitutionUserDataField, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
};

export const deleteInstitutionUserDataField = async (id: string) => {
  const response = await fetch(
    api.deleteInstitutionUserDataField + "?id=" + id,
    {
      method: "POST",
    },
  );

  if (!response.ok) return false;
  return true;
};
const convertToCSV = (data) => {
  return Papa.unparse(data);
};

export const getDefaultFields = () => {
  return [
    { id: "Name", name: "name" },
    { id: "Email", name: "email" },
    { id: "Status", name: "status" },
  ];
};

export const exportUserDataForFieldsAsCSV = async (
  selectedFieldIds: string[],
  users: { id: string }[],
) => {
  const defaultFields = getDefaultFields();
  const defaultFieldIds = defaultFields.map((field) => field.id);
  const selectedDataFieldIds = selectedFieldIds.filter(
    (id) => !defaultFieldIds.includes(id),
  );

  const customFieldsData =
    selectedDataFieldIds.length > 0
      ? await getInstitutionUserDataValuesOfFields(
          selectedDataFieldIds,
          users.map((user) => user.id),
        )
      : [];

  if (!customFieldsData.length) return;

  const csvString = convertToCSV(customFieldsData);
  const csvBlob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const csvUrl = URL.createObjectURL(csvBlob);

  const downloadFileWithUrl = document.createElement("a");
  downloadFileWithUrl.href = csvUrl;
  const fileName = `${"User Management Data"} ${dayjs(new Date()).format(
    "DD MMM YYYY",
  )}.csv`;
  downloadFileWithUrl.setAttribute("download", fileName);

  document.body.appendChild(downloadFileWithUrl);
  downloadFileWithUrl.click();
  document.body.removeChild(downloadFileWithUrl);
};

export const setInstitutionUserDataFieldValues = async (
  data: SetInstitutionUserDataFieldValues,
) => {
  log.info("Setting user institution data field value client-side");
  const response = await fetch(api.setInstitutionUserDataFieldValues, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    log.response(response);
    toast.responseError({ response });
    return false;
  }
  return true;
};

export const getInstitutionUserDataFieldValues = async (
  fieldId: string,
): Promise<
  {
    name: string;
    email: string;
    [key: string]: string;
  }[]
> => {
  const response = await fetch(
    api.getInstitutionUserDataFieldValues + "?fieldId=" + fieldId,
    { method: "GET" },
  );

  if (!response.ok) {
    toast.responseError({ response });
    return [];
  }

  return await response.json();
};

export const getInstitutionUserDataValuesOfFields = async (
  fieldIds: string[],
  userIds: string[],
) => {
  const response = await fetch(
    api.getInstitutionUserDataValuesOfFields +
      "?fieldIds=" +
      fieldIds.join(",") +
      "&userIds=" +
      userIds.join(","),
    { method: "GET" },
  );

  if (!response.ok) {
    toast.responseError({ response });
    return [];
  }

  return (await response.json()) as any[];
};

export const exportInstitutionUserDataFieldValuesAsCSV = async (
  fieldId: string,
) => {
  const data = await getInstitutionUserDataFieldValues(fieldId);
  const csvUsers = Papa.unparse(data);
  const csvData = `${csvUsers}`;

  const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(csvBlob);
  downloadFileFromUrl("user-data.csv", url);
};

export const getUnfilledUserDataFieldsOfUser = async (): Promise<
  InstitutionUserDataField[]
> => {
  log.info("Fetching unfilled user data fields");

  const response = await fetch(api.getUserEmptyDataFields);

  if (!response.ok) {
    log.response(response);
    log.warn("Error fetching unfilled user data fields", {
      status: response.status,
      statusText: response.statusText,
    });
    return [];
  }

  const unfilledFields = await response.json();
  log.info("Unfilled user data fields fetched successfully", {
    unfilledFields,
  });

  return unfilledFields;
};

export const updateEmptyUserDataFields = async ({
  data,
}: {
  data: SetInstitutionUserDataFieldValues;
}): Promise<boolean> => {
  log.info("Updating empty user data fields", { data });

  const response = await fetch(api.updateInstitutionUserDataFieldValues, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    log.response(response);
    log.error("Error updating empty user data fields", {
      status: response.status.toString(),
      statusText: response.statusText,
    } as any);
    return false;
  }

  log.info("Empty user data fields updated successfully");
  return true;
};
