import type { Task, TaskUserDocument } from "@prisma/client";
import useCourse from "../components/course/zustand";
import { toast } from "../components/reusable/toaster/toast";
import useWorkbench, {
  WorkbenchMode,
  WorkbenchType,
} from "../components/workbench-deprecated/zustand";
import api from "../pages/api/api";
import { AssessmentDocumentStatus } from "../types/assessment.types";
import { clearThumbnailsFromContent } from "./client-workbench";

export async function openAssessment(blockId: string) {
  const document: TaskUserDocument & { task: Task } =
    await getAssessmentDocumentByBlockId({
      blockId,
    });
  if (document) {
    const { openWorkbenchFromBlock } = useWorkbench.getState();
    const { hasSpecialRole } = useCourse.getState();
    const content = JSON.parse(document.content);
    openWorkbenchFromBlock({
      content,
      blockId,
      workbenchType: WorkbenchType.ASSESSMENT,
      mode:
        document.task.status === 1 ||
        document.status === AssessmentDocumentStatus.CORRECTED
          ? WorkbenchMode.READONLY
          : hasSpecialRole
          ? WorkbenchMode.REVIEW
          : WorkbenchMode.FILLOUT,
    });
  }
}

export async function openUserAssessment(blockId: string, user: any) {
  const document: TaskUserDocument & { assessment: Task } =
    await getAssessmentUserDocument(blockId, user.id);

  if (document) {
    const { openWorkbenchFromBlock, setSelectedUser } = useWorkbench.getState();
    const content = JSON.parse(document.content);
    openWorkbenchFromBlock({
      content,
      blockId,
      workbenchType: WorkbenchType.ASSESSMENT,
      mode:
        document.assessment.status === 1
          ? WorkbenchMode.READONLY
          : WorkbenchMode.REVIEW,
    });
    setSelectedUser(user);
  }
}

export async function getAssessmentDocumentByBlockId({
  blockId,
}): Promise<any> {
  const response = await fetch(
    api.getAssessmentUserDocumentByContentBlock + blockId,
    { method: "GET" },
  );
  if (!response.ok) {
    if (response.status === 423) {
      return toast.warning("toast_client_assessment.requirement1", {
        icon: "🤚",
        description: "toast_client_assessment.requirement2",
      });
    } else if (response.status === 403) {
      return toast.warning("toast_client_assessment.in_correction1", {
        description: "toast_client_assessment.in_correction2",
      });
    } else {
      return toast.responseError({
        response,
        title: "toast_client_assessment.error1",
      });
    }
  }
  const document = await response.json();
  return document;
}

export async function getAssessmentStatus(blockId: string) {
  const { hasSpecialRole } = useCourse.getState();
  if (hasSpecialRole === true) return getAssessmentModeratorStatus(blockId);
  else return getAssessmentMemberStatus(blockId);
}

export async function getAssessmentModeratorStatus(blockId: string) {
  const status = await fetch(
    api.getAssessmentStatusForModeratorOverview + blockId,
    {
      method: "GET",
    },
  );
  return await status.json();
}

export async function getAssessmentMemberStatus(
  blockId: string,
): Promise<{ status: AssessmentDocumentStatus }> {
  const status = await fetch(
    api.getAssessmentDocumentStatusByBlockId + blockId,
    {
      method: "GET",
    },
  );
  return await status.json();
}

export async function createAssessment(
  content: any,
  blockId: string,
  layerId: string,
) {
  const response = await fetch(api.createAssessment, {
    method: "POST",
    body: JSON.stringify({
      content: JSON.stringify(content),
      blockId,
      layerId,
    }),
  });
  if (response.status === 200) {
    return await response.json();
  } else {
    toast.responseError({
      response,
      title: "toast_client_assessment.error2",
    });
  }
}

export async function updateAssessment(blockId: string) {
  const { content } = useWorkbench.getState();
  const stringifiedContent = JSON.stringify(content, null, 2);

  const response = await fetch(api.updateAssessment, {
    method: "POST",
    body: JSON.stringify({
      content: stringifiedContent,
      blockId,
    }),
  });

  if (response.status === 200) {
    return await response.json();
  } else {
    toast.responseError({
      response,
      title: "toast_client_assessment.error2",
    });
  }
}

export async function updateAssessmentUserDocument({
  userId,
  status,
  shouldRefreshCourse = true,
}) {
  const { content, blockId } = useWorkbench.getState();
  const contentWithoutThumbnails = clearThumbnailsFromContent(content);
  const stringifiedContent = JSON.stringify(contentWithoutThumbnails, null, 2);
  const response = await fetch(api.updateAssessmentUserDocument, {
    method: "POST",
    body: JSON.stringify({
      blockId: blockId,
      userId: userId,
      content: stringifiedContent,
      status: status,
    }),
  });

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_client_assessment.error3",
    });
  }

  await window.queryClient.refetchQueries(["getBlockStatus", blockId]);
  if (shouldRefreshCourse) useCourse.getState().refreshCourse();

  return await response.json();
}

export async function getAssessment({ blockId }): Promise<any> {
  const response = await fetch(api.getAssessment + blockId, { method: "GET" });
  if (!response.ok)
    return toast.responseError({
      response,
      title: "toast_client_assessment.error4",
    });
  const task = await response.json();
  return task;
}

export async function getAssessmentUserDocument(
  blockId: string,
  userId: string,
) {
  const response = await fetch(
    api.getAssessmentUserDocument + blockId + "?userId=" + userId,
    { method: "GET" },
  );
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_client_assessment.error4",
    });
  }
  const document = await response.json();
  return document;
}

export async function getAssessmentMembersStatus(blockId: string) {
  const response = await fetch(
    api.getAssessmentMembersStatus + "?blockId=" + blockId,
    { method: "GET" },
  );
  if (!response.ok) {
    toast.responseError({
      response,
      title: "We couldn't load your document.",
    });
  }
  const states = await response.json();
  return states;
}

export async function publishAssessmentResults(
  blockId: string,
): Promise<boolean> {
  const response = await fetch(api.publishAssessment, {
    method: "POST",
    body: JSON.stringify({
      id: blockId,
    }),
  });

  return response.ok;
}

export const assessmentStatusText = (status: AssessmentDocumentStatus) => {
  return "course_main_content_block_assessment.status_" + status;
};
