import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/reusable/shadcn-ui/tabs";
import type { ContentBlock } from "@/src/types/course.types";
import { FilesBlockPopover } from "../../../block-popover/files-block-popover";
import { FileAdder } from "./file-adder";

export function FilesEditor({
  block,
  children,
}: {
  block: ContentBlock;
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState<"files" | "add-files">("files");
  const { t } = useTranslation("page");
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="!w-[350px]">
        <Tabs
          defaultValue={tab}
          value={tab}
          onValueChange={(value) => setTab(value as any)}
        >
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="files">
              {t("files")}
            </TabsTrigger>
            <TabsTrigger className="w-full" value="add-files">
              {t("add_files")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="files" className="flex flex-col gap-4">
            <FilesBlockPopover block={block} enableDeleteFile={true} />
          </TabsContent>
          <TabsContent value="add-files">
            <FileAdder block={block} setTab={setTab} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
