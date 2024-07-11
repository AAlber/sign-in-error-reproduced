import classNames from "@/src/client-functions/client-utils";

export default function PropertyBox({ interactable = false, children }) {
  return (
    <p
      className={classNames(
        interactable && "cursor-pointer hover:bg-foreground",
        "flex items-center gap-2 rounded-md border border-border px-1.5 py-0.5 text-sm text-contrast",
      )}
    >
      {children}
    </p>
  );
}
