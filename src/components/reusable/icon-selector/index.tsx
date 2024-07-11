import { Popover } from "@radix-ui/react-popover";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import EmojiSelector from "../emoji-selector";
import { PopoverContent, PopoverTrigger } from "../shadcn-ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn-ui/tabs";
import Icons3DTab from "./3d-icons-tab";
import { IconUploader } from "./icon-uploader";

export type IconSelectorProps = {
  disabled?: boolean;
  onSelect: (icon: string, type: "emoji" | "image" | "custom") => void;
  children?: React.ReactNode;
};

export function IconSelector({
  children,
  disabled,
  onSelect,
}: IconSelectorProps) {
  const { t } = useTranslation("page");
  const [tab, setTab] = useState<"3dicon" | "emoji" | "custom">("3dicon");

  return (
    <Popover>
      <PopoverTrigger disabled={disabled}>{children}</PopoverTrigger>
      <PopoverContent className="w-[370px] p-4 pb-2" side="left">
        <Tabs value={tab} onValueChange={(value) => setTab(value as any)}>
          <TabsList className="m w-full">
            <TabsTrigger className="w-full" value="3dicon">
              {t("gallery")}
            </TabsTrigger>
            <TabsTrigger className="w-full" value="emoji">
              Emojis
            </TabsTrigger>
            <TabsTrigger className="w-full" value="custom">
              Upload
            </TabsTrigger>
          </TabsList>
          <TabsContent value="3dicon" className="mt-4">
            <Icons3DTab onSelect={(icon) => onSelect(icon, "image")} />
          </TabsContent>
          <TabsContent value="emoji" className="mx-auto mt-4">
            <EmojiSelector onSelect={(emoji) => onSelect(emoji, "emoji")} />
          </TabsContent>
          <TabsContent value="custom" className="mx-auto mt-4">
            <IconUploader onSelect={onSelect} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
