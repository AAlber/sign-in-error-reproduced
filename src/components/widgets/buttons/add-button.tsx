import { Plus } from "lucide-react";
import useWidgetStore from "../zustand";

export const AddButton = (props: { id: string }) => {
  const { removeWidgetFromStore } = useWidgetStore();
  return (
    <button onClick={() => removeWidgetFromStore(props.id)} className=" ">
      <Plus size={18} />
    </button>
  );
};
