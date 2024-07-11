import * as clerkServerFn from "@clerk/nextjs/server";
import type { Invite, User } from "@prisma/client";
import cuid from "cuid";
import {
  apiTestHandlerWithJson,
  createMockUser,
  createUserWithRoleInstitutionAndLayersData,
} from "@/__tests__/helpers";
import { testApiHandler } from "@/__tests__/helpers/api";
import type { MockLayer, MockOrganization } from "@/__tests__/helpers/types";
import joinInviteApiHandler from "@/src/pages/api/invite/join";
import { prisma } from "@/src/server/db/client";
import { getLayersForUserBasedOnRoles } from "@/src/server/functions/server-administration-dashboard";
import { getUserCoursesWithProgressData } from "@/src/server/functions/server-course/dashboard-course-grid";
import type { InviteResponse } from "@/src/types/invite.types";

const getAuth = jest.spyOn(clerkServerFn, "getAuth");

describe("Layer Invite via Email API test", () => {
  /**
   * Invite users make sure users also have access to sublayers after joining parent layer
   */

  let adminUser: User,
    invitedUser: User,
    educator: User,
    anotherUser: User,
    layer: MockLayer,
    organization: MockOrganization,
    token: string,
    result: any;

  beforeAll(async () => {
    // INITIALIZE VARIABLES
    const mock = await createUserWithRoleInstitutionAndLayersData();

    if (!mock.layers[0]) throw new Error("Flaky test");
    layer = mock.layers[0];

    adminUser = mock.user;
    organization = mock.institution;
    invitedUser = createMockUser({});
    educator = createMockUser({});

    for (const user of [invitedUser, educator]) {
      await prisma.user.create({
        data: { email: user.email, name: user.name, id: user.id },
      });
    }

    getAuth.mockReturnValue({ userId: adminUser.id } as any);

    /**
     * create another course and a layer to later on assert that
     * invitedUser will have access to these layers
     */

    const anotherLayer = await testApiHandler.layer.create({
      id: cuid(),
      institution_id: organization.id,
      isCourse: false,
      name: "anotherLayer",
      parent_id: layer.id,
    });

    await testApiHandler.layer.create({
      id: cuid(),
      institution_id: organization.id,
      isCourse: true,
      name: "courseLayer",
      parent_id: anotherLayer.id,
    });
  });

  it("Creates a layer invite via email to an existing user", async () => {
    const [emailInviteResult] = (await testApiHandler.invite.create({
      role: "member",
      emails: [invitedUser.email],
      layerId: layer.id,
      inviteAccessType: "layer",
      inviteType: "email-layer",
    })) as [Invite];

    expect(emailInviteResult.email).toBe(invitedUser.email);
    expect(emailInviteResult.target).toBe(layer.id);
    token = emailInviteResult.token;
  });

  it("GETS valid invite", async () => {
    getAuth.mockReturnValue({ userId: invitedUser.id } as any);

    result = await testApiHandler.invite.get({ token, layerId: layer.id });

    expect(result.hasBeenUsed).toBeFalsy();
    expect(result.token).toBe(token);
  });

  it("invitedUser Joins layer successfully", async () => {
    const joinResult = await apiTestHandlerWithJson<InviteResponse>(
      joinInviteApiHandler,
      {
        method: "POST",
        body: {
          inviteId: result.id,
          token: result.token,
        },
      },
    );

    expect(joinResult.success).toBeTruthy();
    expect(joinResult.updatedUser?.currentInstitutionId).toBe(organization.id);
    result = joinResult;
  });

  it("Makes sure invite is updated to hasBeenUsed", async () => {
    const invite = await prisma.invite.findFirstOrThrow({
      where: {
        id: result.id,
      },
    });

    expect(invite.hasBeenUsed).toBeTruthy();
  });

  it("Makes sure invitedUser has access to layers and courses within invited layer", async () => {
    const roles = await prisma.role.findMany({
      where: { userId: invitedUser.id },
    });

    expect(roles.length).toBe(4); // 1 organization, 1 parentLayer, 1 subLayer, 1courseLayer
    expect(roles.every(({ role }) => role === "member")).toBeTruthy();

    // invitedUser should have access to course inside layer > anotherLayer > course
    const courses = await getUserCoursesWithProgressData(invitedUser.id);
    expect(courses.length).toBe(1);
  });

  it("convert user to a moderator and assert that user now can view topmost layers", async () => {
    getAuth.mockReturnValue({ userId: adminUser.id } as any);

    const result = await testApiHandler.role.create({
      layerId: layer.id,
      role: "moderator",
      userId: invitedUser.id,
    });

    expect(result.message).toBe("success");

    const layers = await getLayersForUserBasedOnRoles(
      invitedUser.id,
      organization.id,
    );

    // invitedUser should now have access to administration layerTree
    expect(layers.children.length).toBeGreaterThan(0);
  });

  it("An Educator has access to all sublayers", async () => {
    // first switch to new moderator to create invitation
    getAuth.mockReturnValue({ userId: invitedUser.id } as any);

    const [emailInviteResult] = (await testApiHandler.invite.create({
      role: "member",
      emails: [educator.email],
      layerId: layer.id,
      inviteAccessType: "layer",
      inviteType: "email-layer",
    })) as [Invite];

    // switch to the educator user and join layer
    getAuth.mockReturnValue({ userId: educator.id } as any);

    const invite = await testApiHandler.invite.get({
      layerId: layer.id,
      token: emailInviteResult.token,
    });

    const result = await testApiHandler.invite.join({
      inviteId: invite.id,
      token: emailInviteResult.token,
    });

    expect(result.success).toBeTruthy();

    const courses = await getUserCoursesWithProgressData(invitedUser.id);

    const layers = await getLayersForUserBasedOnRoles(
      invitedUser.id,
      organization.id,
    );

    expect(courses.length).toBeGreaterThanOrEqual(1);
    expect(layers.children.length).toBeGreaterThanOrEqual(1);
  });

  it("Creates a course invite via email to non registered user", async () => {
    /**
     * Current behavior is when inviting via email to a course,
     * the inviteAccess type will be "institution" and inviteType = "email-institution"
     *
     * when the member joins, he is not yet a member of the course/layer but already
     * a member of the organization
     */
    getAuth.mockReturnValue({ userId: adminUser.id } as any);

    const outerLayer = await testApiHandler.layer.create({
      id: cuid(),
      institution_id: organization.id,
      isCourse: false,
      name: "outerLayer",
      parent_id: organization.id,
    });

    const courseId = cuid();
    await testApiHandler.layer.create({
      id: courseId,
      institution_id: organization.id,
      isCourse: true,
      name: "courseLayer",
      parent_id: outerLayer.id,
    });

    anotherUser = createMockUser({});
    const createdUser = await testApiHandler.user.institution.create({
      email: anotherUser.email,
      name: anotherUser.name,
      role: "member",
      giveAccessToLayer: courseId,
    });

    Object.assign(anotherUser, createdUser);
    expect(anotherUser.id).toBe(createdUser.id);

    const [emailInvite] = (await testApiHandler.invite.create({
      role: "member",
      emails: [anotherUser.email],
      inviteAccessType: "institution",
      inviteType: "email-institution",
    })) as [Invite];

    expect(emailInvite.email).toBe(anotherUser.email);
    expect(emailInvite.target).toBe(organization.id);

    // switch to the anotherUser
    getAuth.mockReturnValue({ userId: createdUser.id } as any);
    const invite = await testApiHandler.invite.get({
      layerId: organization.id,
      token: emailInvite.token,
    });

    const result = await testApiHandler.invite.join({
      inviteId: invite.id,
      token: emailInvite.token,
    });

    expect(result.success).toBeTruthy();

    // just overwrite the global layer var at this point
    layer = outerLayer;
  });

  it("Correct number of roles are generated", async () => {
    const roles = await prisma.role.findMany({
      where: { userId: anotherUser.id },
    });

    expect(roles.length).toBe(1 + 1); // 1 organization, 1 courseLayer ONLY
    expect(roles.every(({ layerId }) => layerId !== layer.id)).toBeTruthy(); //must not have access to parent of courseLayer, only courseLayer
    expect(roles.every(({ role }) => role === "member")).toBeTruthy(); // only a member role should be generated
  });
});
