import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  createInstitutionUser,
  toastCantAddUser,
} from "@/src/client-functions/client-user-management/create-user";
import { log } from "@/src/utils/logger/logger";
import { Button } from "../../reusable/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../reusable/shadcn-ui/dialog";
import { Input } from "../../reusable/shadcn-ui/input";
import { Label } from "../../reusable/shadcn-ui/label";
import { toast } from "../../reusable/toaster/toast";
import { useInstitutionUserManagement } from "../zustand";
import useInstitutionUserManagementFilter from "./toolbar/filters/zustand";

type CreateUserButtonProps = {
  initialEmail?: string;
  giveAccessToLayer?: string;
  role?: Role;
  disabled?: boolean;
  onSubmitted?: () => void;
  children: React.ReactNode;
};

export default function CreateUserButton({
  initialEmail = "",
  giveAccessToLayer,
  children,
  disabled = false,
  onSubmitted,
  role,
}: CreateUserButtonProps) {
  const { t } = useTranslation("page");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const { users, setUsers } = useInstitutionUserManagement();
  const { clearFilters } = useInstitutionUserManagementFilter();
  const emailSchema = z.string().email();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      log.timespan("Create Institution User", async () => {
        try {
          log.info("Validating email", { email });
          emailSchema.parse(email);
        } catch (e) {
          log.warn("Invalid email", { email });
          setInvalidEmail(true);
          setLoading(false);
          return;
        }

        log.info("Creating institution user", {
          name,
          email,
          giveAccessToLayer,
          role,
        });
        const response = await createInstitutionUser({
          name,
          email,
          giveAccessToLayer,
          role,
        });

        log.response(response);

        setLoading(false);

        if (response.status === 409) {
          log.warn("User already exists", { email });
          setAlreadyExists(true);
        } else if (!response.ok) {
          if (response.status === 402) {
            log.warn("Can't add user", { status: response.status });
            toastCantAddUser();
            return;
          }
          log.error(response, "Error creating institution user");
          return toast.responseError({ response });
        } else {
          log.info("Institution user created successfully");
          clearFilters();
          onSubmitted?.();
          setName("");
          setEmail("");
          const user = await response.json();
          setUsers([user, ...users]);
          setInvalidEmail(false);
          setAlreadyExists(false);
          setOpen(false);
        }
      });
    } catch (error) {
      log.error(error, "Error in handleSubmit");
    }
  };

  return (
    <Dialog open={!disabled && open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("create.user")}</DialogTitle>
          <DialogDescription className="text-muted-contrast">
            {t(
              giveAccessToLayer
                ? "create.user.description2"
                : "create.user.description",
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex w-full items-center justify-between">
          {alreadyExists && (
            <p className="text-sm text-destructive">
              {t("user_already_exists")}
            </p>
          )}
          {invalidEmail && (
            <p className="text-sm text-destructive">{t("invalid_email")}</p>
          )}
          <Button
            disabled={
              loading || name.trim().length === 0 || email.trim().length === 0
            }
            onClick={handleSubmit}
          >
            {t(loading ? "general.loading" : "general.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
