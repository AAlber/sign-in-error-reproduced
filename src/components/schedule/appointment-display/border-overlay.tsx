export default function BorderOverlay({
  borderCount,
}: {
  borderCount: number;
}) {
  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${borderCount}, 1fr)`,
      }}
      className={"pointer-events-none absolute inset-0 z-[30] grid flex-none"}
    >
      {Array.from({ length: borderCount }).map((_, i) => {
        return <div key={i} className="border-l border-border" />;
      })}
    </div>
  );
}
