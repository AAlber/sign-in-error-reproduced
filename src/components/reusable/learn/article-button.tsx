import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIntercom } from "react-use-intercom";
import { Button } from "../shadcn-ui/button";

const ArticleButton = ({ articleId }: { articleId: number }) => {
  const { t } = useTranslation("page");
  const { showArticle } = useIntercom();

  return (
    <Button
      onClick={() => showArticle(articleId)}
      className="flex items-center gap-2"
    >
      <BookOpen className="h-4 w-4" />
      {t("learn")}
    </Button>
  );
};

export default ArticleButton;
