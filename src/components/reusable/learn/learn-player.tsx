import { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames, {
  convertToEmbedLink,
} from "@/src/client-functions/client-utils";
import Skeleton from "../../skeleton";

export const Player = ({ url }: { url: string }) => {
  const { t } = useTranslation("page");
  const [isLoaded, setIsLoaded] = useState(false);
  const embedLink = convertToEmbedLink(t(url));
  const embedLinkHideTopbar = `${embedLink}?hideEmbedTopBar=true`;

  return (
    <div className="h-full py-4 pl-4">
      {!isLoaded && (
        <div className="relative z-30 size-full rounded-md border border-border">
          <Skeleton />
        </div>
      )}
      <iframe
        src={t(embedLinkHideTopbar)}
        className={classNames(
          "relative z-20 h-full w-full rounded-md border border-border",
          isLoaded ? "block" : "hidden",
        )}
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
      ></iframe>
    </div>
  );
};
