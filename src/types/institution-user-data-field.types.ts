import type { InstitutionUserDataField } from "@prisma/client";

export type InstitutionUserDataFieldWithValueData = InstitutionUserDataField & {
  valueCount: number;
  collectFromUser?: boolean;
};

export type CreateInstitutionUserDataField = {
  id?: string;
  name: string;
};

export type UpdateInstitutionUserDataField =
  Partial<CreateInstitutionUserDataField> & {
    id: string;
    collectFromUser?: boolean;
    showOnStudentIDCard?: boolean;
  };

export type ServerCreateInstitutionUserDataField =
  CreateInstitutionUserDataField & {
    institutionId: string;
  };

export type InstitutionUserDataFieldValue = {
  value: string;
  userId: string;
  fieldId: string;
};

export type SetInstitutionUserDataFieldValues = {
  values: InstitutionUserDataFieldValue[];
};

export type ServerGetInstitutionUserDataFieldValuesOfInstitution = {
  institutionId: string;
  userIds?: string[];
};

export type ServerSetInstitutionUserDataFieldValue =
  SetInstitutionUserDataFieldValues & {
    institutionId: string;
  };
