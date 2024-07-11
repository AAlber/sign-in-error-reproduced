import { useUser as useClerkUser } from "@clerk/nextjs";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import { Label } from "@/src/components/reusable/shadcn-ui/label";

export default function NameForm() {
  const { t } = useTranslation("page");
  const { user: clerkUser } = useClerkUser();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState({
    firstName: clerkUser?.firstName || "",
    lastName: clerkUser?.lastName || "",
  });

  const { firstName, lastName } = name;

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) =>
    setName({ ...name, [e.target.name]: e.target.value });

  const handleSaveName = async () => {
    setLoading(true);
    await clerkUser?.update({
      firstName,
      lastName,
    });
    setLoading(false);
  };

  const cannotSave =
    `${clerkUser?.firstName}${clerkUser?.lastName || ""}`.replace(/\s/g, "") ===
    `${firstName}${lastName}`.replace(/\s/g, "");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2" htmlFor="firstName">
            {t("account_modal.account_overview_form_first_name_label")}
          </Label>
          <Input
            id="firstName"
            name="firstName"
            className="h-8"
            value={firstName}
            onChange={handleChangeName}
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="lastName">
            {t("account_modal.account_overview_form_last_name_label")}
          </Label>
          <Input
            id="lastName"
            name="lastName"
            className="h-8"
            value={lastName}
            onChange={handleChangeName}
          />
        </div>
      </div>

      <div>
        <Button
          disabled={loading || cannotSave}
          className="self-start"
          onClick={handleSaveName}
        >
          {!loading ? t("general.save") : t("general.loading")}
        </Button>
      </div>
    </div>
  );
}
