import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { shouldRenderVideoChatProvider } from "@/src/client-functions/client-video-chat-providers";
import { useInstitutionSettings } from "@/src/components/institution-settings/zustand";
import { SelectItem } from "@/src/components/reusable/shadcn-ui/select";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import type { VideoChatProviderInstitutionSettingsProps } from "@/src/types/video-chat-provider-integration.types";
import { defaultVideoChatProviderSettings } from "@/src/types/video-chat-provider-integration.types";

interface Props {
  videoChatProviders?: VideoChatProviderInstitutionSettingsProps[];
}

const VideoChatProviderSelectItem = ({ videoChatProviders }: Props) => {
  const { t } = useTranslation("page");
  const { institutionSettings } = useInstitutionSettings();
  const bbbIsConfigured =
    !!institutionSettings.bigbluebutton_api_secret &&
    !!institutionSettings.bigbluebutton_api_url;
  return (
    <>
      {videoChatProviders?.map((provider) => {
        const videoChatProviderContent = defaultVideoChatProviderSettings.find(
          (p) => p.id === provider.id,
        );
        const bbbIsActiveButNotConfigured =
          provider.id === "bbb" && !bbbIsConfigured;
        if (shouldRenderVideoChatProvider(provider.id)) {
          return (
            <WithToolTip
              key={provider.id}
              disabled={!bbbIsActiveButNotConfigured}
              text="setting_configuration_incomplete"
            >
              <SelectItem value={provider.id}>
                <span
                  className={classNames(
                    bbbIsActiveButNotConfigured ? "opacity-50" : "",
                    "flex items-center gap-2",
                  )}
                >
                  <Image
                    src={videoChatProviderContent!.iconSrc}
                    alt={videoChatProviderContent!.iconAlt}
                    width={20}
                    height={20}
                  />
                  {t(videoChatProviderContent!.title)}
                </span>
              </SelectItem>
            </WithToolTip>
          );
        }
      })}
    </>
  );
};

export default VideoChatProviderSelectItem;
