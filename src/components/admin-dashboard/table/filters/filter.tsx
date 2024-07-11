import { Checkbox } from "../../../reusable/shadcn-ui/checkbox";
import { Label } from "../../../reusable/shadcn-ui/label";
import type { AdminDashFilters } from "../zustand";
import { useAdminDash } from "../zustand";

export default function DashboardFilter({
  filterId,
}: {
  filterId: AdminDashFilters;
}) {
  const { setFilter, filter } = useAdminDash();
  return (
    <div
      className="flex gap-2 rounded-md border border-border p-2"
      onClick={() => {
        setFilter(filterId);
        // if (filters.includes(filterId)) {
        //   setFilters(filters.filter((filter) => filter !== filterId))
        // }
        // else {
        //   setFilters([...filters, filterId])
        // }
      }}
    >
      <Checkbox checked={filter === filterId} />
      <Label htmlFor={filterId}>{filterId}</Label>
    </div>
  );
}
