import * as clerkServerFn from "@clerk/nextjs/server";
import type { RatingSchemaValue, User } from "@prisma/client";
import cuid from "cuid";
import {
  apiTestHandler,
  apiTestHandlerWithJson,
  createMockAppointment,
  createMockContentBlock,
  createMockUser,
  createMockUserRole,
  createUserWithRoleInstitutionAndLayersData,
} from "@/__tests__/helpers";
import type { MockOrganization } from "@/__tests__/helpers/types";
import createLayerApiHandler from "@/src/pages/api/administration/create-layer";
import createContentBlockApiHandler from "@/src/pages/api/content-block/create";
import getUserStatusApiHandler from "@/src/pages/api/content-block/get-user-status";
import updateUserStatusContentBlockApiHandler from "@/src/pages/api/content-block/update-user-status";
import upsertUserGradingApiHandler from "@/src/pages/api/content-block/upsert-user-grading";
import updateCourseGoalApiHandler, {
  type UpsertCourseGoalArgs,
} from "@/src/pages/api/course-goals/upsert-course-goal/[layerId]";
import overwriteCourseUserStatusApiHandler from "@/src/pages/api/course-overwritten-user-status/overwrite-course-user-status";
import removeOverwrittenCourseUserStatusApiHandler from "@/src/pages/api/course-overwritten-user-status/remove-overwritten-course-user-status";
import getAllCourseMembersApiHandler from "@/src/pages/api/courses/get-all-course-members";
import createRatingSchemaApiHandler from "@/src/pages/api/rating-schema/create-rating-schema";
import createRatingSchemaValueApiHandler from "@/src/pages/api/rating-schema/create-rating-schema-value";
import getRatingSchemasApiHandler from "@/src/pages/api/rating-schema/get-rating-schemas";
import updateRatingSchemaApiHandler from "@/src/pages/api/rating-schema/update-rating-schema";
import createRoleApiHandler, {
  type CreateRoleApiArgs,
} from "@/src/pages/api/role/create-role";
import deleteRoleApiHandler, {
  type DeleteRoleApiArgs,
} from "@/src/pages/api/role/delete-role";
import onlineAttendanceCheckInApiHandler from "@/src/pages/api/schedule/attendence/online-attendence-check-in";
import createAppointmentApiHandler from "@/src/pages/api/schedule/create-appointment";
import { prisma } from "@/src/server/db/client";
import type { CreateLayerAndCourseReturn } from "@/src/server/functions/server-administration";
import type {
  AppointmentDataTypeWithSeriesData,
  ScheduleAppointment,
} from "@/src/types/appointment.types";
import type { UpsertUserGrading } from "@/src/types/content-block/types/cb-types";
import type { UpdateRatingSchema } from "@/src/types/rating-schema.types";
import type { CreateLayerApiArgs } from "@/src/types/server/administration.types";

jest.mock("../../../src/server/functions/server-appointment", () => ({
  __esModule: true,
  ...jest.requireActual("../../../src/server/functions/server-appointment"),
  isOnlineAppointmentHappeningSoonOrNow: jest.fn().mockResolvedValue(true),
}));

/**
 * we also need to mock the `getAuth` function from @clerk so we can
 * switch between an admin user and a normal user/student
 */
const getAuth = jest.spyOn(clerkServerFn, "getAuth");
const timeout = 120000;

describe("course-user-management smoke test APIs", () => {
  let adminUser: User,
    organization: MockOrganization,
    testUsers: User[],
    mockAppointment: ReturnType<typeof createMockAppointment>;

  /**
   * This test file emulates the (complete) course user management API workflow, closely resembling the API queries made by
   * client side components:
   *
   * - create appointments, and contentblocks
   * - create admin and test users to perform test against
   * - we test the overwritten status of a user
   * - checkin a testUser to appointment
   * - create roles for adminUser and testUsers and attach roles to correct courseLayerId
   * - create and delete ratingSchema
   * - verify testUser has passed the course
   */

  beforeAll(async () => {
    const mockData = await createUserWithRoleInstitutionAndLayersData();
    adminUser = mockData.user;
    organization = mockData.institution;
    testUsers = new Array(3).fill(undefined).map(() =>
      createMockUser({
        currentInstitution: organization.id,
      }),
    );
    mockAppointment = createMockAppointment({
      dateTime: new Date().toISOString(),
    });
  }, timeout);

  it(
    "Successfully replicates the [complete] course user management workflow",
    async () => {
      // switch to adminUser
      getAuth.mockReturnValue({ userId: adminUser.id } as any);

      /**************** INITIALIZE TEST VARIABLES *****************/

      const courseLayer =
        await apiTestHandlerWithJson<CreateLayerAndCourseReturn>(
          createLayerApiHandler,
          {
            method: "POST",
            body: {
              id: cuid(),
              institution_id: organization.id,
              isCourse: true,
              name: "name",
              parent_id: organization.id,
            } as CreateLayerApiArgs,
          },
        );

      // just create a reusable getCourseMembers function
      async function getCourseMembers() {
        return apiTestHandlerWithJson<CourseMember[]>(
          getAllCourseMembersApiHandler,
          {
            method: "GET",
            query: {
              layerId: courseLayer.id,
            },
          },
        );
      }

      // add an admin role for the courseLayer
      const adminUserRole = createMockUserRole({
        institutionId: organization.id,
        layerId: courseLayer.id,
        role: "admin",
        userId: adminUser.id,
      });

      await prisma.role.create({
        data: {
          role: adminUserRole.role,
          institutionId: organization.id as string,
          userId: adminUserRole.userId,
          layerId: courseLayer.id,
        },
      });

      // create mock contentBlocks to test against
      const mockedCbs = new Array(2).fill(undefined).map(() => {
        return createMockContentBlock({
          id: cuid(),
          layerId: courseLayer.id,
          type: "HandIn",
          specs: {
            allowedFileTypes: "*",
            isGroupSubmission: false,
            isSharedSubmission: false,
          },
        });
      });

      for (const cb of mockedCbs) {
        await apiTestHandler(createContentBlockApiHandler, {
          method: "POST",
          body: cb,
        });
      }

      // create an appointment
      const createAppointmentApiHandlerResult = await apiTestHandlerWithJson<
        ScheduleAppointment[]
      >(createAppointmentApiHandler, {
        method: "POST",
        body: {
          ...mockAppointment,
          layerIds: [courseLayer.id],
          isSeries: false,
        } as AppointmentDataTypeWithSeriesData,
      });

      expect(createAppointmentApiHandlerResult.length).toBe(1);

      // just create roles for the test users

      const testUsersWithMockRole = testUsers.map((user) => {
        return {
          ...user,
          role: createMockUserRole({
            role: "member",
            institutionId: organization.id,
            layerId: courseLayer.id,
            userId: user.id,
          }),
        };
      });

      const testUsersWithRole = await Promise.all(
        testUsersWithMockRole.map(async (user) => {
          return await prisma.user.create({
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              roles: {
                create: {
                  role: user.role.role,
                  active: true,
                  institutionId: user.role.institutionId,
                  layerId: user.role.institutionId,
                },
              },
            },
            include: { roles: true },
          });
        }),
      );

      for (const user of testUsersWithRole) {
        await apiTestHandlerWithJson(createRoleApiHandler, {
          method: "POST",
          body: {
            layerId: courseLayer.id,
            role: user.roles[0]?.role,
            userId: user.id,
          } as CreateRoleApiArgs,
        });
      }

      /************************************************
       * 1. Create Course Goals
       *    - add attendance goal
       *    - add blockGoals
       ************************************************/

      const staticAttendanceNumber = 20;
      await apiTestHandler(updateCourseGoalApiHandler, {
        method: "POST",
        body: {
          layerId: courseLayer.id,
          attendanceGoal: staticAttendanceNumber,
          contentBlockId: mockedCbs[0]?.id,
        } as UpsertCourseGoalArgs,
      });

      const courseGoal = await prisma.contentBlockCourseGoal.findFirstOrThrow({
        where: { layerId: courseLayer.id },
        include: { blockGoals: true },
      });

      expect(courseGoal.attendanceGoal).toBe(staticAttendanceNumber);
      expect(courseGoal.blockGoals[0]?.id).toBe(mockedCbs[0]?.id);

      /**************************************************
       * 1. SET AND OVERWRITE USERSTATUS
       * 2. REMOVE OVERWRITTEN USERSTATUS
       ************************************************/
      const testUser1 = testUsersWithRole[0];

      const overwriteCourseUserStatusResult = await apiTestHandlerWithJson<{
        passed: boolean;
        id: string;
      }>(overwriteCourseUserStatusApiHandler, {
        method: "POST",
        body: {
          layerId: courseLayer.id,
          notes: "TESTNOTES",
          passed: true,
          userId: testUser1?.id,
        } as OverwriteCourseUserStatus,
      });

      expect(overwriteCourseUserStatusResult.passed).toBeTruthy();

      const removeOverwrittenUserStatusResult = await apiTestHandlerWithJson(
        removeOverwrittenCourseUserStatusApiHandler,
        {
          method: "POST",
          body: {
            id: overwriteCourseUserStatusResult.id,
          },
        },
      );

      expect(removeOverwrittenUserStatusResult).toBeDefined();

      // switch to test users and join the test appointment

      for (const user of testUsersWithRole) {
        if (user.id === testUsersWithRole.at(-1)?.id) continue;

        getAuth.mockReturnValue({ userId: user.id } as any);

        const onlineAttendanceCheckInResult = await apiTestHandlerWithJson<{
          success: boolean;
        }>(onlineAttendanceCheckInApiHandler, {
          method: "POST",
          body: {
            appointmentId: createAppointmentApiHandlerResult[0]?.id,
          },
        });

        expect(onlineAttendanceCheckInResult.success).toBeTruthy();

        const updateUserStatusContentBlockJsonResult =
          await apiTestHandlerWithJson<{ success: true }>(
            updateUserStatusContentBlockApiHandler,
            {
              method: "POST",
              body: {
                blockId: mockedCbs[0]?.id,
                data: {
                  status: "FINISHED",
                  userData: {
                    content: "{}",
                    lastEditedAt: new Date().toISOString(),
                  },
                },
              },
            },
          );
        expect(updateUserStatusContentBlockJsonResult.success).toBeTruthy();
      }

      /**
       *
       * Switch to Admin user and get all courseMembers
       * assert that some user have passed the course
       */
      getAuth.mockReturnValue({ userId: adminUser.id } as any);

      let courseMembers = await getCourseMembers();
      const firstUser = courseMembers.find((i) => i.id === testUser1?.id);
      expect(firstUser?.attendanceStatus.isRateSufficient).toBeTruthy();
      expect(firstUser?.attendanceStatus.percentage).toBe(100); // only 1 appointment attended

      const getUserStatusOfCbResult = await apiTestHandlerWithJson<
        {
          status: string;
        }[]
      >(getUserStatusApiHandler, {
        method: "GET",
        query: {
          blockId: mockedCbs[0]?.id,
          includeUserData: "false",
        },
      });

      /**
       * should have 2 users passing course at this point.
       * just count the number of members who have passed course,
       */
      expect(
        getUserStatusOfCbResult.reduce(
          (a, c) => a + Number(c.status === "FINISHED"),
          0,
        ),
      ).toBe(2);

      // Create and ratingSchema and ratingSchemaValue

      const createRatingSchemaResult = await apiTestHandlerWithJson<{
        id: string;
        passPercentage: number;
        name: string;
      }>(createRatingSchemaApiHandler, {
        method: "POST",
        body: { name: "TEST RATING SCHEMA" },
      });

      expect(createRatingSchemaResult.passPercentage).toBe(50); // default value

      const createRatingSchemaValueResult =
        await apiTestHandlerWithJson<RatingSchemaValue>(
          createRatingSchemaValueApiHandler,
          {
            method: "POST",
            body: {
              name: "fail",
              min: 0,
              max: 49,
              ratingSchemaId: createRatingSchemaResult.id,
            },
          },
        );

      const updateRatingSchemaResult = await apiTestHandlerWithJson<{
        passPercentage: string;
      }>(updateRatingSchemaApiHandler, {
        method: "PUT",
        body: {
          name: "TEST RATING SCHEMA 2",
          default: true,
          id: createRatingSchemaResult.id,
          passPercentage: 70,
        } as UpdateRatingSchema,
      });

      expect(updateRatingSchemaResult.passPercentage).toBe(70);

      const getRatingSchemasResult = await apiTestHandlerWithJson<
        {
          status: string;
        }[]
      >(getRatingSchemasApiHandler, {
        method: "GET",
      });

      expect(Array.isArray(getRatingSchemasResult)).toBeTruthy();
      expect(getRatingSchemasResult.length).toBe(1);

      /***************************** UPSERT USERGRADING ********************************/

      for (const user of testUsersWithRole) {
        if (user.id === testUsersWithRole.at(-1)?.id) continue;
        await apiTestHandlerWithJson(upsertUserGradingApiHandler, {
          method: "POST",
          body: {
            blockId: mockedCbs[0]?.id,
            max: createRatingSchemaValueResult.max,
            min: createRatingSchemaValueResult.min,
            ratingLabel: createRatingSchemaValueResult.name,
            passed: false,
            schemaName: createRatingSchemaResult.name,
            userId: user.id,
          } as UpsertUserGrading,
        });
      }

      /***************************** REMOVE A USER FROM COURSE ********************************/

      await apiTestHandlerWithJson(deleteRoleApiHandler, {
        method: "POST",
        body: {
          layerId: courseLayer.id,
          userId: testUser1?.id,
        } as DeleteRoleApiArgs,
      });

      courseMembers = await getCourseMembers();
      expect(courseMembers.length).toBe(2);

      // we assert however that gradings of previous members of the course will show

      const getUserStatusOfCbResult2 = await apiTestHandlerWithJson<
        {
          id: string;
          status: string;
        }[]
      >(getUserStatusApiHandler, {
        method: "GET",
        query: {
          blockId: mockedCbs[0]?.id,
          includeUserData: "false",
        },
      });

      expect(getUserStatusOfCbResult2.length).toBe(3);
      expect(
        getUserStatusOfCbResult2.some((i) => i.id === testUser1?.id),
      ).toBeTruthy();
    },
    timeout,
  );
});
