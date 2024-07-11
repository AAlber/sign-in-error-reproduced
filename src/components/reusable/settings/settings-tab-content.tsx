export default function SettingsTabContent(props: SettingsTabContentProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-y-scroll">
      {props.children}
    </div>
  );
}
