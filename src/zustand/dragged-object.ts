import type { DropResult } from "react-beautiful-dnd";
import { create } from "zustand";

type ObjectMeta = unknown;
type DraggedObjectType = { [droppableId: string]: ObjectMeta };

export interface DraggedObject {
  data: DraggedObjectType;
  result: DropResult;
  setData: (droppableId: string, objectId: string) => void;
  setResult: (result: any) => void;
  clearData: (droppableId: string) => void;
}
const initialState = {
  data: {} as DraggedObject["data"],
  result: {} as DropResult,
};

const useDraggedObject = create<DraggedObject>()((set, get) => ({
  ...initialState,
  setResult: (result) => set(() => ({ result })),
  setData: (droppableId, objectId) =>
    set(() => ({ data: { [droppableId]: objectId } })),
  clearData: (droppableId) =>
    set(() => {
      const prev = get().data;
      delete prev[droppableId];
      return { data: prev };
    }),
}));

export default useDraggedObject;
