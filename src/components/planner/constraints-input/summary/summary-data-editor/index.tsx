import { buttonTrigger } from "./button-trigger";
import { SummaryDateEditor } from "./date-editor";
import { SummaryDurationEditor } from "./duration-editor";
import { SummaryOrganizerEditor } from "./organizer-editor";
import { SummaryTimeEditor } from "./time-editor";

export interface SummaryDataEditorProps {
  id: string;
  type?: "date" | "duration" | "organizer" | "time";
  data: any;
  children: React.ReactNode;
}

export const SummaryDataEditor = ({
  id,
  type,
  data,
  children,
}: SummaryDataEditorProps) => {
  if (!type) return null;

  switch (type) {
    case "date":
      return (
        <SummaryDateEditor id={id} data={data}>
          {buttonTrigger({ children })}
        </SummaryDateEditor>
      );
    case "duration":
      return (
        <SummaryDurationEditor id={id} data={data}>
          {buttonTrigger({ children })}
        </SummaryDurationEditor>
      );
    case "organizer":
      return (
        <SummaryOrganizerEditor id={id} data={data}>
          {buttonTrigger({ children })}
        </SummaryOrganizerEditor>
      );
    case "time":
      return (
        <SummaryTimeEditor id={id} data={data}>
          {buttonTrigger({ children })}
        </SummaryTimeEditor>
      );
    default:
      return null;
  }
};
