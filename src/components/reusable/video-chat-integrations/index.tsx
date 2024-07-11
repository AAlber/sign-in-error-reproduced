import Image from "next/image";
import React from "react";
import { triggerZoomAccountLimitWarning } from "@/src/client-functions/client-video-chat-providers/alerts";
import type VideoChatIntegration from "@/src/client-functions/client-video-chat-providers/VideoChatIntegration";
import AddOn from "../../institution-settings/marketplace/add-on";
import { SettingId } from "../../institution-settings/tabs";

type Props = {
  providers: VideoChatIntegration[];
};

export default function VideoChatIntegrations({ providers }: Props) {
  return (
    <>
      {providers.map((provider) => {
        let settingsPage: SettingId | undefined;
        switch (provider.id) {
          case "bbb":
            settingsPage = SettingId.BigBlueButton;
            break;
          case "zoom":
            settingsPage = undefined;
            break;
          default:
        }

        return (
          provider.id && (
            <AddOn
              key={provider.id}
              icon={
                <Image
                  src={provider.iconSrc}
                  alt={provider.iconAlt}
                  width={30}
                  height={30}
                />
              }
              beta={provider.isBeta}
              iconIsImage
              title={provider.title}
              subtitle={provider.subtitle}
              active={provider.active}
              onToggle={(checked) => {
                provider.toggleActivation(checked);
                triggerZoomAccountLimitWarning(provider.id, checked);
              }}
              settingsPage={settingsPage}
            />
          )
        );
      })}
    </>
  );
}
