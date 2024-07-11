import { Checkbox } from "../../reusable/shadcn-ui/checkbox";
import { useSelectMenuUserFilter } from "./zustand";

type Props = {
  userId: string;
};

export function SelectCell({ userId }: Props) {
  const {
    filteredUserIds: userIds,
    removeUsersFromFilter,
    addUsersToFilter,
  } = useSelectMenuUserFilter();

  const isUserInSelectionFilter = userIds.includes(userId);

  return (
    <div className="ml-2 flex w-8 items-center justify-start">
      <Checkbox
        checked={isUserInSelectionFilter}
        onCheckedChange={() =>
          isUserInSelectionFilter
            ? removeUsersFromFilter([userId])
            : addUsersToFilter([userId])
        }
        aria-label="Select row"
      />
    </div>
  );
}
