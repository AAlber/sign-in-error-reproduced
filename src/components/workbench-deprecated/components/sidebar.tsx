import { ElementLibrary } from "./element-library.tsx";

export default function Sidebar() {
  return (
    <div className="hidden w-[300px] min-w-[300px] gap-y-3 border-r border-border bg-background px-4 lg:flex lg:flex-col">
      <ElementLibrary />
    </div>
  );
}
