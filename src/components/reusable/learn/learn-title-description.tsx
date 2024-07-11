import { useTranslation } from "react-i18next";
import { CardDescription, CardTitle } from "../shadcn-ui/card";

export const Title = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  const { t } = useTranslation("page");
  return (
    <CardTitle className="text-xl font-semibold">
      {children ? children : t(title)}
    </CardTitle>
  );
};

export const Description = ({ description }: { description: string }) => {
  const { t } = useTranslation("page");
  return <CardDescription>{t(description)}</CardDescription>;
};
Title.displayName = "Title";
