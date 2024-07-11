import dayjs from "dayjs";
import { getSupportPackageNameFromValue } from "@/src/client-functions/client-stripe/price-id-manager";
import { isPartOfFakeTrialInstitutions } from "@/src/utils/functions";
import { isAdminDashTestInstitution } from "..";
import { OpenEditModalButton } from "../buttons/open-edit-modal-button";
import { useAdminDash } from "../zustand";
import InstitutionDataItem from "./institution-data-item";

const SubscriptionOverview = function SubscriptionOverview() {
  const { openedAdminDashInstitution } = useAdminDash();
  const institution = openedAdminDashInstitution?.institution;
  const isTestInstitution = isAdminDashTestInstitution(
    openedAdminDashInstitution?.subscription,
  );

  switch (true) {
    case !!institution &&
      !isTestInstitution &&
      !!openedAdminDashInstitution &&
      !!openedAdminDashInstitution.subscription:
      return (
        <>
          <div className="mt-2 text-lg font-semibold">Subscription</div>
          <InstitutionDataItem
            label="Total Users"
            value={
              openedAdminDashInstitution.subscription?.quantity?.toString() ||
              "0"
            }
          />
          <InstitutionDataItem
            label="Billing Period"
            value={
              openedAdminDashInstitution.subscription?.interval + "ly" || "0"
            }
          />
          <InstitutionDataItem
            label="Status"
            value={
              openedAdminDashInstitution.subscription?.status || "No Status"
            }
          />
          {openedAdminDashInstitution.institution.supportPackage && (
            <InstitutionDataItem
              label="Support Package"
              value={
                getSupportPackageNameFromValue(
                  openedAdminDashInstitution.institution.supportPackage.priceId,
                ) || "0"
              }
            />
          )}
        </>
      );
    case !!institution && isTestInstitution:
      return (
        <>
          <div className="mt-2 text-lg font-semibold">
            {isPartOfFakeTrialInstitutions(institution.id)
              ? "Fake Trial (like FHS)"
              : "Test Subscription"}
          </div>
          <div className="flex items-center justify-between">
            <InstitutionDataItem
              label="Cancels on"
              value={
                openedAdminDashInstitution.subscription?.cancel_at
                  ? dayjs(
                      openedAdminDashInstitution.subscription?.cancel_at * 1000,
                    ).format("DD MMM YYYY")
                  : "No Cancel Date"
              }
            />
            <OpenEditModalButton
              institutionId={openedAdminDashInstitution.institution.id}
              subscription={openedAdminDashInstitution.subscription}
            />
          </div>
          <InstitutionDataItem
            label="Status"
            value={
              openedAdminDashInstitution.subscription?.status || "No Status"
            }
          />
          <InstitutionDataItem
            label="Status"
            value={
              openedAdminDashInstitution.subscription?.status || "No Status"
            }
          />
        </>
      );
    default:
      return (
        <>
          <div className="mt-2 text-lg font-semibold">No Subscription</div>
          <OpenEditModalButton
            institutionId={openedAdminDashInstitution?.institution.id}
            subscription={openedAdminDashInstitution?.subscription}
          >
            Add Subscription
          </OpenEditModalButton>
        </>
      );
  }
};
export default SubscriptionOverview;
