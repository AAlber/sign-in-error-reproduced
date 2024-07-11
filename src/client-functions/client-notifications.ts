import type { Notification } from "@prisma/client";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";

export type CountNotificationsResponse = {
  notifications: number;
  unreadNotifications: number;
};

export async function countNotifications() {
  const response = await fetch(api.countNotifications, { method: "GET" });
  if (!response.ok) {
    return undefined;
  }
  const data = (await response.json()) as CountNotificationsResponse;
  return data;
}

export async function getNotifications() {
  const response = await fetch(api.getNotifications, { method: "GET" });
  if (!response.ok) {
    toast.responseError({
      response: response,
      title: "Failed to get unread notifications.",
    });
    return;
  }
  const data = (await response.json()) as Notification[];
  return data;
}

export async function deleteNotification(id: string): Promise<void> {
  const response = await fetch(api.deleteNotification, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    toast.responseError({
      response: response,
      title: "Failed to delete notification.",
    });
  }
}

export async function deleteAllNotifications(): Promise<void> {
  const response = await fetch(api.deleteAllNotifications, {
    method: "DELETE",
  });
  if (!response.ok) {
    toast.responseError({
      response: response,
      title: "Failed to delete all notifications.",
    });
  }
}
