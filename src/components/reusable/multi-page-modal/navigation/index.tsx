import type { ModalPage } from "..";
import StepNavigator from "./steps";
import TabNavigator from "./tabs";

export default function PageNavigation({
  steps,
  useTabsInsteadOfSteps = false,
}: {
  steps: ModalPage[];
  useTabsInsteadOfSteps?: boolean;
}) {
  if (steps.length < 2) return null;

  return (
    <nav className="col-span-1 hidden border-r border-border py-4 md:block">
      {useTabsInsteadOfSteps ? (
        <TabNavigator steps={steps} />
      ) : (
        <StepNavigator steps={steps} />
      )}
    </nav>
  );
}
