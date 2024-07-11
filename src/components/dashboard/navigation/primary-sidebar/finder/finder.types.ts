export interface FinderSection<T> {
  title: string;
  rolesRequired: Role[];
  items: FinderItem<T>[];
}

export interface AsyncFinderSection<T> {
  title: string;
  rolesRequired: Role[];
  fetchItems: () => Promise<T[]>;
  renderItem: (item: T) => FinderItem<T>;
}

export interface FinderItem<T> {
  icon: JSX.Element;
  title: string;
  item: T;
  onSelect: (item: T) => void;
}
