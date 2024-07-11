import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { string } from "zod";
import {
  connectAppointmentInvitationEmail,
  deleteAppointmentInvitationEmail,
  getAppointmentInvitationEmails,
} from "@/src/client-functions/client-user-integrations";
import Form from "@/src/components/reusable/formlayout";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import Skeleton from "@/src/components/skeleton";

export const Integrations = () => {
  const [email, setEmail] = useState<string>();
  const [newEmail, setNewEmail] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleConnect = async () => {
    const emailSchema = string().email();

    if (!emailSchema.safeParse(newEmail).success) {
      return;
    }

    const res = await connectAppointmentInvitationEmail(newEmail!);

    if (!res.ok) return setNewEmail(undefined);

    setNewEmail(undefined);
    setEmail(newEmail);
  };

  const handleDelete = async () => {
    const res = await deleteAppointmentInvitationEmail();

    if (res.ok) {
      setEmail(undefined);
      setNewEmail(undefined);

      if (inputRef.current) inputRef.current.value = "";
    }
  };

  useEffect(() => {
    getAppointmentInvitationEmails()
      .then((e) => {
        if (e) {
          setEmail(e.email);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Form>
        <Form.Item
          label="account_modal.integrations_appointment_email_label"
          descriptionBelowChildren
          align="top"
          description="account_modal.integrations_appointment_email_description"
        >
          {loading ? (
            <div className="h-8 w-full overflow-hidden rounded-md border border-border">
              <Skeleton></Skeleton>
            </div>
          ) : (
            <div className="relative">
              <Input
                ref={inputRef}
                value={email}
                type="email"
                placeholder="Email"
                onChange={(event) => {
                  setEmail(event.target.value);
                  setNewEmail(event.target.value);
                }}
                onBlur={handleConnect}
              />
              <Button
                className="absolute right-0 top-0 mr-1 mt-1"
                variant={"ghost"}
                size={"iconSm"}
                onClick={handleDelete}
              >
                <X size={14} />
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};
