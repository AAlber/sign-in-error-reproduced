import { useTranslation } from "react-i18next";

export default function PayMethodInfoItem(props: {
  title: string;
  infoItem: string | number;
}) {
  const { t } = useTranslation("page");

  return (
    <>
      <div>
        <p className="text-xs text-muted-contrast">{t(props.title)}</p>
        <p>{props.infoItem}</p>
      </div>
    </>
  );
}
