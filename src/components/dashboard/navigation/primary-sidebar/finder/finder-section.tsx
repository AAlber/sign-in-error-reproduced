import { hasRolesInInstitution } from "@/src/client-functions/client-user-management";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import {
  CommandGroup,
  CommandItem,
} from "../../../../reusable/shadcn-ui/command";
import type { FinderSection } from "./finder.types";

export default function FinderSection<T>(props: FinderSection<T>) {
  const { data: hasAccess, loading: loadingAccess } = useAsyncData(
    props.rolesRequired.length > 0
      ? () =>
          hasRolesInInstitution({
            roles: props.rolesRequired,
          })
      : () => Promise.resolve(true),
  );

  if (loadingAccess) return <></>;
  if (!hasAccess) return <></>;

  return (
    <CommandGroup heading={props.title}>
      {props.items.map((item, idx) => (
        <CommandItem
          key={idx}
          className="group"
          onSelect={() => item.onSelect(item.item)}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.title}</span>
            </div>
            <p className="mr-1 mt-0.5 text-xs text-muted-contrast opacity-0 group-aria-selected:opacity-100">
              ↵
            </p>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
