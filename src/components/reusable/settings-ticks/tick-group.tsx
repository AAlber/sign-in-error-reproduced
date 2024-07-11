export default function TickGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col divide-y divide-border rounded-md border border-border bg-foreground px-3 ">
      {children}
    </div>
  );
}
