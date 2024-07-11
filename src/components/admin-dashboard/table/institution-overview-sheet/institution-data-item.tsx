import { memo } from "react";

const InstitutionDataItem = memo(function InstitutionDataItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2">
      <div className="text-sm text-muted-contrast">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
});
export default InstitutionDataItem;
