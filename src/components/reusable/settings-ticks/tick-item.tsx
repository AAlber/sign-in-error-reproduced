import { useTranslation } from "react-i18next";
import Tick from "./tick";

export default function TickItem({
  checked,
  onChange,
  title,
  description,
  link,
  linkName,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description?: string;
  link?: string;
  linkName?: string;
}) {
  const { t } = useTranslation("page");

  return (
    <div className="flex items-start justify-between gap-3 px-2 py-3 text-sm text-contrast">
      <div className="flex flex-col gap-0.5">
        <span>
          {t(title)}{" "}
          {link && (
            <a
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
              href={link}
            >
              {t(linkName!)}
            </a>
          )}
        </span>
        {description && (
          <p className="text-xs text-muted-contrast">{t(description)}</p>
        )}
      </div>
      <div className="ml-3 mr-2 flex h-5 items-center justify-start">
        <Tick checked={checked} onChange={onChange} />
      </div>
    </div>
  );
}
