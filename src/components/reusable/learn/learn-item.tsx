import * as Sentry from "@sentry/nextjs";
import { track } from "@vercel/analytics";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIntercom } from "react-use-intercom";
import classNames from "@/src/client-functions/client-utils";
import type { LearnMenuItem } from "@/src/types/learn.types";
import { Button } from "../shadcn-ui/button";
import { useLearnDialog } from "./zustand";

export const Item = ({ props }: { props: LearnMenuItem }) => {
  const { t } = useTranslation("page");
  const { focusVideo, setFocusVideo } = useLearnDialog();
  const { showArticle } = useIntercom();

  function actionClick() {
    switch (props.type) {
      case "video":
        return setFocusVideo(props.url);
      case "article":
        return showArticle(props.articleId);
      case "link":
        return window.open(props.href, props.target || "_self");
      case "action":
        return props.action();
      default:
        return;
    }
  }

  return (
    <Button
      className={classNames(
        "flex h-auto w-auto justify-start p-2 text-start",
        props.type === "video" &&
          props.url === focusVideo &&
          "border-muted-contrast",
      )}
      onClick={() => {
        Sentry.addBreadcrumb({
          message: "Opened learn menu item " + t(props.title),
        });
        track("Opened learn resource", {
          type: props.type,
          id: t(props.title),
        });
        actionClick();
      }}
    >
      <span className="mx-1 text-contrast">{props.icon}</span>
      <div className="flex w-full flex-col pr-2">
        <p className="ml-2 flex w-full items-center justify-between text-xs font-normal text-muted-contrast first-letter:uppercase">
          {t(
            props.type === "action" && props.header ? props.header : props.type,
          )}
          {props.type === "video" && (
            <div
              className={classNames(
                "flex w-auto items-center gap-1 font-normal text-muted-contrast",
              )}
            >
              <Play size={12} />
              <span>{props.length}</span>
            </div>
          )}
          {props.type === "article" && (
            <div
              className={classNames(
                "flex w-auto items-center gap-1 font-normal text-muted-contrast",
              )}
            >
              <span>
                {t("x_min_read", {
                  minutes: props.minRead,
                })}
              </span>
            </div>
          )}
        </p>
        <div className="ml-2 text-sm font-normal">{t(props.title)}</div>
      </div>
    </Button>
  );
};
Item.displayName = "LearnItem";
