import classNames from "@/src/client-functions/client-utils";

export default function Box({
  noPadding = false,
  smallPadding = false,
  noBackground = false,
  className,
  hugePadding = false,
  children,
}: {
  noPadding?: boolean;
  smallPadding?: boolean;
  noBackground?: boolean;
  hugePadding?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={classNames(
        className,
        !noBackground && "bg-foreground",
        hugePadding ? "p-8" : smallPadding ? "p-2" : !noPadding && "px-4 py-3",
        "flex flex-col overflow-hidden rounded-md border border-border shadow-sm",
      )}
    >
      {children}
    </div>
  );
}
