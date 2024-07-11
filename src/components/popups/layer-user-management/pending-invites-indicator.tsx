import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import confirmAction from "@/src/client-functions/client-options-modal";
import api from "../../../pages/api/api";
import useUserLayerManagement from "./zustand";

export default function PendingInvitesIndicator({ layerId }) {
  const { emailsToInvite } = useUserLayerManagement();
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  useEffect(() => {
    fetch(api.countPendingInvites + layerId, { method: "GET" }).then((res) => {
      res.json().then((data) => {
        setPending(data);
      });
    });
  }, [layerId, emailsToInvite]);

  if (pending === 0) return null;

  return (
    <div className="mb-2 flex items-center rounded-lg border border-primary bg-primary/20 px-4 py-2 text-sm text-primary">
      <div className="flex flex-1 items-center">
        <span className="mr-3 text-lg">🕑</span>
        <div className="flex flex-col">
          {pending === 1 ? (
            <>
              {t("admin_dashboard.modal_user_management_revoke_title1")}{" "}
              {pending}{" "}
              {t("admin_dashboard.modal_user_management_revoke_title2")}
            </>
          ) : (
            <>
              {t("admin_dashboard.modal_user_management_revoke_title1_plural")}{" "}
              {pending}{" "}
              {t("admin_dashboard.modal_user_management_revoke_title2_plural")}
            </>
          )}
          <span className="text-xs font-normal text-muted-contrast text-opacity-70 ">
            {t("admin_dashboard.modal_user_management_revoke_text")}
          </span>
        </div>
      </div>
      <button
        data-testid="cy-revoke-invite-button"
        onClick={() =>
          confirmAction(
            () => {
              setLoading(true);
              fetch(api.revokePendingInvites, {
                method: "POST",
                body: JSON.stringify({ layerId }),
              }).then((res) => {
                res.json().then(() => {
                  setPending(0);
                  setLoading(false);
                });
              });
            },
            {
              title: "admin_dashboard.confirm_action_revoke_invites_title",
              description:
                "admin_dashboard.confirm_action_revoke_invites_description",
              actionName:
                "admin_dashboard.confirm_action_revoke_invites_action",
              dangerousAction: true,
            },
          )
        }
        className="hover:text-destructive"
      >
        {loading
          ? t("admin_dashboard.modal_user_management_revoke_button_loading")
          : t("admin_dashboard.modal_user_management_revoke_button")}
      </button>
    </div>
  );
}
