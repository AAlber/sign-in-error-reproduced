import { track } from "@vercel/analytics";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIntercom } from "react-use-intercom";
import classNames from "@/src/client-functions/client-utils";
import { log } from "@/src/utils/logger/logger";
import { useLearnDialog } from "../learn/zustand";
import { Button } from "../shadcn-ui/button";

type EmptyStateProps = {
  icon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  title: string;
  description: string;
  className?: string;
  size?: "small" | "normal" | "large" | "xlarge";
  withBlurEffect?: boolean;
  children?: React.ReactNode;
};

const EmptyState = ({
  icon: Icon,
  title,
  description,
  className,
  size = "normal",
  withBlurEffect = false,
  children,
}: EmptyStateProps) => {
  const { t } = useTranslation("page");
  return (
    <section
      className={classNames(
        "relative flex h-full w-full flex-col items-center justify-center text-center",
        className,
      )}
    >
      {Icon && (
        <div
          className={classNames(
            "flex items-center justify-center rounded-md border border-border text-contrast",
            size === "small"
              ? "mb-1 h-6 w-6 p-1"
              : size === "normal"
              ? "mb-2 h-8 w-8 p-1.5"
              : "mb-4 h-12 w-12 p-2.5",
          )}
        >
          <Icon className="h-full w-full" />
        </div>
      )}
      <div className="mb-2">
        <h2
          className={classNames(
            "max-w-[400px] font-medium text-contrast",
            size === "small"
              ? "text-xs"
              : size === "normal"
              ? "text-sm"
              : size === "large"
              ? "text-lg"
              : "text-xl",
          )}
        >
          {t(title)}
        </h2>
        <p
          className={classNames(
            "max-w-[400px] text-sm text-muted-contrast",
            size === "small" ? "text-xs" : "text-sm",
          )}
        >
          {t(description)}
        </p>
      </div>
      {children}
      {withBlurEffect && (
        <div className="absolute mb-52 h-40 w-40 rounded-full bg-primary opacity-0 blur-3xl dark:opacity-20" />
      )}
    </section>
  );
};
EmptyState.displayName = "EmptyState";

const LearnTrigger = ({
  triggerId,
  text = "learn_more",
  focusVideo,
}: {
  triggerId: string;
  text?: string;
  focusVideo?: string;
}) => {
  const { t } = useTranslation("page");
  const { toggleMenu } = useLearnDialog();

  return (
    <Button
      variant="link"
      className="mt-2 px-0 font-normal text-muted-contrast"
      onClick={() => {
        toggleMenu(triggerId, focusVideo);
        log.click("Opened learn menu via external trigger");
        track("Opened learn resource", { type: "menu", id: triggerId });
      }}
    >
      {t(text)}
      <ExternalLink className="ml-1 mt-0.5 h-3.5 w-3.5" />
    </Button>
  );
};
LearnTrigger.displayName = "LearnTrigger";

const Article = ({
  articleId,
  text = "learn_more",
}: {
  articleId: number;
  text?: string;
}) => {
  const { t } = useTranslation("page");
  const { showArticle } = useIntercom();

  return (
    <Button
      variant="link"
      className="mt-2 px-0 font-normal text-muted-contrast"
      onClick={() => {
        showArticle(articleId);
        log.click("Opened article from empty state");
        track("Opened learn resource", { type: "article", id: articleId });
      }}
    >
      {t(text)}
      <ExternalLink className="ml-1 mt-0.5 h-3.5 w-3.5" />
    </Button>
  );
};
Article.displayName = "Article";

EmptyState.LearnTrigger = LearnTrigger;
EmptyState.Article = Article;
export { EmptyState };
