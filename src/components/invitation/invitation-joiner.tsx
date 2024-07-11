import { useTranslation } from "react-i18next";
import FuxamBotLayoutWithBox from "../reusable/fuxam-bot-layout-box";
import JoinButton from "./join-button";
import useInvitation from "./zustand";

export default function InvitationJoiner() {
  const { invite } = useInvitation();
  const { t } = useTranslation("page");
  const isInstitutionInvite = invite?.target === invite?.institution_id;

  const inviteText = isInstitutionInvite
    ? invite?.institution.name
    : `${invite?.institution.name} - ${invite?.layer.name}`;

  return (
    <FuxamBotLayoutWithBox state="welcome">
      <FuxamBotLayoutWithBox.Heading>
        {inviteText}.
      </FuxamBotLayoutWithBox.Heading>

      <FuxamBotLayoutWithBox.Description>
        {t(
          invite?.accessPass?.isPaid
            ? "proceed_to_payment"
            : "click_button_to_proceed",
        )}
      </FuxamBotLayoutWithBox.Description>
      <FuxamBotLayoutWithBox.Children>
        <JoinButton
          title={t(
            invite?.accessPass?.isPaid ? "continue_to_checkout" : "join",
          )}
        />
      </FuxamBotLayoutWithBox.Children>
    </FuxamBotLayoutWithBox>
  );
}
