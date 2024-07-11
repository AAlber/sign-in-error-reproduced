import { Link } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usesFuxamZoomAccount } from "@/src/client-functions/client-video-chat-providers/zoom";
import ComingSoonBadge from "@/src/components/reusable/badges/coming-soon";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import Title from "@/src/components/reusable/title";
import { toast } from "@/src/components/reusable/toaster/toast";
import useUser from "@/src/zustand/user";
import Input from "../../../../reusable/input";
import useAppointmentEditor from "../../zustand";
import VideoChatProviderSelectItem from "./video-chat-provider-select-item";

export default function LocationSettingsOnlineEvents() {
  const { t } = useTranslation("page");
  const { user } = useUser();
  const { onlineAddress, setOnlineAddress, provider, setProvider, duration } =
    useAppointmentEditor();

  useEffect(() => {
    if (!provider) return setProvider("custom");
    if (provider !== "custom") {
      setOnlineAddress("");
    }
    if (usesFuxamZoomAccount() && Number(duration) > 30) {
      toast.warning("cannot_create_meeting", {
        description: "meeting_duration_too_long",
        duration: 5000,
      });
    }
  }, [provider]);

  return (
    <>
      <Label>{t("appointment_location_select_provider")}</Label>
      <Select
        defaultValue="custom"
        value={provider}
        onValueChange={setProvider}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="custom">
            <span className="flex items-center gap-2">
              <Link size={18} />
              {t("appointment_custom_link")}
            </span>
          </SelectItem>
          <VideoChatProviderSelectItem
            videoChatProviders={
              user.institution?.institutionSettings.videoChatProviders
            }
          />
          <SelectItem disabled value="fuxam">
            <span className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Fuxam" width={20} height={20} />
              Fuxam Video <ComingSoonBadge />
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
      {provider === "custom" && (
        <>
          <Title text={t("appointment_online_link")} type="h6" />
          <Input
            text={onlineAddress}
            setText={setOnlineAddress}
            placeholder="https://example.com"
            maxLength={500}
          />
        </>
      )}

      {(provider === "bbb" || provider === "zoom") && (
        <div className="text-sm text-muted-contrast">
          {
            //   usesFuxamZoomAccount() && Number(duration) > 30 ? (
            //   <p>{t("not_use_own_account_zoom")}</p>
            // ) :

            usesFuxamZoomAccount() ? (
              <p>{t("organization_settings.zoom_fuxam_account")}</p>
            ) : (
              <p>{t("provider_will_auto_generate")}</p>
            )
          }
        </div>
      )}
    </>
  );
}
