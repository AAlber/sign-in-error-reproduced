import { useTranslation } from "react-i18next";
import Switch from "@/src/components/reusable/settings-switches/switch";
import WithToolTip from "@/src/components/reusable/with-tooltip";

export default function MemberPaidSwitch({
  isPaid,
  setIsPaid,
}: {
  isPaid: boolean;
  setIsPaid: (value: boolean) => void;
}) {
  const { t } = useTranslation("page");
  ("how_do_paid_access_passes_work");
  return (
    <div>
      <div className="flex justify-between text-sm text-contrast">
        <div>{t("access_pass.member_pays_pass")}</div>
        <Switch checked={isPaid} onChange={() => setIsPaid(!isPaid)} />
      </div>

      <div className="flex gap-2 text-xs text-muted-contrast">
        {" "}
        {t("how_do_paid_access_passes_work")}
        <span>
          <WithToolTip text="how_do_paid_access_passes_work_description"></WithToolTip>
        </span>
      </div>
    </div>
  );
}
