import { memo } from "react";
import { useAdminDash } from "../zustand";
import InstitutionDataItem from "./institution-data-item";

const TestSubscription = memo(function TestSubscription() {
  const { openedAdminDashInstitution } = useAdminDash();
  const institution = openedAdminDashInstitution?.institution;
  return (
    institution && (
      <>
        <div className="mt-2 text-lg font-semibold">Test Subscription</div>
        <InstitutionDataItem
          label="Ends On"
          value={
            openedAdminDashInstitution.subscription?.current_period_end?.toString() ||
            "0"
          }
        />
      </>
    )
  );
});
export default TestSubscription;
