export type AsyncComboboxProps = {
  mode: "select" | "instant-action" | "multi-select";
  fetchOptions: (search: string) => Promise<any[]>;
  selected?: string;
  onSelect?: (value: string | null) => void;
  searchPlaceholder: string;
  placeholder: string;
  noOptionsPlaceholder?: JSX.Element;
  icon?: JSX.Element;
  optionComponent: (option: any) => JSX.Element;
  selectedComponent?: (option: any) => JSX.Element;
  optionIsDisabled?: (option: any) => boolean;
  selectedOptions?: string[];
  createAction?: () => void;
  onMultiSelect?: (options: any[]) => void;
  allowRemoveSelected?: boolean;
};
