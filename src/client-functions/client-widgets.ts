import type { DragEndEvent } from "@dnd-kit/core";
import dayjs from "dayjs";
import type { SetState } from "zustand";
import { isTestInstitution } from "@/src/client-functions/client-stripe/data-extrapolation";
import { subscriptionIsBeingCancelled } from "@/src/client-functions/client-stripe/utils";
import { useBilling } from "../components/institution-settings/setting-containers/insti-settings-billing/zustand-billing";
import useChat from "../components/reusable/page-layout/navigator/chat/zustand";
import { toast } from "../components/reusable/toaster/toast";
import type { WidgetStore } from "../components/widgets/zustand";
import useWidgetStore from "../components/widgets/zustand";
import api from "../pages/api/api";
import { formatNumber } from "./client-utils";

export async function getWidgetData(
  identifier: string,
): Promise<WidgetDataResponse> {
  try {
    const res = await fetch(api.getWidgetData + "?id=" + identifier, {
      method: "GET",
    });
    const data: WidgetDataResponse = await res.json();
    return data;
  } catch (error) {
    toast.responseError({
      title: "Error",
      response: error as Response,
    });
  }
  return {
    primaryData: "0",
    secondaryData: "No Data",
  };
}

export const usersWidgetData = async () => {
  const { activeMembers } = useChat.getState();
  const data = await getWidgetData("total_users");
  const percentageUsers = (
    (activeMembers / parseInt(data.primaryData)) *
    100
  ).toFixed(2);
  return Promise.resolve({
    primaryData: data.primaryData,
    secondaryData: "admin_dashboard.total_users_widget_description",
    variables: [formatNumber(parseInt(percentageUsers)).toString()],
  });
};

export const activeNowWidgetData = () => {
  const { activeMembers } = useChat.getState();
  const time = dayjs().format("HH:mm");
  return Promise.resolve({
    primaryData: activeMembers.toString(),
    secondaryData: "admin_dashboard.total_active_now_widget_description",
    variables: [time],
  });
};

const { subscription } = useBilling.getState();

export const nextInvoiceWidgetData = () => {
  if (
    isTestInstitution(subscription) ||
    subscriptionIsBeingCancelled(subscription) ||
    !subscription ||
    subscription?.status === "canceled"
  ) {
    return Promise.resolve({
      primaryData: "None",
      secondaryData: "admin_dashboard.next_invoice_widget_description",
      variables: ["0"],
    });
  }

  return getWidgetData("next_invoice");
};

// Drag and Drop Functionality

export const dragEndFunctionality = (
  event: DragEndEvent,
  widgetPosition: { id: string; position: number }[],
  setWidgetPosition: (
    updatedWidgetPosition: { id: string; position: number }[],
  ) => void,
) => {
  const { active, over } = event;
  const { setWidgetsOnDashboard } = useWidgetStore.getState();

  if (active.id !== over?.id) {
    const activeIndex = widgetPosition.findIndex(
      (widget) => widget.id === active.id.toString(),
    );
    const overIndex = widgetPosition.findIndex(
      (widget) => widget.id === over!.id.toString(),
    );

    if (activeIndex !== -1 && overIndex !== -1) {
      const updatedWidgetPosition = moveWidget(
        widgetPosition,
        activeIndex,
        overIndex,
      );
      setWidgetPosition(updatedWidgetPosition);
      setWidgetsOnDashboard(updatedWidgetPosition.map((widget) => widget.id));
    }
  }

  removeWidgetIfApplicable(widgetPosition, active.id.toString());
};

const moveWidget = (
  widgetPosition: { id: string; position: number }[],
  activeIndex: number,
  overIndex: number,
): { id: string; position: number }[] => {
  const updatedWidgetPosition = [...widgetPosition];
  const [movedWidget] = updatedWidgetPosition.splice(activeIndex, 1);
  updatedWidgetPosition.splice(overIndex, 0, movedWidget!);
  return updatedWidgetPosition;
};

const removeWidgetIfApplicable = (
  widgetPosition: { id: string; position: number }[],
  activeId: string,
) => {
  const { widgetsOnStore, removeWidgetFromStore } = useWidgetStore.getState();
  const widgetsOnDashboardIds = widgetPosition.map((widget) => widget.id);
  const widgetsOnStoreIds = widgetsOnStore.map((widget) => widget.toString());

  if (
    !widgetsOnDashboardIds.includes(activeId) &&
    widgetsOnStoreIds.includes(activeId)
  ) {
    removeWidgetFromStore(activeId);
  }
};

export const handleRemoveWidgetFromDashboard = (
  widgetId: string,
  set: SetState<WidgetStore>,
) => {
  set((state) => {
    // Remove the widget from the dashboard list
    const updatedWidgetsOnDashboard = state.widgetsOnDashboard.filter(
      (id) => id !== widgetId,
    );

    // Add the widget back to the store list
    const updatedWidgetsOnStore = [...state.widgetsOnStore, widgetId];

    return {
      widgetsOnDashboard: updatedWidgetsOnDashboard,
      widgetsOnStore: updatedWidgetsOnStore,
    };
  });
};

export const handleRemoveWidgetFromStore = (
  widgetId: string,
  set: SetState<WidgetStore>,
) => {
  set((state) => {
    // Check if the widgetId is already in the dashboard list
    const isWidgetInDashboard = state.widgetsOnDashboard.includes(widgetId);

    // Remove the widget from the store list
    const updatedWidgetsOnStore = state.widgetsOnStore.filter(
      (id) => id !== widgetId,
    );

    // If the widget is not in the dashboard list, add it back to the dashboard list and widgetPosition list
    if (!isWidgetInDashboard) {
      const updatedWidgetsOnDashboard = [...state.widgetsOnDashboard, widgetId];

      // Add the widget to the widgetPosition list
      const updatedWidgetPosition = [
        ...state.widgetPosition,
        {
          id: widgetId,
          position: state.widgetPosition.length,
        },
      ];

      return {
        widgetsOnDashboard: updatedWidgetsOnDashboard,
        widgetsOnStore: updatedWidgetsOnStore,
        widgetPosition: updatedWidgetPosition,
      };
    }

    // If the widget is already in the dashboard list, do not add it to the widgetPosition list
    return {
      widgetsOnDashboard: state.widgetsOnDashboard,
      widgetsOnStore: updatedWidgetsOnStore,
    };
  });
};
