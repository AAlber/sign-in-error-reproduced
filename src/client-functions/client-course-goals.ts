import type { Prisma } from "@prisma/client";
import api from "@/src/pages/api/api";
import type { UpsertCourseGoalArgs } from "@/src/pages/api/course-goals/upsert-course-goal/[layerId]";
import { toast } from "../components/reusable/toaster/toast";
import { log } from "../utils/logger/logger";

async function getCourseGoals(layerId: string) {
  log.context("Get Course Goals", { layerId });
  try {
    log.info("Fetching course goals...");
    const response = await fetch(`${api.getCourseGoals}/${layerId}`);
    if (!response.ok) {
      log.response(response);
      toast.responseError({
        response,
        title: "toast_client_course_goals_get_error",
      });
      return null;
    }
    const goals =
      (await response.json()) as Prisma.ContentBlockCourseGoalGetPayload<{
        include: { blockGoals: true };
      }> | null;
    log.info("Course goals fetched successfully.");
    return goals;
  } catch (error) {
    log.error(error);
  }
}

/** creates or updates a course goal */
async function upsertCourseGoal(
  args: UpsertCourseGoalArgs,
): Promise<{ success: boolean }> {
  log.info("Upsert Course Goal", args);
  const { layerId, ...rest } = args;
  try {
    log.info("Upserting course goal...");
    const response = await fetch(`${api.upsertCourseGoal}/${layerId}`, {
      method: "POST",
      body: JSON.stringify(rest),
    });

    if (!response.ok) {
      log.response(response);
      toast.responseError({
        response,
        title: "toast_client_course_goals_create_error",
      });
      return Promise.resolve({ success: false });
    }
    const goals = await response.json();
    log.info("Course goal upserted successfully.");
    return goals;
  } catch (error) {
    log.error(error);
    return Promise.resolve({ success: false });
  }
}

async function removeContentBlockFromCourseGoal(
  layerId: string,
  blockId: string,
) {
  log.context("Remove Content Block From Course Goal", { layerId, blockId });
  try {
    log.info("Removing content block from course goal...");
    const response = await fetch(`${api.removeContentBlockFromCourseGoal}`, {
      method: "DELETE",
      body: JSON.stringify({ layerId, blockId }),
    });

    if (!response.ok) {
      log.response(response);
      toast.responseError({
        response,
        title: "toast_client_course_goals_delete_error",
      });

      return Promise.resolve({ success: false });
    }

    log.info("Content block removed from course goal successfully.");
    return (await response.json()) as { success: true };
  } catch (error) {
    log.error(error);
    return Promise.resolve({ success: false });
  }
}
const courseGoalHandler = {
  create: {
    goal: upsertCourseGoal,
  },
  get: {
    courseGoals: getCourseGoals,
  },
  update: {
    goal: upsertCourseGoal,
  },
  delete: {
    contentBlock: removeContentBlockFromCourseGoal,
  },
};

export default courseGoalHandler;
