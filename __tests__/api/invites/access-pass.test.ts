import * as clerkServerFn from "@clerk/nextjs/server";
import type { User } from "@prisma/client";
import {
  createMockLayer,
  createMockUser,
  createUserWithRoleInstitutionAndLayersData,
} from "@/__tests__/helpers";
import { testApiHandler } from "@/__tests__/helpers/api";
import type { MockLayer, MockOrganization } from "@/__tests__/helpers/types";
import { prisma } from "@/src/server/db/client";
import { isValidCuid } from "@/src/server/functions/server-input";

const getAuth = jest.spyOn(clerkServerFn, "getAuth");

describe("Access Pass", () => {
  /**
   * STEPS:
   *
   * 1. initialize variables
   *    - create stripeOrganizationAccount
   *    - create 2layers, 1layer 1 courseLayer
   *    - create a testUser to invite
   * 1. create the taxRateData
   * 2. create the accessPassInvite
   *    - organization must have stripeAccountId
   *    - organization must be paid
   * 3. create the subscription url
   * 4. switch to the test user
   * 5. get the generated invite
   * 6. join the generated invite successfully
   * 7. assert that the joined user has member roles to institution, layer, and courseLayer
   *
   * NOTE:
   * AccessPass with ValidatorToken structure:
   * http://localhost:3000/process-invitation/clq6do2uw000h3b6n58lw5mej/407434584/clrf9bi7700137eezfn3xb61o
   */

  let adminUser: User,
    invitedUser: User,
    organization: MockOrganization,
    subLayer1: MockLayer,
    courseOfSubLayer1: MockLayer,
    invite: any;

  const NUMBER_OF_LAYERS = 3;

  beforeAll(async () => {
    // INITIALIZE VARIABLES
    const mock = await createUserWithRoleInstitutionAndLayersData({
      numLayers: NUMBER_OF_LAYERS,
    });

    if (!mock.layers[0]) throw new Error("Flaky test");

    adminUser = mock.user;
    organization = mock.institution;
    invitedUser = createMockUser({});

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

    /**
     * just register institituion stripe account to db for successful test
     * this check is crucial inside the stripeApiHandler
     */

    await prisma.institutionStripeAccount.create({
      data: {
        institutionId: organization.id,
        customerId: adminUser.id,
        subscriptionId: "random-id",
        subscriptionStatus: "active",
        connectAccountId: "random-connect-id",
      },
    });
  });

  it("Creates access pass invite", async () => {
    const layers = await testApiHandler.role.layers.specialAccess.get();
    expect(layers.length).toBeGreaterThan(1);

    // /api/stripe/paid-access-passes/tax-rates/create
    // mocked return data
    const taxRateData = await testApiHandler.stripe.accessPass.taxRates.create({
      country: "DE",
      displayName: "vat",
      inclusive: false,
      percentage: 20,
      type: "vat",
    });

    const accessPassInvite = await testApiHandler.stripe.accessPass.create({
      isPaid: true,
      layerId: subLayer1.id,
      priceId: "random",
      productInfo: {
        currency: "usd",
        description: "asdf",
        name: "sdf",
        taxRateId: taxRateData.id,
        unitAmount: 200,
      },
    });

    expect(accessPassInvite.id).toBeDefined();

    const subscriptionResult =
      await testApiHandler.stripe.accessPass.subscription.create({
        accessPassId: accessPassInvite.id,
        priceId: "random",
      });

    invite = accessPassInvite;
    expect(
      typeof subscriptionResult.sessionUrl === "string" &&
        subscriptionResult.sessionUrl.includes("accessPassAdded"),
    ).toBeTruthy();
  });

  it("A user successfully joins the accesspass invite successfully", async () => {
    // just create the user to join the access pass invite
    await prisma.user.create({
      data: {
        email: invitedUser.email,
        name: invitedUser.name,
        id: invitedUser.id,
      },
    });

    getAuth.mockReturnValue({ userId: invitedUser.id } as any);

    const inviteResult = await testApiHandler.invite.get({
      token: invite.token,
      layerId: invite.target,
    });

    const result1 = await testApiHandler.invite.join({
      inviteId: inviteResult.id,
      // token: inviteResult.token, <-- we do not send any token along with this request
    });

    expect(result1.success).toBeTruthy();

    const urlWithValidatorToken = new URL(result1.result);
    const validatorToken = urlWithValidatorToken.pathname.split("/").at(-1);

    expect(validatorToken && isValidCuid(validatorToken)).toBeTruthy();

    const result2 = await testApiHandler.invite.join({
      inviteId: inviteResult.id,
      token: validatorToken, // once validatorToken is available in URL, we now include that in the request
    });

    expect(result2.success).toBeTruthy();
    expect(result2.result).toBe("Invite completed");
  });

  it("The invited user should have member roles in layer invited and courseLayer", async () => {
    const roles = await prisma.role.findMany({
      where: { userId: invitedUser.id },
    });

    expect(roles.length).toBeGreaterThanOrEqual(3); // roles created
    expect(roles.every((role) => role.role === "member")).toBeTruthy(); // only member roles are created
    expect(
      roles.every((role) =>
        [subLayer1.id, courseOfSubLayer1.id, organization.id].includes(
          role.layerId,
        ),
      ),
    ).toBeTruthy();
  });
});
