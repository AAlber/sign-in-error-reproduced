import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";

export async function overwriteCourseUserStatus(
  data: OverwriteCourseUserStatus,
) {
  const response = await fetch(api.overwriteUserCourseStatus, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.responseError({
      response,
    });
    return;
  }

  return (await response.json()) as {
    id: string;
    userId: string;
    passed: string;
    layerId: string;
    notes: string;
  };
}

export async function removeOverwrittenCourseUserStatus(
  data: RemoveOverwriteCourseUserStatus,
) {
  return fetch(api.removeOverwriteUserCourseStatus, {
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      toast.responseError({
        response,
      });
    }
  });
}
