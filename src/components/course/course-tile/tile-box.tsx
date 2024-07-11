import clsx from "clsx";

export default function CourseTileBox({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        className,
        "relative flex h-[125px] w-full select-none items-start justify-start overflow-hidden rounded-lg border text-start",
      )}
    >
      {children}
    </div>
  );
}
