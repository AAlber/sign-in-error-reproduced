import PlanSelector from ".";

export type DefaultPlanSelectorProps = {
  defaultUserAmount?: number;
  defaultBillingPeriod?: "monthly" | "yearly";
  children?: React.ReactNode;
  peekDirection?: "left" | "right";
};
export default function DefaultPlanSelector({
  children,
  peekDirection,
}: DefaultPlanSelectorProps) {
  return (
    <PlanSelector>
      <PlanSelector.UserAmountInput />
      <PlanSelector.SupportPackageSelector peekDirection={peekDirection} />
      <PlanSelector.YearlyMonthlySwitch />
      {children}
    </PlanSelector>
  );
}
