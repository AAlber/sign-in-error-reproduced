import { useTranslation } from "react-i18next";
import { isTestInstitution } from "@/src/client-functions/client-stripe/data-extrapolation";
import AdvancedOptionReveal from "@/src/components/reusable/advanced-options-reveal";
import CancelSubscription from "./cancel-subscription";

export default function AdvancedOptions() {
  const { t } = useTranslation("page");
  return isTestInstitution() ? (
    <></>
  ) : (
    <div
      className={
        "mt-4 w-full flex-col items-end justify-end text-sm text-muted-contrast"
      }
    >
      <AdvancedOptionReveal>
        <CancelSubscription />
      </AdvancedOptionReveal>
    </div>
  );
}
