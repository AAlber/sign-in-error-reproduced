import cuid from "cuid";
import { hasRolesInInstitution } from "@/src/client-functions/client-user-management";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import {
  CommandGroup,
  CommandItem,
} from "../../../../reusable/shadcn-ui/command";
import type { AsyncFinderSection } from "./finder.types";

export default function AsyncFinderSection<T>(props: AsyncFinderSection<T>) {
  const { data: hasAccess, loading: loadingAccess } = useAsyncData(
    props.rolesRequired.length > 0
      ? () =>
          hasRolesInInstitution({
            roles: props.rolesRequired,
          })
      : () => Promise.resolve(true),
  );
  const { loading, error, data } = useAsyncData(() => props.fetchItems());

  if (loadingAccess) return <></>;
  if (!hasAccess) return <></>;
  if (loading) return <></>;
  if (error) return <></>;
  if (!data) return <></>;

  return (
    <CommandGroup heading={props.title}>
      {data.map((item, idx) => (
        <CommandItem
          key={idx}
          className="group"
          value={props.renderItem(item).title + cuid()}
          onSelect={() =>
            props.renderItem(item).onSelect(props.renderItem(item).item)
          }
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {props.renderItem(item).icon}
              <span>{props.renderItem(item).title}</span>
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
