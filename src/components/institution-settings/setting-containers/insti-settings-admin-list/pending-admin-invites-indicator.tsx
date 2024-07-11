import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import confirmAction from "@/src/client-functions/client-options-modal";
import api from "@/src/pages/api/api";
import { useAdminList } from "./zustand";

export default function PendingAdminInvitesIndicator({ institutionId }) {
  const { refresh } = useAdminList();
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  useEffect(() => {
    fetch(api.countPendingInvites + institutionId + "?role=admin", {
      method: "GET",
    }).then((res) => {
      res.json().then((data) => {
        setPending(data);
      });
    });
  }, [institutionId, refresh]);

  if (pending === 0) return null;

  return (
    <div className="mb-4 flex items-center rounded-lg border border-primary bg-primary/10 px-4 py-2 text-sm text-primary">
      <div className="flex flex-1 items-center">
        <span className="mr-3 text-lg">🕑</span>
        <div className="flex flex-col">
          {pending === 1 ? (
            <>
              {t("organization_settings.administrators_revoke_invites_text1")}{" "}
              {pending}{" "}
              {t("organization_settings.administrators_revoke_invites_text2")}
            </>
          ) : (
            <>
              {t("organization_settings.administrators_revoke_invites_text3")}{" "}
              {pending}{" "}
              {t("organization_settings.administrators_revoke_invites_text4")}
            </>
          )}
          <span className="text-xs font-normal text-muted-contrast text-opacity-70 ">
            {t("organization_settings.administrators_revoke_invites_text5")}
          </span>
        </div>
      </div>
      <button
        data-testid="cy-revoke-invite-button"
        type="button"
        onClick={() =>
          confirmAction(
            () => {
              setLoading(true);
              fetch(api.revokePendingInvites, {
                method: "POST",
                body: JSON.stringify({ layerId: institutionId }),
              }).then((res) => {
                res.json().then(() => {
                  setPending(0);
                  setLoading(false);
                });
              });
            },
            {
              title: "organization_settings.confirm_action_revoke_admin_invite",
              description:
                "organization_settings.confirm_action_revoke_admin_invite_description",
              actionName:
                "organization_settings.confirm_action_revoke_admin_invite_action",
              dangerousAction: true,
            },
          )
        }
        className="hover:text-destructive"
      >
        {loading
          ? t(
              "organization_settings.administrators_revoke_invites_button_plural",
            )
          : t("organization_settings.administrators_revoke_invites_button")}
      </button>
    </div>
  );
}
