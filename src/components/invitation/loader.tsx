import { useTranslation } from "react-i18next";
import { useLoadingSteps } from "../institution-onboarding/use-loading-steps";
import FuxamBotLayoutWithBox from "../reusable/fuxam-bot-layout-box";
import Spinner from "../spinner";

export default function InvitationLoader() {
  const loadingSteps = [
    "loading_text_1",
    "loading_text_2",
    "loading_text_3",
    "loading_text_4",
    "loading_text_5",
    "loading_text_6",
    "loading_text_7",
    "loading_text_8",
    "loading_text_9",
    "loading_text_10",
    "loading_text_11",
    "loading_text_12",
    "loading_text_13",
    "loading_text_14",
    "loading_text_15",
    "loading_text_16",
    "loading_text_17",
    "loading_text_18",
    "loading_text_19",
    "loading_text_20",
  ];

  const { t } = useTranslation("page");
  const loadingStep = useLoadingSteps(loadingSteps);
  return (
    <FuxamBotLayoutWithBox state="neutral">
      <FuxamBotLayoutWithBox.Heading>
        <div className="flex items-center gap-2">
          {t("loading_invite")} <Spinner size="w-6 md:w-7" />
        </div>
      </FuxamBotLayoutWithBox.Heading>
      <FuxamBotLayoutWithBox.Description>
        {t(loadingStep!)}
      </FuxamBotLayoutWithBox.Description>
    </FuxamBotLayoutWithBox>
  );
}
