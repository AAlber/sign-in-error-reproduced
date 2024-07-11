import { useTranslation } from "react-i18next";

type BlockStatusProps = {
  emoji: string;
  heading: string;
  text: string;
};

export default function BlockStatus(props: BlockStatusProps) {
  const { t } = useTranslation("page");

  return (
    <div className="flex h-36 w-full items-center justify-center rounded-md border border-border">
      <div className="relative mx-5 py-3">
        <p className="text-center text-2xl">{props.emoji}</p>
        <p className="absolute top-0 w-full text-center text-4xl opacity-50 blur-xl">
          {props.emoji}
        </p>
        <h2 className="mt-2 block text-sm font-medium text-contrast">
          {t(props.heading)}
        </h2>
        <p className="text-center text-sm text-muted-contrast">
          {t(props.text)}
        </p>
      </div>
    </div>
  );
}
