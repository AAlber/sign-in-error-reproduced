import { X } from "lucide-react";
import useWidgetStore from "../zustand";

export const RemoveButton = (props: { id: string }) => {
  const { removeWidgetFromDashboard } = useWidgetStore();
  return (
    <button onClick={() => removeWidgetFromDashboard(props.id)} className=" ">
      <X size={18} />
    </button>
  );
};
