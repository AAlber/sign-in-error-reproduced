import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/reusable/shadcn-ui/tabs";
import { BlockPopoverContent } from "./content";
import { BlockPopoverFeedback } from "./popover-feedback";
import { BlockPopoverGrading } from "./popover-grading";

export const TabsArea = ({ block, isFeedbackEnabled, canGiveRating }) => {
  const { t } = useTranslation("page");
  const registredBlock = contentBlockHandler.get.registeredContentBlockByType(
    block.type,
  );
  return (
    <Tabs defaultValue="content" className="mt-4 w-full">
      <TabsList className="w-full">
        <TabsTrigger className="w-full" value="content">
          {t("content")}
        </TabsTrigger>
        <TabsTrigger className="w-full" value="grading">
          {t("rating")}
        </TabsTrigger>
        {canGiveRating && (
          <TabsTrigger className="w-full" value="feedback">
            {t("feedback")}
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="content">
        <BlockPopoverContent
          contentBlock={block}
          registeredContentBlock={registredBlock}
        />
      </TabsContent>
      <TabsContent value="grading">
        <BlockPopoverGrading block={block} />
      </TabsContent>
      {canGiveRating && isFeedbackEnabled && (
        <TabsContent value="feedback">
          <BlockPopoverFeedback blockId={block.id} />
        </TabsContent>
      )}
    </Tabs>
  );
};
