import cuid from "cuid";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { create24hInvite } from "@/src/client-functions/client-invite";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import { toast } from "@/src/components/reusable/toaster/toast";
import { Button } from "../shadcn-ui/button";
import { Input } from "../shadcn-ui/input";
import useGiveAccessPopover from "./zustand";

export default function QuickInvite() {
  const token = cuid();
  const { data } = useGiveAccessPopover();

  const link = `${window.location.origin}/invitation/${data.layerId}/${token}`;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex space-x-2">
        <div className="w-full select-none">
          <Input
            value={link}
            readOnly
            className="pointer-events-none select-none border-border/50 text-primary"
          />
        </div>
        <Button
          variant="default"
          className="shrink-0"
          onClick={async () => {
            if (!hasActiveSubscription()) return toastNoSubscription();
            setLoading(true);
            navigator.clipboard.writeText(link);
            await create24hInvite({ layerId: data.layerId, token });
            toast.success("link_active_24", {
              description: "link_active_24.description",
            });
            setLoading(false);
          }}
        >
          {loading ? t("general.loading") : t("copy_link")}
        </Button>{" "}
      </div>
      <p className="text-sm text-muted-contrast">
        {t("public_share_link_description")}
      </p>
    </div>
  );
}
