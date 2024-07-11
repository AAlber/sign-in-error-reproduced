import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getInstitutionAIUsageReport } from "@/src/client-functions/client-institution-ai-usage";
import classNames from "@/src/client-functions/client-utils";
import InfoCard from "@/src/components/reusable/infocard";
import type { AIUsageReport } from "@/src/types/ai";
import useUser from "@/src/zustand/user";
import SettingsSection from "../../../reusable/settings/settings-section";

dayjs.extend(relativeTime);

export default function InstiAIUsageReportDisplay() {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { user: data } = useUser();
  const [report, setReport] = useState<AIUsageReport | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  useEffect(() => {
    if (!data) return;
    setLoading(true);
    getInstitutionAIUsageReport().then((report) => {
      setReport(report);
      setLoading(false);
    });
  }, [data]);

  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  return (
    <SettingsSection
      title="organization_settings.ai_usage_title"
      subtitle="organization_settings.ai_usage_subtitle"
      noFooter={true}
      loading={loading}
      footerButtonText=""
      footerButtonDisabled={true}
      footerButtonAction={async () => console.log("")}
    >
      <div>
        {!loading && report && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 font-medium text-contrast">
                  {t("organization_settings.ai_usage_text1")}{" "}
                  <span className="text-contrast">
                    {formatter.format(report.budget - report.usage)}
                  </span>{" "}
                  {t("organization_settings.ai_usage_text2")}{" "}
                </h2>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
                <div
                  className={classNames(
                    "h-1.5 rounded-full bg-gradient-to-r transition-all",
                    report.percentageUsed > 90
                      ? report.percentageUsed >= 100
                        ? "from-destructive to-destructive"
                        : "from-orange-500 to-yellow-500"
                      : "from-emerald-700 to-emerald-500",
                  )}
                  style={{ width: `${report.percentageUsed}%` }}
                />
              </div>
              {report.percentageUsed > 90 && report.usage < report.budget && (
                <InfoCard icon="👀" variant="warning">
                  <InfoCard.Title>
                    {t(
                      "organization_settings.ai_usage_information_badge_ending",
                    )}
                  </InfoCard.Title>

                  <InfoCard.Description>
                    {t(
                      "organization_settings.ai_usage_information_badge_ending_text",
                    )}
                  </InfoCard.Description>
                </InfoCard>
              )}
              {report.usage >= report.budget && (
                <InfoCard icon="🚫" variant="destructive">
                  <InfoCard.Title>
                    {t(
                      "organization_settings.ai_usage_information_badge_ended",
                    )}
                  </InfoCard.Title>

                  <InfoCard.Description>
                    {t(
                      "organization_settings.ai_usage_information_badge_ended_text",
                    )}
                  </InfoCard.Description>
                </InfoCard>
              )}
              <div className="mt-2.5 flex items-center justify-between text-sm text-muted-contrast">
                <span>
                  {t("organization_settings.ai_usage_text3")}{" "}
                  {dayjs(
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() + 1,
                      1,
                    ),
                  ).fromNow()}
                </span>
                <span className="flex items-center gap-2">
                  {report.usage} / {report.budget}{" "}
                  {t("organization_settings.ai_usage_text4")}
                </span>{" "}
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingsSection>
  );
}
