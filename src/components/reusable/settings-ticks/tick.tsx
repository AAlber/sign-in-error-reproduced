export default function Tick({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onChange(!checked)}
      className="h-4 w-4 rounded-sm border border-border bg-foreground text-primary focus:border-transparent focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 focus:ring-offset-transparent"
    />
  );
}
