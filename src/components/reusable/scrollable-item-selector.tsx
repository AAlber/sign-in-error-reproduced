import { useTranslation } from "react-i18next";
import Box from "./box";
import Tick from "./settings-ticks/tick";

type ScrollableItemSelectorProps<T> = {
  items: T[];
  itemRenderer: (item: T) => JSX.Element;
  loading?: boolean;
  selected: T[];
  setSelected: (selected: T[]) => void;
};

export default function ScrollableItemSelector<T>({
  items,
  itemRenderer,
  loading = false,
  selected,
  setSelected,
}: ScrollableItemSelectorProps<T>) {
  const { t } = useTranslation("page");
  return (
    <Box noPadding>
      <ul className="max-h-[150px] divide-y divide-border overflow-scroll text-sm">
        {loading && <p className="p-2">{t("general.loading")}</p>}
        {!loading && items.length === 0 && (
          <p className="p-2">{t("general.empty")}</p>
        )}
        {!loading &&
          items.length > 0 &&
          items.map((item, idx) => {
            return (
              <li
                key={idx}
                className="flex items-center justify-between px-2 [&_input]:cursor-pointer"
              >
                {itemRenderer(item)}
                <Tick
                  checked={selected.includes(item)}
                  onChange={(checked) => {
                    if (checked) {
                      setSelected([...selected, item]);
                    } else {
                      setSelected(selected.filter((i) => i !== item));
                    }
                  }}
                />
              </li>
            );
          })}
      </ul>
    </Box>
  );
}
