import * as clerkServerFn from "@clerk/nextjs/server";
import cuid from "cuid";
import {
  apiTestHandler,
  createMockContentBlock,
  createUserWithRoleInstitutionAndLayersData,
} from "@/__tests__/helpers";
import type { MockOrganization } from "@/__tests__/helpers/types";
import createLayerHandler from "@/src/pages/api/administration/create-layer";
import deleteLayerHandler from "@/src/pages/api/administration/delete-layer";
import createContentBlockApiHandler from "@/src/pages/api/content-block/create";
import type { UpsertCourseGoalArgs } from "@/src/pages/api/course-goals/upsert-course-goal/[layerId]";
import upsertCourseGoalsApiHandler from "@/src/pages/api/course-goals/upsert-course-goal/[layerId]";
import { prisma } from "@/src/server/db/client";
import type { CreateLayerApiArgs } from "@/src/types/server/administration.types";

const timeout = 60000;

describe("createLayer api", () => {
  const getAuth = jest.spyOn(clerkServerFn, "getAuth");
  let organization: MockOrganization, adminId: string;

  beforeAll(async () => {
    const data = await createUserWithRoleInstitutionAndLayersData();
    organization = data.institution;
    adminId = data.user.id;
  });

  it(
    "creates a course layer",
    async () => {
      getAuth.mockReturnValue({ userId: adminId } as any);
      const layerId = cuid();

      // create the layer to test
      await apiTestHandler(createLayerHandler, {
        method: "POST",
        body: {
          id: layerId,
          institution_id: organization.id,
          isCourse: true,
          name: "name",
          parent_id: organization.id,
        } as CreateLayerApiArgs,
      });

      // just create a role for that course
      await prisma.role.create({
        data: {
          role: "admin",
          active: true,
          institutionId: organization.id,
          userId: adminId,
          layerId,
        },
      });

      expect(1).toBe(1);

      const mockHandInBlock = createMockContentBlock<"HandIn">({
        type: "HandIn",
        specs: {
          allowedFileTypes: "",
          isGroupSubmission: false,
          isSharedSubmission: false,
        },
        layerId,
      });

      // just create createHandInResult

      await apiTestHandler(createContentBlockApiHandler, {
        method: "POST",
        body: mockHandInBlock,
      });

      await apiTestHandler(upsertCourseGoalsApiHandler, {
        method: "POST",
        query: { layerId },
        body: { attendanceGoal: 20 } as UpsertCourseGoalArgs,
      });

      // test delete of layer

      const deleteLayerResult = (
        await apiTestHandler(deleteLayerHandler, {
          method: "POST",
          body: {
            layerId,
          },
        })
      )._getJSONData();

      // we expect all of layer relations to be deleted as well

      const blockResult = await prisma.contentBlock.findFirst({
        where: { id: mockHandInBlock.id },
      });

      const courseGoalResult = await prisma.contentBlockCourseGoal.findFirst({
        where: { layerId },
      });

      expect(deleteLayerResult.success).toBeTruthy();
      expect(blockResult).toBeNull();
      expect(courseGoalResult).toBeNull();

      //TODO: test requirements after new requirements update
    },
    timeout,
  );
});
