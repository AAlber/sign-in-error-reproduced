import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "../../../client-functions/client-utils";
import useCloudOverlay from "../zustand";

interface TableHeadItemProps {
  name:
    | "cloud.header_name"
    | "cloud.header_size"
    | "cloud.header_kind"
    | "cloud.header_data_modified"
    | "";
  sortFunction: (reverse: boolean) => void;
}

export default function TableHeadItem(props: TableHeadItemProps) {
  const { selectedColumn, setSelectedColumn } = useCloudOverlay();
  const [reverse, setReverse] = useState(false);
  const { t } = useTranslation("page");
  return (
    <th
      onClick={() => {
        props.sortFunction(reverse);
        setReverse(!reverse);
        setSelectedColumn(props.name);
      }}
      scope="col"
      className="sticky top-0  z-10 cursor-pointer border-b border-border bg-background  py-1 pl-4 pr-3 text-left text-sm font-medium text-contrast backdrop-blur"
    >
      <div className="flex items-center gap-2">
        {t(props.name)}

        {selectedColumn === props.name && (
          <ChevronUp
            className={classNames(
              reverse === true && "rotate-180",
              "h-3 w-3 text-gray-400 transition duration-200 ease-out",
            )}
            aria-hidden="true"
          />
        )}
      </div>
    </th>
  );
}
