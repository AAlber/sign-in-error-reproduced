// FeedbackPopover.js
import { useTranslation } from "react-i18next";
import { getPeerFeedbacksOfUser } from "@/src/client-functions/client-peer-feedback";
import useUser from "@/src/zustand/user";
import AsyncComponent from "../../../reusable/async-component";
import Box from "../../../reusable/box";
import { Button } from "../../../reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../../../reusable/shadcn-ui/popover";
import useCourse from "../../zustand";
import FeedbackAccordion from "./accordion";

const PeerFeedbackPopover = () => {
  const { t } = useTranslation("page");
  const { course } = useCourse();
  const { user } = useUser();

  if (!course) return null;

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={"cta"}>{t("your_feedback")}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <PopoverHeader>
          <PopoverTitle>{t("your_feedback")}</PopoverTitle>
          <PopoverDescription className="text-muted-contrast">
            {t("your_feedback_description")}
          </PopoverDescription>
        </PopoverHeader>
        <Box noPadding className="mt-2 h-52">
          <AsyncComponent
            promise={() => getPeerFeedbacksOfUser(course.layer_id!, user.id)}
            loaderElement={
              <div className="flex h-full flex-col items-center justify-center">
                <p className="text-sm text-muted-contrast">
                  {t("general.loading")}
                </p>
              </div>
            }
            component={(data) => <FeedbackAccordion data={data} t={t} />}
          />
        </Box>
      </PopoverContent>
    </Popover>
  );
};

export default PeerFeedbackPopover;
