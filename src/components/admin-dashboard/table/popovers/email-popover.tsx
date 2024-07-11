import cuid from "cuid";
import { Mail } from "lucide-react";
import { memo, useState } from "react";
import { sendAdminDashAdminInvite } from "@/src/client-functions/client-admin-dashboard";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { Input } from "../../../reusable/shadcn-ui/input";
import { isValidEmail } from "../../top-right-menu/create-institution-popover";
import { useAdminDash } from "../zustand";

export const EmailPopover = memo(function EmailPopover({
  institutionId,
  children,
}: {
  institutionId: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const {
    adminDashPassword,
    adminDashInstitutions,
    setAdminDashInstitutions,
    setKey,
  } = useAdminDash();
  const [isSending, setIsSending] = useState<boolean>(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onClick={() => setOpen(true)}>
        <Button variant={children ? "default" : "ghost"}>
          {children}
          <Mail className={"size-4"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" className="ml-3 mt-7 w-[350px]">
        <div className="text-sm text-muted-contrast">Admin Invite</div>
        <div className="flex">
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            className="w-24"
            disabled={isSending}
            onClick={async () => {
              if (!isValidEmail(email!)) return;
              setIsSending(true);
              const res = await sendAdminDashAdminInvite({
                email,
                institutionId,
                adminDashPassword,
              });
              if (res) {
                const copy = [...adminDashInstitutions];
                const current = copy.find(
                  (i) => i.institution.id === institutionId,
                );
                if (!current) return;
                current.institution.invite = [
                  ...current.institution.invite,
                  res,
                ];
                setAdminDashInstitutions(copy);
                setKey(cuid());
              }
              setIsSending(false);
            }}
          >
            Send
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});
