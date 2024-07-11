import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import classNames from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { blockStatus } from "@/src/utils/content-block-status";
import useCourse from "../../zustand";
import useContentBlockCreator from "./zustand";

export default function ContentBlockCreatorSaveAsOptions() {
  const { t } = useTranslation("page");
  const { course, setContentBlocks, contentBlocks } = useCourse();
  const {
    id,
    loading,
    error,
    name,
    description,
    data,
    setOpen,
    setLoading,
    contentBlockType,
    startDate,
    dueDate,
  } = useContentBlockCreator();

  if (!contentBlockType) return <></>;
  if (!course?.layer_id) return <></>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={loading || !data || !name || !!error}>
        <Button
          disabled={loading || !data || !name || !!error}
          className="flex items-center justify-between"
        >
          {t(loading ? "general.loading" : "save-as")}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {blockStatus.map((status) => (
          <DropdownMenuItem
            key={status.identifier}
            className="flex items-center justify-between"
            onClick={async () => {
              if (!data) return;
              setLoading(true);
              const newBlock = await contentBlockHandler.create.block({
                id,
                name,
                description,
                layerId: course.layer_id,
                status: status.identifier,
                type: contentBlockType,
                specs: data,
                dueDate: dueDate!,
                startDate: startDate!,
              });
              if (newBlock) setContentBlocks([...contentBlocks, newBlock]);

              setOpen(false);
              setLoading(false);
            }}
          >
            <div className="flex items-center">
              <div
                className={classNames(
                  "mr-2 flex h-4 w-4 items-center justify-center",
                )}
              >
                <div
                  className={classNames("h-2 w-2 rounded-full", status.color)}
                />
              </div>
              <span>{t(status.name)}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
