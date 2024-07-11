export function StorageCard({ title, storage, price }) {
  return (
    <div className="h-30 mb-1 w-[240px] items-center justify-start rounded-md border border-border p-4">
      <div className="text-sm text-muted-contrast">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{storage}</div>
      <div className="font-semibold">{price}</div>
    </div>
  );
}
