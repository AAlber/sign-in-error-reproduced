export function PriceInfoItem({ label, value }) {
  return (
    <div>
      <div className="text-sm text-muted-contrast">{label}</div>
      <div className="pt-2 text-sm">{value}</div>
    </div>
  );
}
