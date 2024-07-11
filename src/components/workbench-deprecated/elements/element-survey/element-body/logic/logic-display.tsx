import type { SurveyLogic } from "../..";
import LogicActionContent from "./logic-action-content";

export default function LogicDisplay(props: {
  elementId: string;
  index: number;
  logic: SurveyLogic;
}) {
  const { logic, index, elementId } = props;
  return (
    <div className="flex w-full flex-wrap items-center justify-start gap-2 rounded-md border border-border bg-background py-2 pl-3 pr-5 text-muted-contrast">
      <div className="flex items-center font-medium text-muted-contrast">
        Logic {index + 1}:
      </div>{" "}
      <div className="flex items-center">
        If the total points is {logic.condition}
      </div>
      <>
        {logic.condition === "within range" && <>of</>}
        <span className="font-medium text-contrast">{logic.threshold}</span>
        {logic.condition === "within range" && <>to</>}
        {logic.condition === "within range" && (
          <span className="font-medium text-contrast">{logic.threshold2}</span>
        )}
      </>
      <div className="flex items-center">then</div>
      {logic.actionType}
      <div className="pointer-events-none opacity-80">
        <LogicActionContent elementId={elementId} logic={logic} />
      </div>
    </div>
  );
}
