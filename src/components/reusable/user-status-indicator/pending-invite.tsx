import dayjs from "dayjs";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createEmailInstitutionInvites } from "@/src/client-functions/client-invite";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { UserWithAccess } from "@/src/types/user-management.types";
import Divider from "../divider";
import { Button } from "../shadcn-ui/button";
import { Input } from "../shadcn-ui/input";

export default function PendingInviteIndicator({
  user,
}: {
  user: UserWithAccess;
}) {
  const { t } = useTranslation("page");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const link = `${window.location.origin}/invitation/${user.invite?.target}/${user.invite?.token}`;

  if (user.accessState === "inactive" || !!user.invite?.hasBeenUsed)
    return null;

  return (
    <>
      <Divider />
      <div className="flex flex-col gap-2">
        <div className="flex space-x-2">
          <div className="relative w-full select-none">
            <Input
              value={link}
              readOnly
              className="pointer-events-none select-none border-border/50 text-primary"
            />
            <Button
              size={"small"}
              onClick={() => {
                navigator.clipboard.writeText(link);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 1000);
              }}
              className="absolute inset-y-1 right-1 hover:bg-accent"
            >
              {!copied ? (
                <Copy className="h-4 w-4 text-contrast" />
              ) : (
                <Check className="h-4 w-4 text-contrast" />
              )}
            </Button>
          </div>
        </div>
        <p className="flex items-center gap-2">
          <span className="mr-10 text-xs text-muted-contrast">
            {replaceVariablesInString(t("has_been_invited"), [
              dayjs(user.invite?.createdAt).format("DD. MMM YYYY"),
            ])}
          </span>
          <Button
            variant="default"
            className="w-2/3"
            onClick={async () => {
              if (!hasActiveSubscription()) return toastNoSubscription();

              setSendingInvite(true);
              await createEmailInstitutionInvites({
                emails: [user.email],
                role: "member",
              });
              setSendingInvite(false);
              toast.success("success", {
                description: "invite_sent",
              });
            }}
          >
            {t(sendingInvite ? "general.loading" : "resend_invite")}
          </Button>{" "}
        </p>
      </div>
    </>
  );
}
