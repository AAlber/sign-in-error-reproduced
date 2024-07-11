import * as clerkServerFn from "@clerk/nextjs/server";
import type { User } from "@prisma/client";
import cuid from "cuid";
import {
  apiTestHandler,
  createMockUser,
  createUserWithRoleInstitutionAndLayersData,
} from "@/__tests__/helpers";
import { testApiHandler } from "@/__tests__/helpers/api";
import type { MockLayer, MockOrganization } from "@/__tests__/helpers/types";
import createInviteApiHandler from "@/src/pages/api/invite/create";
import { prisma } from "@/src/server/db/client";
import { getLayersForUserBasedOnRoles } from "@/src/server/functions/server-administration-dashboard";
import { getUserCoursesWithProgressData } from "@/src/server/functions/server-course/dashboard-course-grid";
import type { CreateInvite } from "@/src/types/invite.types";

const getAuth = jest.spyOn(clerkServerFn, "getAuth");

describe("Layer H24 Invite CRUD", () => {
  /**
   * InviteTypes = "email-institution" | "email-layer" | "24h";
   * InviteAccessType = "institution" | "layer";
   *
   * layerInvite structure = invitation/{layerId}/{token}
   *
   * example:
   * generated invite:
   * http://localhost:3000/invitation/clq6dn1tl00023b6nr7wqyjoj/clr943m8r00043b6s7uk9tqc7
   *
   * process invite:
   * http://localhost:3000/process-invitation/clq6dn1tl00023b6nr7wqyjoj/clr943hok00023b6sewmv14vu
   */

  let adminUser: User,
    invitedUser: User,
    educator: User,
    layer: MockLayer,
    institution: MockOrganization,
    token: string,
    result: any;

  beforeAll(async () => {
    // INITIALIZE VARIABLES
    const mock = await createUserWithRoleInstitutionAndLayersData();

    if (!mock.layers[0]) throw new Error("Flaky test");
    layer = mock.layers[0];

    adminUser = mock.user;
    institution = mock.institution;

    invitedUser = createMockUser({});
    educator = createMockUser({});

    await prisma.user.create({
      data: {
        email: invitedUser.email,
        name: invitedUser.name,
        id: invitedUser.id,
      },
    });

    await prisma.user.create({
      data: {
        email: educator.email,
        name: educator.name,
        id: educator.id,
      },
    });

    const anotherLayer = await testApiHandler.layer.create({
      id: cuid(),
      institution_id: institution.id,
      isCourse: false,
      name: "anotherLayer",
      parent_id: layer.id,
    });

    await testApiHandler.layer.create({
      id: cuid(),
      institution_id: institution.id,
      isCourse: true,
      name: "courseLayer",
      parent_id: anotherLayer.id,
    });

    getAuth.mockReturnValue({ userId: adminUser.id } as any);
  });

  it("Creates a H24 Layer Invite", async () => {
    token = cuid();
    result = await testApiHandler.invite.create({
      role: "member",
      token,
      layerId: layer.id,
      inviteAccessType: "layer",
      inviteType: "24h",
    });

    expect(result.token).toBe(token);
  });

  it("Disallows Unauthorized users from creating layer invites", async () => {
    // switch to new user2
    getAuth.mockReturnValue({ userId: invitedUser.id } as any);
    const token = cuid();

    const unauthorizedResult = await apiTestHandler(createInviteApiHandler, {
      method: "POST",
      body: {
        role: "member",
        token,
        layerId: layer.id,
        inviteAccessType: "layer",
        inviteType: "24h",
      } as CreateInvite,
    });
    expect(unauthorizedResult._getStatusCode()).toBe(401);
  });

  it("GETS valid invite", async () => {
    result = await testApiHandler.invite.get({ token, layerId: layer.id });

    expect(result.hasBeenUsed).toBeFalsy();
    expect(result.token).toBe(token);
  });

  it("invitedUser Joins layer successfully", async () => {
    const joinResult = await testApiHandler.invite.join({
      inviteId: result.id,
      token: result.token,
    });

    expect(joinResult.success).toBeTruthy();
  });

  it("Validates that invitedUser is a member of the institution/layer and has access to resources", async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: { id: invitedUser.id },
    });

    expect(user.currentInstitution).toBe(institution.id);

    const roles = await prisma.role.findMany({
      where: { layerId: layer.id, institutionId: institution.id },
    });

    expect(roles.some((role) => role.userId === invitedUser.id)).toBeTruthy();
  });

  it("doesNotNeedToRedoCoreInviteProcess", async () => {
    const joinResult = await testApiHandler.invite.join({
      inviteId: result.id,
      token: result.token,
    });

    expect(joinResult.success).toBeTruthy();
  });

  it("Makes sure invitedUser has access to layers and courses within invited layer", async () => {
    const roles = await prisma.role.findMany({
      where: { layerId: layer.id, institutionId: institution.id },
    });

    expect(roles.some((role) => role.userId === invitedUser.id)).toBeTruthy();

    // invitedUser should have access to course inside layer > anotherLayer > course
    const courses = await getUserCoursesWithProgressData(invitedUser.id);
    expect(courses.length).toBe(1);
  });

  it("convert user to a moderator and assert that user can access subLayers", async () => {
    getAuth.mockReturnValue({ userId: adminUser.id } as any);

    const result = await testApiHandler.role.create({
      layerId: layer.id,
      role: "moderator",
      userId: invitedUser.id,
    });

    expect(result.message).toBe("success");

    const layers = await getLayersForUserBasedOnRoles(
      invitedUser.id,
      institution.id,
    );

    // invitedUser should now have access to administration layerTree
    expect(layers.children.length).toBeGreaterThan(0);
  });

  it("An Educator has access to all sublayers", async () => {
    // switch to the educator user and join layer
    getAuth.mockReturnValue({ userId: educator.id } as any);

    const invite = await testApiHandler.invite.get({
      layerId: layer.id,
      token,
    });
    const result = await testApiHandler.invite.join({
      inviteId: invite.id,
      token,
    });
    expect(result.success).toBeTruthy();

    const courses = await getUserCoursesWithProgressData(invitedUser.id);

    const layers = await getLayersForUserBasedOnRoles(
      invitedUser.id,
      institution.id,
    );

    expect(courses.length).toBeGreaterThanOrEqual(1);
    expect(layers.children.length).toBeGreaterThanOrEqual(1);
  });
});
