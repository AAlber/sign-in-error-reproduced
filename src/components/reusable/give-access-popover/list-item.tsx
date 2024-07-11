import classNames, { truncate } from "@/src/client-functions/client-utils";

export const BaseListItem = ({
  children,
  onClick = () => {
    return;
  },
  className = "",
}) => {
  return (
    <li
      onClick={onClick}
      className={classNames(
        "relative -mx-2 flex h-11 cursor-pointer items-center gap-4 rounded-md px-2 py-1 hover:bg-accent/50",
        className,
      )}
    >
      {children}
    </li>
  );
};

export const ImageHolder = ({ children }) => (
  <div className="w-9">{children}</div>
);

export const TextSection = ({ title, description }) => (
  <div className="flex w-full flex-col items-start justify-center text-left">
    <span className="text-sm text-contrast">{truncate(title, 30)}</span>
    <span className="text-xs text-muted-contrast">
      {truncate(description, 30)}
    </span>
  </div>
);
