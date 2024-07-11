import { Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { createEmailInstitutionInvites } from "@/src/client-functions/client-invite";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import CreateUserButton from "../../institution-user-management/data-table/create-user-button";
import { BaseListItem, ImageHolder } from "./list-item";
import useGiveAccessPopover from "./zustand";

const emailSchema = z.string().email();

export default function InviteUserItem() {
  const { t } = useTranslation("page");
  const { search, data, role } = useGiveAccessPopover();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    try {
      emailSchema.parse(search);
      setIsValid(true);
    } catch (err) {
      setIsValid(false);
    }
  }, [search]);

  return (
    <CreateUserButton
      initialEmail={search}
      disabled={!isValid}
      giveAccessToLayer={data.layerId}
      role={role}
      onSubmitted={async () => {
        data.onUserInvited(search);
        await createEmailInstitutionInvites({
          emails: [search],
          role: "member",
        });
      }}
    >
      <BaseListItem>
        <ImageHolder>
          <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-border">
            <Mail size={12} />
          </div>
        </ImageHolder>
        <div className="flex w-full flex-col items-start justify-center text-left">
          <span
            className={
              isValid ? "text-sm text-positive" : "text-sm text-muted-contrast"
            }
          >
            {isValid
              ? replaceVariablesInString(t("invite_x"), [search])
              : t("invalid_email")}
          </span>
          <span className="text-xs text-muted-contrast">
            {t("user_will_need_to_use_email")}
          </span>
        </div>
      </BaseListItem>
    </CreateUserButton>
  );
}
