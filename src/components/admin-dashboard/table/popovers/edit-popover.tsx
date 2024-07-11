import dayjs from "dayjs";
import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  confirmInstantCancelSubscription,
  extendSubscriptionOfInstitution,
} from "@/src/client-functions/client-admin-dashboard";
import { formatStripeDate } from "@/src/client-functions/client-stripe/utils";
import Modal from "@/src/components/reusable/modal";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import { StandaloneCalendar } from "../../../reusable/date-time-picker/date-picker";
import InstitutionLogo from "../../top-right-menu/organization-summary/institution-info/logo";
import { getAdminDashPaymentStatus, isAdminDashTestInstitution } from "..";
import { useAdminDash } from "../zustand";

export const EditPopover = memo(function EditPopover() {
  const {
    adminDashInstitutions,
    setCancelDate,
    cancelDate,
    setAdminDashInstitutions,
    openEditModal,
    openedInstitutionId,
    setOpenEditModal,
    adminDashPassword,
  } = useAdminDash();

  const institution = useMemo(() => {
    return adminDashInstitutions.find(
      (insti) => insti.institution.id === openedInstitutionId,
    );
  }, [adminDashInstitutions, openedInstitutionId]);
  const { t } = useTranslation("page");

  const [loading, setLoading] = useState<boolean>(false);
  const subscription = institution?.subscription;
  const isTestSub = subscription?.isTestInstitution;

  const shouldShowCancel =
    subscription !== null &&
    subscription !== undefined &&
    subscription.status !== "canceled";

  useEffect(() => {
    if (subscription && subscription.cancel_at) {
      setCancelDate(new Date(subscription.cancel_at * 1000));
    }
  }, []);
  return (
    <Modal open={openEditModal} setOpen={setOpenEditModal}>
      <div className="mt-8 flex gap-2">
        <div className="flex flex-col gap-2">
          <div className="">
            <InstitutionLogo />
          </div>
          <p className="text-sm text-muted-contrast">
            <span className="text-xl font-semibold text-contrast">
              <TruncateHover
                text={institution?.institution.name}
                truncateAt={15}
              />
            </span>
          </p>
          <p className="text-sm text-muted-contrast">
            Payment:{" "}
            <span className="font-semibold text-contrast">
              {getAdminDashPaymentStatus(institution!)}
            </span>
          </p>

          {subscription && isTestSub ? (
            <>
              <p className="text-sm text-muted-contrast">
                Jetziges TestAbonnement läuft ab am:{" "}
                <span className="font-semibold text-contrast">
                  {isAdminDashTestInstitution(subscription) &&
                  subscription &&
                  subscription.cancel_at
                    ? formatStripeDate(subscription.cancel_at)
                    : ""}
                </span>
              </p>
            </>
          ) : (
            <></>
          )}

          <h3 className="text-sm text-muted-contrast">
            {isTestSub
              ? t("Probeabonnement verlängern bis:")
              : t("Probeabonnement erstellen bis: ")}
            <span className="font-semibold text-contrast">
              {dayjs(cancelDate).format("DD.MM.YYYY")}
            </span>
          </h3>
          {shouldShowCancel && (
            <div className="flex h-full flex-col justify-end">
              <Button
                onClick={async () => {
                  setLoading(true);
                  confirmInstantCancelSubscription(
                    {
                      institutionId: institution?.institution.id,
                      adminDashPassword,
                    },
                    institution?.institution.name,
                  );
                  setLoading(false);
                }}
                className="text-destructive"
              >
                {t("instant cancel")}
              </Button>
            </div>
          )}
        </div>
        <div className="w-auto">
          <div className="w-auto">
            <StandaloneCalendar
              onChange={(date) => {
                setCancelDate(date);
              }}
              onChangeDate={setCancelDate}
              date={cancelDate}
              resetDateButton={<></>} // resetDateButton={props.resetDateButton}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={
                loading === true ||
                (subscription &&
                  subscription.cancel_at !== null &&
                  subscription.cancel_at !== undefined &&
                  cancelDate === new Date(subscription.cancel_at * 1000))
              }
              onClick={async (e) => {
                const date = cancelDate?.getTime();
                if (!date) return;
                setLoading(true);
                const result = await extendSubscriptionOfInstitution({
                  adminDashPassword,
                  cancelDate: Math.floor(date / 1000),
                  institutionId: institution?.institution.id,
                  institutionName: institution?.institution.name,
                });
                const copy = [...adminDashInstitutions];
                const index = copy.findIndex(
                  (inst) => inst.institution.id === institution?.institution.id,
                );
                const current = copy[index];
                if (current) {
                  current.subscription = result;
                }
                setAdminDashInstitutions(copy);
                setOpenEditModal(false);

                setLoading(false);
              }}
            >
              {t("Save")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
});
