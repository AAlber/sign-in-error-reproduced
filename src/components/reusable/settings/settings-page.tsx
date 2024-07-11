import Skeleton from "../../skeleton";
import SettingsNavigation from "./settings-navigation";

export default function SettingsPage(props: SettingsPageProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-y-scroll">
      {props.showNavbar && <SettingsNavigation {...props} />}
      {props.loading && (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md border border-border">
          {...Array.from(Array(3).keys()).map((i) => (
            <div
              key={i}
              className="h-full w-full overflow-hidden border-b border-border bg-foreground"
            >
              <Skeleton />
            </div>
          ))}
        </div>
      )}
      {!props.loading && props.children}
    </div>
  );
}
