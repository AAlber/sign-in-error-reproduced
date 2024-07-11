import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { copyToClipBoard, delay } from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { AccessPassStatusInfo } from "@/src/utils/stripe-types";

export default function CopyLinkButton({
  info,
}: {
  info: AccessPassStatusInfo;
}) {
  const [copiedToClipBoard, setCopiedToClipBoard] = useState(false);
  const { t } = useTranslation("page");
  useEffect(() => {
    if (!copiedToClipBoard) return;
    delay(1000).then(() => {
      setCopiedToClipBoard(false);
    });
  }, [copiedToClipBoard]);
  return (
    <Button
      onClick={async () => {
        info.link && copyToClipBoard(info.link);
        setCopiedToClipBoard(true);
      }}
    >
      {copiedToClipBoard ? t("copied") : t("copy_link")}
    </Button>
  );
}
