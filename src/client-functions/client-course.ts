import type { CourseFeedback, User } from "@prisma/client";
import * as Sentry from "@sentry/browser";
import useSuggestions from "../components/dashboard/navigation/primary-sidebar/finder/finder-sections/zustand-suggestions";
import { useNavigation } from "../components/dashboard/navigation/zustand";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type { InitialCourseData } from "../types/course.types";
import structureHandler from "./client-administration/structure-handler";

export async function updateCourseTheme({ course }) {
  const result = await fetch(api.updateCourseTheme, {
    method: "POST",
    body: JSON.stringify({
      id: course.id,
      iconType: course.iconType,
      color: course.color,
      icon: course.icon,
      bannerImage: course.bannerImage,
    }),
  });

  if (!result.ok) {
    toast.responseError({
      response: result,
      title: "toast_course_status_error",
    });
    Sentry.captureException(new Error("Cannot update course theme"));
    return;
  }

  return result.json();
}

export async function updateCourseDescription(
  courseId: string,
  description: string,
) {
  const response = await fetch(api.updateCourseDescription, {
    method: "POST",
    body: JSON.stringify({
      id: courseId,
      description: description,
    }),
  });

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_course_description_error",
    });
    return response;
  }

  return response;
}

export async function createFeedback(
  args: Omit<CourseFeedback, "id" | "userId" | "createdAt" | "updatedAt">,
) {
  const body = JSON.stringify(args);
  const data = await fetch(api.createFeedback, { body, method: "POST" });
  const result = (await data.json()) as CourseFeedback;
  return result;
}

export async function getFeedback(layerId: string, name?: string) {
  const data = await fetch(
    `${api.getFeedback}?layerId=${layerId}&name=${name ?? ""}`,
  );
  const result = (await data.json()) as
    | (CourseFeedback & Partial<{ user: User }>)
    | (CourseFeedback & { user: User })[];
  return result;
}

export async function getCourseMembersWithRoleAndAccomplishments(
  layerId: string,
): Promise<CourseMember[]> {
  const users = await fetch(api.getCourseMembers + "?layerId=" + layerId, {
    method: "GET",
  });
  if (!users.ok) {
    toast.responseError({
      response: users,
      title: "toast_user_management_error3",
    });
    return [];
  }
  const getUsers = await users.json();
  return getUsers.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getInitialCourseData(
  layerId: string,
): Promise<InitialCourseData> {
  const data = await fetch(`${api.getInitialCourseData}${layerId}`, {
    method: "GET",
  });

  return await data.json();
}

export async function deleteCourse(layerId: string) {
  await structureHandler.delete.layer(layerId);

  const { tabs, setTabs } = useNavigation.getState();
  const { suggestions, setSuggestions } = useSuggestions.getState();

  const newCourses = tabs.filter((tab) => tab.id !== layerId);
  const newSuggestions = suggestions.filter(
    (suggestion) => suggestion.id !== layerId,
  );

  setTabs(newCourses);
  setSuggestions(newSuggestions);
}
