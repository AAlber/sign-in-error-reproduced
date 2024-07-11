import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";

export async function createScheduleCustomFilter(
  layerIds: string[],
  name: string,
) {
  const response = await fetch(api.createScheduleCustomFilter, {
    method: "POST",
    body: JSON.stringify({ layerIds, name }),
  });

  if (!response.ok) {
    toast.responseError({ response });
    return;
  }

  return (
    response.json(),
    toast.success("success", {
      description: "Filter created successfully",
    })
  );
}

export async function getScheduleCustomFilters() {
  const response = await fetch(api.getScheduleCustomFilters, {
    method: "GET",
  });

  if (!response.ok) {
    toast.responseError({ response });
    return;
  }

  return response.json();
}

export async function deleteScheduleCustomFilter(id: string) {
  const response = await fetch(api.deleteScheduleCustomFilter, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    toast.responseError({ response });
    return;
  }

  return (
    response.json(),
    toast.success("success", {
      description: "Filter deleted successfully",
    })
  );
}
