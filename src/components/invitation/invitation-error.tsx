import { SignOutButton, useUser } from "@clerk/nextjs";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCorrectErrorMessages } from "@/src/client-functions/client-invite";
import FuxamBotLayoutWithBox from "../reusable/fuxam-bot-layout-box";
import { Button } from "../reusable/shadcn-ui/button";
import ContactSupportButton from "../reusable/support-button";
import JoinButton from "./join-button";
import usePersistInvite from "./persist-invite-zustand";
import useInvitation from "./zustand";

export default function InvitationError() {
  const { setInviteResponse, inviteResponse, setInvite, setLoading, invite } =
    useInvitation();
  const { setPersistedInvite } = usePersistInvite();
  const { user } = useUser();
  const { t } = useTranslation("page");

  useEffect(() => {
    if (!inviteResponse) return;
    if (inviteResponse.error) {
      Sentry.captureMessage(`Invite Error: ${inviteResponse.error}`, {
        extra: { inviteResponse, inviteEmail: invite?.email },
        level: "log",
        user: {
          email: user?.primaryEmailAddress?.emailAddress || "???",
          id: user?.id || "???",
        },
      });
    }
  }, [inviteResponse]);

  if (!inviteResponse) return <></>;
  const { errorMessage, errorSubtitle } =
    getCorrectErrorMessages(inviteResponse);

  const joinButtonShouldShow =
    inviteResponse.error !== "invalid-email" &&
    inviteResponse.error !== "invalid-invite" &&
    inviteResponse.error !== "higher-roles-exist" &&
    inviteResponse.error !== "exceeded-max-standard-subscription-users";
  inviteResponse.error !== "invalid-invite-client";

  const isHigherRolesError = inviteResponse.error === "higher-roles-exist";

  return (
    <FuxamBotLayoutWithBox
      state={inviteResponse.error === "invalid-email" ? "not-found" : "error"}
    >
      <FuxamBotLayoutWithBox.Heading>
        {t(errorMessage)}
        {inviteResponse.error === "invalid-email" && (
          <span className="text-primary">{invite?.email}</span>
        )}
      </FuxamBotLayoutWithBox.Heading>

      <FuxamBotLayoutWithBox.Description>
        {t(errorSubtitle)}
        <br className="mt-4" />
        {isHigherRolesError && (
          <>
            {t("your_current_email_is")}{" "}
            <span className="font-semibold underline">
              {`${user?.primaryEmailAddress}.`}
            </span>
          </>
        )}
      </FuxamBotLayoutWithBox.Description>

      <FuxamBotLayoutWithBox.Children>
        <div className="flex items-center gap-2">
          {inviteResponse.error === "invalid-invite" && (
            <ContactSupportButton variant="cta" />
          )}
          {(inviteResponse.error === "invalid-invite" ||
            inviteResponse.error === "invalid-invite-client") && (
            <Button
              onClick={() => {
                window.location.assign("/");
                setPersistedInvite(undefined);
              }}
            >
              {t("go_to_home")}
            </Button>
          )}
          {/* {inviteResponse.error !== "invalid-invite" &&
            inviteResponse.error !== "invalid-invite-client" && ( */}
          <Button
            onClick={() => {
              setLoading(true);
              setPersistedInvite(undefined);
              setInviteResponse(undefined);
              setInvite(undefined);
            }}
          >
            <SignOutButton
              redirectUrl={`/invitation/${invite?.target}/${invite?.token}`}
            />
          </Button>
          {/* )} */}
          {joinButtonShouldShow && <JoinButton title={t("try_again")} />}
        </div>
      </FuxamBotLayoutWithBox.Children>
    </FuxamBotLayoutWithBox>
  );
}
