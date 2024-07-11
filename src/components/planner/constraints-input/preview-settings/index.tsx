import { useTranslation } from "react-i18next";
import InfoCard from "../../../reusable/infocard";
import Spinner from "../../../spinner";
import FixWarningPopover from "../../ai-fix-warning/fix-warning-popover";
import usePlanner from "../../zustand";

export default function PreviewSettings() {
  const { error, loadingPreview } = usePlanner();
  const { t } = useTranslation("page");

  return (
    <div className="mb-4 flex w-full flex-col gap-2">
      <InfoCard
        variant={
          error
            ? error.cause === "unknown-error"
              ? "destructive"
              : "warning"
            : "positive"
        }
        rightSideComponent={
          error && error?.cause !== "unknown-error" ? (
            <FixWarningPopover />
          ) : (
            <></>
          )
        }
        icon={
          <div className="flex w-4 items-center justify-center text-sm">
            {loadingPreview ? (
              <Spinner size="h-6 w-6" />
            ) : error ? (
              <span className="pt-0.5">
                {error.cause === "unknown-error" ? "🚨" : "⚠️"}
              </span>
            ) : (
              <div className="flex size-5 items-center justify-center">
                <div className="absolute size-1.5 rounded-full bg-positive" />
                <div className="absolute size-1.5 animate-ping-slow rounded-full bg-positive" />
              </div>
            )}
          </div>
        }
      >
        {!error && (
          <InfoCard.Title>{t("planner_preview_settings")}</InfoCard.Title>
        )}
        {!error && (
          <InfoCard.Description>
            {t("planner_preview_settings_description")}
          </InfoCard.Description>
        )}
        {error && (
          <InfoCard.Title>
            {error.cause === "unknown-error" ? (
              <>{t("planner.unknown-error")}</>
            ) : (
              <>{t("planner." + error.cause + ".title")}</>
            )}
          </InfoCard.Title>
        )}

        {error && error.cause !== "unknown-error" && (
          <InfoCard.Description>
            {t("planner." + error.cause + ".description", {
              ...error.data,
            })}
          </InfoCard.Description>
        )}

        {error && error.cause === "unknown-error" && (
          <InfoCard.Description>
            {t("planner." + error.data.message + ".description")}
          </InfoCard.Description>
        )}
      </InfoCard>
    </div>
  );
}
