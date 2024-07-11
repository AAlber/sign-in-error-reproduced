import clsx from "clsx";

export const InfoText = ({
  title,
  children: text,
  fullSpan = false,
}: {
  title: string;
  children: React.ReactNode;
  fullSpan?: boolean;
}) => {
  return (
    <div className={clsx(fullSpan && "col-span-full", "flex flex-col text-sm")}>
      <h3 className="text-xs text-muted-contrast">{title}</h3>
      <p className="text-contrast">{text}</p>
    </div>
  );
};
