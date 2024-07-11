import { useTranslation } from "react-i18next";
import { goToBillingPage } from "@/src/client-functions/client-stripe/alerts";
import { isTestInstitution } from "@/src/client-functions/client-stripe/data-extrapolation";
import {
  daysUntil,
  replaceVariablesInString,
} from "@/src/client-functions/client-utils";
import { isPartOfFakeTrialInstitutions } from "@/src/utils/functions";
import useUser from "@/src/zustand/user";
import { useBilling } from "../../institution-settings/setting-containers/insti-settings-billing/zustand-billing";
import AccessGate from "../access-gate";
import { Button } from "../shadcn-ui/button";

export default function DemoBanner() {
  const { t } = useTranslation("page");
  const { subscription } = useBilling();
  const { user } = useUser();
  const demoEndDay = subscription?.cancel_at
    ? subscription?.cancel_at
    : subscription?.current_period_end;
  const daysUntilDemoEnds = daysUntil(demoEndDay as number);

  return (
    <>
      {!isPartOfFakeTrialInstitutions() &&
      subscription &&
      // !isLocalhost &&
      daysUntilDemoEnds > -1 &&
      isTestInstitution() ? (
        <AccessGate
          rolesWithAccess={["admin"]}
          layerId={user.currentInstitutionId}
        >
          <div className="fixed top-0 flex h-10 w-full items-center justify-center gap-2 border-b border-border bg-primary">
            <p className="text-sm text-white">
              {replaceVariablesInString(t("demo_banner"), [daysUntilDemoEnds])}
            </p>
            <Button
              variant={"outline"}
              className="btn-shine border-white text-white hover:bg-accent/30"
              size={"small"}
              onClick={() => goToBillingPage()}
            >
              {t("upgrade_now")}
            </Button>
          </div>
        </AccessGate>
      ) : (
        <></>
      )}
    </>
  );
}
