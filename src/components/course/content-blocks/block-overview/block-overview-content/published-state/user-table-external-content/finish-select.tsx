import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/components/reusable/shadcn-ui/select";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import useContentBlockOverview from "../../../zustand";

export const UserTableExternalDeliverableSelect = ({
  block,
  row,
}: {
  block: ContentBlock;
  row: {
    original: ContentBlockUserStatus<"ExternalDeliverable">;
  };
}) => {
  const { t } = useTranslation("page");
  const { refreshOverview } = useContentBlockOverview();
  return (
    <Select
      onValueChange={async (e) => {
        e === "markAsFinished"
          ? contentBlockHandler.userStatus
              .update({
                userId: row.original.id,
                blockId: block.id,
                data: {
                  status: "FINISHED",
                  userData: {
                    markedAsFinishedDate: new Date(),
                  },
                },
              })
              .then(() => refreshOverview())
          : contentBlockHandler.userStatus
              .update({
                userId: row.original.id,
                blockId: block.id,
                data: {
                  status: "IN_PROGRESS",
                  userData: {
                    markedAsFinishedDate: null,
                  },
                },
              })
              .then(() => refreshOverview());
      }}
    >
      <SelectTrigger className="!m-0 flex h-auto items-center border-0 !p-0">
        {row.original.userData?.markedAsFinishedDate ? (
          <p>
            {t("content_block.external_content.finished_at", {
              date: dayjs(row.original.userData.markedAsFinishedDate).format(
                "DD MMMM YYYY - HH:mm",
              ),
            })}
          </p>
        ) : (
          <p>{t("content_block.external_content.mark_as_not_finished")}</p>
        )}
      </SelectTrigger>
      <SelectContent
        onSelect={() => {
          console.log("SelectContent onSelect");
        }}
      >
        <SelectItem value="markAsFinished">
          {t("content_block.external_content.mark_as_finished")}
        </SelectItem>
        <SelectItem value="markAsNotFinished">
          {t("content_block.external_content.mark_as_not_finished")}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
