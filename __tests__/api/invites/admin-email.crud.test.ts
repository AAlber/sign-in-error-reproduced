import * as clerkServerFn from "@clerk/nextjs/server";
import type { Invite, User } from "@prisma/client";
import {
  createMockLayer,
  createMockUser,
  createUserWithRoleInstitutionAndLayersData,
} from "@/__tests__/helpers";
import { testApiHandler } from "@/__tests__/helpers/api";
import type { MockLayer, MockOrganization } from "@/__tests__/helpers/types";
import { prisma } from "@/src/server/db/client";
import {
  flattenLayerTree,
  getLayersForUserBasedOnRoles,
} from "@/src/server/functions/server-administration-dashboard";

const getAuth = jest.spyOn(clerkServerFn, "getAuth");

describe("Invites admins via email to the organization", () => {
  let adminUser: User,
    invitedAdmin: User,
    organization: MockOrganization,
    invite: Invite | Invite[],
    subLayer1: MockLayer,
    courseOfSubLayer1: MockLayer,
    token: string;

  const NUMBER_OF_LAYERS = 3;

  beforeAll(async () => {
    // INITIALIZE VARIABLES
    const mock = await createUserWithRoleInstitutionAndLayersData({
      numLayers: NUMBER_OF_LAYERS,
    });

    if (!mock.layers[0]) throw new Error("Flaky test");

    adminUser = mock.user;
    organization = mock.institution;
    invitedAdmin = createMockUser({});

    subLayer1 = createMockLayer({
      institution_id: organization.id,
      isCourse: false,
      parent_id: organization.id,
      name: "l1",
    });

    courseOfSubLayer1 = createMockLayer({
      institution_id: organization.id,
      isCourse: true,
      parent_id: subLayer1.id,
      name: "c1",
    });

    getAuth.mockReturnValue({ userId: adminUser.id } as any);

    await testApiHandler.layer.create({
      id: subLayer1.id,
      institution_id: subLayer1.institution_id,
      isCourse: false,
      name: subLayer1.name,
      parent_id: subLayer1.parent_id!,
    });

    await testApiHandler.layer.create({
      id: courseOfSubLayer1.id,
      institution_id: courseOfSubLayer1.institution_id,
      isCourse: false,
      name: courseOfSubLayer1.name,
      parent_id: courseOfSubLayer1.parent_id!,
    });
  });

  it("Sends invite to a non-registered email and creates the user", async () => {
    const inactiveAdmin = await testApiHandler.user.institution.create({
      email: invitedAdmin.email,
      name: invitedAdmin.name,
      giveAccessToLayer: organization.id,
      role: "admin",
    });

    Object.assign(invitedAdmin, inactiveAdmin);

    expect(invitedAdmin.id).toBe(inactiveAdmin.id);
    expect(inactiveAdmin.role).toBe("member");
    expect(inactiveAdmin.accessState).toBe("inactive");
    expect(inactiveAdmin.accessLevel).toBe("access");

    invite = await testApiHandler.invite.create({
      emails: [inactiveAdmin.email],
      inviteAccessType: "institution",
      inviteType: "email-institution",
      role: "admin",
    });

    token = (Array.isArray(invite) ? invite[0]?.token : invite.token) ?? "";
  });

  it("Invited admin joins successfully", async () => {
    getAuth.mockReturnValue({ userId: invitedAdmin.id } as any);

    invite = await testApiHandler.invite.get({
      layerId: organization.id,
      token,
    });

    const joinInvite = await testApiHandler.invite.join({
      inviteId: invite.id,
      token: token,
    });

    expect(joinInvite.success).toBeTruthy();
  });

  it("new adminUser has access to all subLayers", async () => {
    const roles = await prisma.role.findMany({
      where: { userId: invitedAdmin.id },
    });

    const organizationLayerRoles = roles.filter(
      ({ layerId }) => layerId === organization.id,
    );

    // 1 admin and 1 moderator role is created for the organization Layer
    expect(organizationLayerRoles.length).toBe(2);
    expect(
      organizationLayerRoles.every(({ role }) =>
        ["admin", "moderator"].includes(role),
      ),
    ).toBeTruthy();

    // only 1 admin role should be created
    expect(roles.filter(({ role }) => role === "admin").length).toBe(1);

    // only admin and moderator roles should be created for all roles
    expect(
      roles.every(({ role }) => ["admin", "moderator"].includes(role)),
    ).toBeTruthy();

    // all other layers should have a moderator role
    const restOfTheLayerRoles = roles.filter(
      ({ layerId }) => layerId !== organization.id,
    );

    expect(
      restOfTheLayerRoles.every(({ role }) => role === "moderator"),
    ).toBeTruthy();

    // roles for: the created layers above (1subLayer + 1courseLayer) + 2 roles for the organization layer (admin & moderator)
    expect(roles.length).toBe(NUMBER_OF_LAYERS + 2 + 2);

    // this will be the layers the invitedAdmin will see in UI
    const layers = await getLayersForUserBasedOnRoles(
      invitedAdmin.id,
      organization.id,
    );

    const flattenedLayers = flattenLayerTree(layers.children);

    expect(flattenedLayers.length).toBe(
      NUMBER_OF_LAYERS + 2, // the created layers above (1sublayer + 1course within sublayer)
    );
  });

  it("removes invitedAdmin from organization and correct number of roles left are generated", async () => {
    const result = await testApiHandler.role.admin.delete({
      userId: invitedAdmin.id,
    });

    // only 1 admin role is removed
    expect(result.count).toBe(NUMBER_OF_LAYERS + 2 + 2);

    const roles = await prisma.role.findMany({
      where: { userId: invitedAdmin.id },
    });

    expect(roles.length).toBe(1);
    expect(roles[0]?.role === "member").toBeTruthy();

    const layers = await getLayersForUserBasedOnRoles(
      invitedAdmin.id,
      organization.id,
    );

    const flattenedLayers = flattenLayerTree(layers.children);
    expect(flattenedLayers.length).toBe(0);
  });
});
