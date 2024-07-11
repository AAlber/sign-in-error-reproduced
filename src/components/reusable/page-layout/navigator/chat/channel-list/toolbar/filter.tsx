import clsx from "clsx";
import { Check, ListFilter } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useChannelList, { type ChannelLists } from "../zustand";

const Filter = () => {
  const { listToRender, setListToRender } = useChannelList();
  const { t } = useTranslation("page");

  const handleSetList = (list: ChannelLists | undefined) => () => {
    setListToRender(list);
  };

  const filterEnabled = typeof listToRender !== "undefined";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={clsx(
          "relative transition-transform hover:text-contrast active:scale-90",
          filterEnabled ? "text-contrast" : "text-muted",
        )}
      >
        <Button variant={"ghost"}>
          <ListFilter className="h-4 w-4 text-contrast" />
        </Button>
        {filterEnabled && (
          <span className="absolute -top-1 left-2.5 h-3 w-3 rounded-full bg-accent pt-[1px] text-[8px] text-contrast">
            1
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom">
        <DropdownItem
          list="messaging"
          label={t("chat.channel.list.filters.direct_messages")}
        />
        <DropdownItem
          list="groups"
          label={t("chat.channel.list.filters.groups")}
        />
        <DropdownItem
          list="course"
          label={t("chat.channel.list.filters.courses")}
        />
        <DropdownItem
          list="hidden"
          label={t("chat.channel.list.filters.hidden")}
        />
        {filterEnabled && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                className="flex w-full items-center space-x-1"
                onClick={handleSetList(undefined)}
              >
                {t("chat.channel.list.filters.clear_filter")}
              </button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Filter;

const DropdownItem = (props: { list: ChannelLists; label: string }) => {
  const { label, list } = props;
  const { setListToRender, listToRender } = useChannelList();
  const handleSelect = () => {
    setListToRender(listToRender === list ? undefined : list);
  };

  return (
    <DropdownMenuItem>
      <button
        className="flex w-full items-center space-x-1"
        onClick={handleSelect}
      >
        {listToRender === list && <Check size={17} />}
        <span>{label}</span>
      </button>
    </DropdownMenuItem>
  );
};
