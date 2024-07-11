import { PopoverAnchor, PopoverClose } from "@radix-ui/react-popover";
import type { Editor } from "@tiptap/react";
import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { convertToEmbedLink } from "@/src/client-functions/client-utils";
import { Accordion } from "@/src/components/reusable/shadcn-ui/accordion";
import {
  Popover,
  PopoverContent,
} from "@/src/components/reusable/shadcn-ui/popover";
import { DraggableElement } from "./draggable-element";
import { FoldableGridSection } from "./foldable-grid-section";
import elementRegistryHandler from "./handler";
import type { RegisteredElement } from "./registry";

interface Props {
  editor: Editor;
}

export const ElementLibrary = ({ editor }: Props) => {
  const [element, setElement] = useState<RegisteredElement | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const { t } = useTranslation("page");

  const elementTypes = elementRegistryHandler.getRegisteredElements();

  const handleHelpClick = (element: RegisteredElement) => {
    elementTypes.filter((item) => {
      if (item.name === element.name) {
        setElement(element);
      }
    });
    setShowHelp(true);
  };

  return (
    <Popover
      open={showHelp}
      onOpenChange={(open) => {
        if (!open) setShowHelp(false);
      }}
    >
      <PopoverAnchor asChild>
        <div className="flex w-full max-w-[125px] flex-col gap-y-2 overflow-y-scroll border-r border-border bg-foreground pt-3 lg:max-w-[225px] xl:max-w-[300px]">
          <Accordion
            type="multiple"
            defaultValue={elementRegistryHandler
              .getCategories()
              .map((category) => category.name)}
            className="w-full"
          >
            {elementRegistryHandler.getCategories().map((category) => (
              <FoldableGridSection key={category.name} title={category.name}>
                {elementRegistryHandler
                  .getRegisteredElements()
                  .filter((element) => element.category.name === category.name)
                  .map((element) => (
                    <DraggableElement
                      onHelpClick={handleHelpClick}
                      editor={editor}
                      key={element.name}
                      element={element}
                    />
                  ))}
              </FoldableGridSection>
            ))}
          </Accordion>
        </div>
      </PopoverAnchor>
      <PopoverContent side="right" align="start" className="p-2">
        {element && (
          <div className="flex flex-col gap-y-2">
            <div className="flex">
              <h3 className="font-bold">{t(element?.name)}</h3>
              <PopoverClose className="ml-auto">
                <X className="h-4 w-4" />
              </PopoverClose>
            </div>
            {element.helpContent.videoUrl && (
              <iframe
                className="aspect-video h-full w-full rounded-md"
                src={convertToEmbedLink(element.helpContent.videoUrl)}
                allowFullScreen
              />
            )}
            <p className="text-sm">{t(element.helpContent.description)}</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
