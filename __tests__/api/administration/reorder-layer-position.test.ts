import * as clerkServerFn from "@clerk/nextjs/server";
import type { User } from "@prisma/client";
import {
  createMockUser,
  createUserWithRoleInstitutionAndLayersData,
} from "@/__tests__/helpers";
import { testApiHandler } from "@/__tests__/helpers/api";
import { prisma } from "@/src/server/db/client";

const getAuth = jest.spyOn(clerkServerFn, "getAuth");

describe("reorderLayerPosition", () => {
  /**
   * Same test with server-administration.ts but now we are testing the api route
   */

  it("returns correct number of roles without duplicates after reordering layer positions", async () => {
    const {
      user: adminUser,
      layers,
      institution,
    } = await createUserWithRoleInstitutionAndLayersData({ numLayers: 3 });

    if (!layers) throw new Error("flaky");

    getAuth.mockReturnValue({ userId: adminUser.id } as any);

    const [layer1, layer2, layer3] = layers;
    if (!layer1 || !layer2 || !layer3) throw new Error("flaky test");

    const createUserWithRolePromise = [layer1.id, layer2.id, layer3.id].map(
      async (layerId) => {
        const user = createMockUser({
          currentInstitution: institution.id as string,
          withInstitutionData: false,
        }) as User;

        await testApiHandler.role.create({
          layerId,
          role: "member",
          userId: user.id,
        });

        return await prisma.user.findFirstOrThrow({ where: { id: user.id } });
      },
    );

    const [testUser1, testUser2, testUser3] = await Promise.all(
      createUserWithRolePromise,
    );

    if (!testUser1 || !testUser2 || !testUser3) throw new Error("flaky test");

    // at this point there should now have 4 users with roles, [adminUser, testUser1, testUser2, testUser3]
    // make layer2 a child of layer1
    let result = await testApiHandler.layer.update.reorderLayerPosition({
      layerId: layer2.id,
      parentId: layer1.id,
      children: [layer2.id],
    });

    expect(result.success).toBeTruthy();

    let prismaRolesQueryResult = await prisma.role.findMany({
      where: {
        institutionId: institution.id,
        layerId: layer2.id,
      },
    });

    let userIdFromResult = prismaRolesQueryResult.map((u) => u.userId);
    expect(prismaRolesQueryResult.length).toBe(3); // 1 admin role + 2 member roles ~ 1 inherited from layer1 + 1 from layer2
    expect(userIdFromResult.includes(testUser3.id)).toBeFalsy(); // testUser3 should not yet have access to layer2

    // make layer1 a child of layer3 - structure should now look like layer3 > layer1 > layer2
    result = await testApiHandler.layer.update.reorderLayerPosition({
      layerId: layer1.id,
      parentId: layer3.id,
      children: [layer1.id],
    });

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
  }, 60000);
});
