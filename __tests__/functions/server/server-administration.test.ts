import type { User } from "@prisma/client";
import {
  createMockUser,
  createMockUserRole,
  createUserWithRoleInstitutionAndLayersData,
} from "@/__tests__/helpers";
import { prisma } from "@/src/server/db/client";
import { updateLayerRoles } from "@/src/server/functions/server-administration";

describe("updateLayerRoles", () => {
  /**
   * 1. create institution, layer, user, and role
   * 2. create 3 layers - [instiLayer, layer1, layer2, layer3]
   * 3. create 3 users (testUser1, testUser2, testUser3)
   * 4. assign a member role to testUser1 for layer1
   * 5. assign a member role to testUser2 for layer2
   * 6. assign a member role to testUser3 for layer3
   * 7. updateLayerRoles - make layer2 a child of layer1
   * 8. updateLayerRoles - make layer1 a child of layer3
   * 9. assert correct roles without duplicates is created for all layers
   */
  it("returns correct number of roles without duplicates", async () => {
    const {
      user: _adminUser,
      layers,
      institution,
    } = await createUserWithRoleInstitutionAndLayersData({ numLayers: 3 });

    if (!layers) throw new Error("flaky");

    const [layer1, layer2, layer3] = layers;
    if (!layer1 || !layer2 || !layer3) throw new Error("flaky test");

    const createUserWithRolePromise = [layer1.id, layer2.id, layer3.id].map(
      async (layerId) => {
        const user = createMockUser({
          currentInstitution: institution.id as string,
          withInstitutionData: false,
        }) as User;

        // remove userId prop we dont need it when we prismaConnect role to user
        const { userId: _userId, ...role } = createMockUserRole({
          institutionId: institution.id,
          role: "member",
          userId: user.id,
          layerId,
        });

        return await prisma.user.create({
          data: {
            ...user,
            roles: { create: role },
          },
        });
      },
    );

    const [testUser1, testUser2, testUser3] = await Promise.all(
      createUserWithRolePromise,
    );

    if (!testUser1 || !testUser2 || !testUser3) throw new Error("flaky test");

    // at this point there should now have 4 users with roles, [adminUser, testUser1, testUser2, testUser3]

    await prisma.layer.update({
      where: {
        id: layer2.id,
      },
      data: {
        parent_id: layer1.id,
      },
    });

    let updateLayersResult = await updateLayerRoles(layer2.id, layer1.id);

    // the 1 member role from layer1 will be propagated down to layer2 - so 1 more member role will be created for layer2
    expect(Object.keys(updateLayersResult).length).toBe(1);

    let prismaRolesQueryResult = await prisma.role.findMany({
      where: {
        institutionId: institution.id,
        layerId: layer2.id,
      },
    });

    let userIdFromResult = prismaRolesQueryResult.map((u) => u.userId);
    expect(prismaRolesQueryResult.length).toBe(3); // 1 admin role + 2 member roles
    expect(userIdFromResult.includes(testUser3.id)).toBeFalsy(); // testUser3 should not yet have

    // lets now try to make layer1 a child of layer3
    await prisma.layer.update({
      where: {
        id: layer1.id,
      },
      data: {
        parent_id: layer3.id,
      },
    });

    updateLayersResult = await updateLayerRoles(layer1.id, layer3.id);
    prismaRolesQueryResult = await prisma.role.findMany({
      where: {
        institutionId: institution.id,
        layerId: layer2.id,
      },
    });

    /**
     * 1 admin role + 2 member roles from layer2 + 1 inherited role from layer3
     * since layer2 is a child of layer 1, all users should now have access to layer2
     * */
    expect(prismaRolesQueryResult.length).toBe(4);

    prismaRolesQueryResult = await prisma.role.findMany({
      where: {
        institutionId: institution.id,
        layerId: layer1.id,
      },
    });
    userIdFromResult = prismaRolesQueryResult.map((u) => u.userId);

    expect(prismaRolesQueryResult.length).toBe(3); // 1 admin role, 1 member role testUser1 + 1 inherited role from layer3
    expect(userIdFromResult.includes(testUser2.id)).toBeFalsy(); // testUser2 should not have access to layer1

    const allRolesOfTheInstitution = await prisma.role.findMany({
      where: {
        institutionId: institution.id,
      },
    });

    /**
     * 4 roles created for layer 2,
     * 3 roles created for layer 1,
     * 2 roles created for layer 3,
     * 1 admin role for institution
     * 1 moderator role for institution
     * 1 member role for institution
     */
    expect(allRolesOfTheInstitution.length).toBe(12);
  }, 60000);
});
