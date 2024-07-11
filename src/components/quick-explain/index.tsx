import { ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PopoverComponent from "../popover";

interface PropsContent {
  title: string;
  url: string;
  description: string;
  hasVideo: boolean;
}

export default function QuickExplain(props) {
  const [open, setOpen] = useState(false);
  const [hasViolation, setHasViolation] = useState(false);
  const { t } = useTranslation("page");

  const Content = ({ hasViolations }) => {
    if (hasViolations && hasViolation !== hasViolations) {
      setTimeout(() => {
        setHasViolation(hasViolations);
      }, 1);
    }

    return (
      <div className="h-auto w-80 rounded-md border border-border bg-background">
        <div className="px-4 py-3">
          <div className="mb-3">
            <h1 className="font-semibold text-contrast">{t(props.title)}</h1>
          </div>
          {props.hasVideo && (
            <div className="relative aspect-video">
              <iframe
                src={`${props.url}?autoplay=1&modestbranding=0&rel=0&amp;controls=1&amp&amp;showinfo=0&amp;`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen; modestbranding=0"
                className="h-40 w-full rounded-md border border-border"
                title="video"
              />
            </div>
          )}
          <div className="mt-3">
            <p className="text-sm text-muted-contrast">
              {t(props.description)}
            </p>
          </div>
          {props.hasVideo && (
            <div className="mt-3">
              <Link
                href={props.url}
                className="flex items-center justify-end text-contrast underline"
              >
                {t("quick_help.button")}
                <ArrowRight className="ml-1 mt-0.5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <PopoverComponent
      className="z-50"
      open={open}
      position={hasViolation ? ["bottom"] : ["top"]}
      align={hasViolation ? "end" : "start"}
      content={Content}
      setOpen={setOpen}
    >
      <button
        onClick={() => {
          setOpen(true);
          if (open) {
            setOpen(false);
          }
        }}
      >
        <HelpCircle className="h-4 w-4 text-muted-contrast" />
      </button>
    </PopoverComponent>
  );
}
