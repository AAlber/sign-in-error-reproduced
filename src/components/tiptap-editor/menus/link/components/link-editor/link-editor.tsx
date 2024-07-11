import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "@/src/components/reusable/input";
import SmallSwitch from "@/src/components/reusable/settings-switches/switch-small";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Label } from "@/src/components/reusable/shadcn-ui/label";

interface Props {
  initial?: {
    url: string;
    openInNewTab: boolean;
  };
  onSetLink: (url: string, openInNewTab) => void;
}

export const LinkEditor = ({ initial, onSetLink }: Props): JSX.Element => {
  const [url, setUrl] = useState<string>(initial?.url || "");
  const [openInNewTab, setOpenOnNewTab] = useState<boolean>(
    initial?.openInNewTab || false,
  );

  const { t } = useTranslation("page");

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = () => {
    if (isValidUrl) {
      onSetLink(url, openInNewTab);
    }
  };

  return (
    <>
      <div className="flex gap-x-2">
        <Input
          text={url}
          setText={setUrl}
          placeholder={t("editor.link-placeholder")}
        />
        <Button
          disabled={!isValidUrl}
          className="min-w-max"
          onClick={handleSubmit}
        >
          {t("editor.link-set-button")}
        </Button>
      </div>
      <div className="flex gap-x-2">
        <Label className=" my-auto">{t("editor.link-target")}</Label>
        <SmallSwitch
          checked={openInNewTab}
          onChange={(checked) => setOpenOnNewTab(checked)}
        />
      </div>
    </>
  );
};
