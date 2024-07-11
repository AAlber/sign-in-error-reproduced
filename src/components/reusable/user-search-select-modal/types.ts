import type React from "react";

type WithLayerId = {
  customFetcher?: never;
  layerId: string;
  role?: Role;
};

type WithCustomFetcher<T extends BaseUser> = {
  customFetcher: (query: string) => Promise<T[]>;
};

type CommonModalAndSearchProps<T extends BaseUser> = {
  customFetcher?: (query: string) => Promise<T[]>;
  localFilterUserIds?: string[];
};

type BaseSearchProps<T extends BaseUser> = {
  onSelectResult: (data: T) => void;
  selectedResults: T[];
  throttleRequests?: boolean;
} & CommonModalAndSearchProps<T>;

type BaseUserSearchSelectModalProps<T extends BaseUser> = {
  confirmLabel: string;
  onConfirm: (data: T[]) => void;
  subtitle: string;
  title: string;
} & CommonModalAndSearchProps<T>;

export type SearchComponentProps<T extends BaseUser> = (
  | WithLayerId
  | WithCustomFetcher<T>
) &
  BaseSearchProps<T>;

export type UserSearchSelectModalProps<T extends BaseUser> =
  React.PropsWithChildren<
    (WithLayerId | WithCustomFetcher<T>) & BaseUserSearchSelectModalProps<T>
  >;

export type BaseUser = Partial<SimpleUser> & { disabled?: boolean } & {
  id: string;
};
