export type BaseOperation = { institutionId: string };
export type ConnectUserUpdateOperation = BaseOperation & {
  groups: {
    id: string;
    name: string;
    responsible: string;
  }[];
  user: {
    subjectGuid: string;
    name: string;
    email: string;
    customDataFields: {
      fieldName: string;
      value: string;
    }[];
  };
};
export type ConnectGroupDeleteOperation = BaseOperation & { id: string };
export type ConnectUserRemoveAccessOperation = BaseOperation & {
  subjectGuid: string;
};
export type ConnectUserGetOperation = BaseOperation & { subjectGuid: string };
export type ConnectGroupUpdateOperation = BaseOperation & {
  id: string;
  name: string;
  groupOrganiser: string;
};
