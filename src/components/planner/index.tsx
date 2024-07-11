import { Accordion } from "../reusable/shadcn-ui/accordion";
import { ResizablePanel } from "../reusable/shadcn-ui/resizable";
import ConstraintsPreferences from "./constraints-input";
import { PlannerHeader } from "./header";
import usePlannerLogic from "./hooks";
import LayerAndResourceSelection from "./resource-selection-section";

const Planner = () => {
  const { currentAccordion, openAccordion } = usePlannerLogic();

  return (
    <ResizablePanel
      maxSize={50}
      defaultSize={30}
      minSize={30}
      className=" h-full w-full "
    >
      <div className="relative h-full w-full overflow-y-scroll bg-foreground">
        <PlannerHeader />
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={currentAccordion}
          onValueChange={(value) => openAccordion(value as string)}
        >
          <LayerAndResourceSelection />
          <ConstraintsPreferences />
        </Accordion>
      </div>
    </ResizablePanel>
  );
};
Planner.displayName = "Planner";

export { Planner };
