import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  handleRemoveWidgetFromDashboard,
  handleRemoveWidgetFromStore,
} from "@/src/client-functions/client-widgets";

export interface WidgetStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  widgetsOnDashboard: string[];
  setWidgetsOnDashboard: (widgets: string[]) => void;
  widgetsOnStore: string[];
  setWidgetsOnStore: (widgets: string[]) => void;
  widgetPosition: { id: string; position: number }[];
  setWidgetPosition: (
    updatedWidgetPosition: { id: string; position: number }[],
  ) => void;
  removeWidgetFromDashboard: (widgetId: string) => void;
  removeWidgetFromStore: (widgetId: string) => void;
}

const initialState = {
  open: false,
  widgetsOnDashboard: ["total_users", "total_courses", "total_active_now"],
  widgetsOnStore: [
    "total_appointments",
    "ai_usage",
    "next_invoice",
    "current_plan",
  ],
};

const useWidgetStore = create<WidgetStore>()(
  persist(
    (set) => ({
      ...initialState,
      widgetPosition: initialState.widgetsOnDashboard.map((id, index) => ({
        id,
        position: index,
      })),
      setOpen: (open) => set(() => ({ open })),
      setWidgetsOnDashboard: (widgetsOnDashboard) =>
        set(() => ({ widgetsOnDashboard })),
      setWidgetsOnStore: (widgetsOnStore) =>
        set((state) => {
          // Filter out any widget IDs that are already present in the dashboard list
          const uniqueWidgetsOnStore = widgetsOnStore.filter(
            (id) => !state.widgetsOnDashboard.includes(id),
          );

          return { widgetsOnStore: uniqueWidgetsOnStore };
        }),
      setWidgetPosition: (widgetPosition) => set(() => ({ widgetPosition })),
      removeWidgetFromDashboard: (widgetId) =>
        handleRemoveWidgetFromDashboard(widgetId, set),
      removeWidgetFromStore: (widgetId) =>
        handleRemoveWidgetFromStore(widgetId, set),
    }),
    { name: "widgets" },
  ),
);

export default useWidgetStore;
