import * as clerkServerFn from "@clerk/nextjs/server";
import type { Prisma, User } from "@prisma/client";
import {
  apiTestHandler,
  createMockContentBlock,
  createUserWithRoleInstitutionAndLayersData,
} from "@/__tests__/helpers";
import type { MockLayer } from "@/__tests__/helpers/types";
import createContentBlockApiHandler from "@/src/pages/api/content-block/create";
import deleteContentBlockApiHandler from "@/src/pages/api/content-block/delete";
import getCourseGoalsApiHandler from "@/src/pages/api/course-goals/[layerId]";
import removeContentBlockCourseGoalsApiHandler from "@/src/pages/api/course-goals/remove-content-block";
import type { UpsertCourseGoalArgs } from "@/src/pages/api/course-goals/upsert-course-goal/[layerId]";
import upsertCourseGoalsApiHandler from "@/src/pages/api/course-goals/upsert-course-goal/[layerId]";
import type { ContentBlock } from "@/src/types/course.types";

const getAuth = jest.spyOn(clerkServerFn, "getAuth");
const timeout = 120000;

describe("course-goals API CRUD test", () => {
  let adminUser: User, layers: MockLayer[];

  beforeAll(async () => {
    const mockData = await createUserWithRoleInstitutionAndLayersData();
    adminUser = mockData.user;
    layers = mockData.layers;
  }, timeout);

  it("CRUD works", async () => {
    /**************** INITIALIZE VARIABLES *****************/

    const theLayer = layers[0]; // just assume layer is a course
    if (!theLayer) throw new Error("Flaky Test");

    getAuth.mockReturnValue({ userId: adminUser.id } as any);

    const mockHandInBlock = createMockContentBlock<"HandIn">({
      type: "HandIn",
      specs: {
        allowedFileTypes: "",
        isGroupSubmission: false,
        isSharedSubmission: false,
      },
      layerId: theLayer.id,
    });

    const mockAssessmentBlock = createMockContentBlock<"Assessment">({
      type: "Assessment",
      specs: { content: "{}" },
      layerId: theLayer.id,
    });

    const createHandInResult = await apiTestHandler(
      createContentBlockApiHandler,
      {
        method: "POST",
        body: mockHandInBlock,
      },
    );

    const createAssessmentResult = await apiTestHandler(
      createContentBlockApiHandler,
      {
        method: "POST",
        body: mockAssessmentBlock,
      },
    );

    const handIn = createHandInResult._getJSONData() as ContentBlock;
    const assessment = createAssessmentResult._getJSONData() as ContentBlock;

    /**************** GET GOALS OF COURSE *****************/

    // just create a reusable getApiHandler here, we'll need this to assert response later on
    async function getGoalsOfCourse() {
      if (!theLayer) throw new Error("Flaky Test");
      const result = await apiTestHandler(getCourseGoalsApiHandler, {
        method: "GET",
        query: {
          layerId: theLayer.id,
        },
      });

      return result._getJSONData() as Prisma.ContentBlockCourseGoalGetPayload<{
        include: { blockGoals: true };
      }>;
    }

    // we expect null here since this is fresh
    let getCourseGoals = await getGoalsOfCourse();
    expect(getCourseGoals).toBeNull();

    /**************** CREATE / UPDATE / UPSERT *****************/

    const createGoal = await apiTestHandler(upsertCourseGoalsApiHandler, {
      method: "POST",
      query: { layerId: theLayer.id },
      body: { attendanceGoal: 20 } as UpsertCourseGoalArgs,
    });

    expect(createGoal._getJSONData()?.success).toBeTruthy();

    let updateGoal = await apiTestHandler(upsertCourseGoalsApiHandler, {
      method: "POST",
      query: { layerId: theLayer.id },
      body: { attendanceGoal: 21 } as UpsertCourseGoalArgs,
    });

    expect(updateGoal._getJSONData()?.success).toBeTruthy();

    // we assert the attendance has been updated
    getCourseGoals = await getGoalsOfCourse();
    expect(getCourseGoals.attendanceGoal).not.toBe(20);
    expect(getCourseGoals.attendanceGoal).toBe(21);

    /**************** ADD CONTENT BLOCK TO COURSE GOAL *****************/

    // no contentBlocks added as goal at this point
    expect(getCourseGoals.blockGoals.length).toBe(0);

    updateGoal = await apiTestHandler(upsertCourseGoalsApiHandler, {
      method: "POST",
      query: { layerId: theLayer.id },
      body: { contentBlockId: handIn.id } as UpsertCourseGoalArgs,
    });

    getCourseGoals = await getGoalsOfCourse();
    let courseGoalBlocks = getCourseGoals.blockGoals;

    // assert that handin has been added to the courseGoal
    expect(Array.isArray(courseGoalBlocks)).toBeTruthy();
    expect(courseGoalBlocks[0]?.id).toBe(handIn.id);

    updateGoal = await apiTestHandler(upsertCourseGoalsApiHandler, {
      method: "POST",
      query: { layerId: theLayer.id },
      body: { contentBlockId: assessment.id } as UpsertCourseGoalArgs,
    });

    getCourseGoals = await getGoalsOfCourse();
    expect(getCourseGoals.blockGoals.length).toBe(2);

    /**************** REMOVE / DISCONNECT CONTENT BLOCK FROM COURSE GOAL *****************/

    const removeBlock = await apiTestHandler(
      removeContentBlockCourseGoalsApiHandler,
      {
        method: "DELETE",
        body: { layerId: theLayer.id, blockId: handIn.id },
      },
    );

    expect(removeBlock._getJSONData()?.success).toBeTruthy();

    getCourseGoals = await getGoalsOfCourse();
    courseGoalBlocks = getCourseGoals.blockGoals;

    // assert that the handin contentBlock has been removed from the course's goal
    expect(courseGoalBlocks.length).toBe(1);
    expect(courseGoalBlocks[0]?.id).toBe(assessment.id);

    /**
     * Delete the content block and make sure that courseGoal reflects change -
     * contentBlock is disconnected from Course Goal
     */
    await apiTestHandler(deleteContentBlockApiHandler, {
      method: "DELETE",
      body: {
        blockId: assessment.id,
      },
    });

    getCourseGoals = await getGoalsOfCourse();
    expect(getCourseGoals.blockGoals.length).toBe(0);

    // TODO: fail update when putting attendance/points values more than 100 or less than 0
    // const failUpdate = await apiTestHandler(upsertCourseGoalsApiHandler, {
    //   method: "POST",
    //   query: { layerId: theLayer.id },
    //   body: { attendanceGoal: 101 } as UpsertCourseGoalArgs,
    // });

    // expect(failUpdate.statusCode).toBe(500);
  });
});
