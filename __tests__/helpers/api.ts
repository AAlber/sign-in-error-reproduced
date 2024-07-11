import type { Invite, Layer } from "@prisma/client";
import createLayerHandler from "@/src/pages/api/administration/create-layer";
import reorderLayerPositionApiHandler, {
  type ReorderLayerPositionArgs,
} from "@/src/pages/api/administration/reorder-layer-position";
import getInviteTokenApiHandler from "@/src/pages/api/invite/[layerId]";
import createInviteApiHandler from "@/src/pages/api/invite/create";
import joinInviteApiHandler from "@/src/pages/api/invite/join";
import getCoursesWithUserProgressApiHandler from "@/src/pages/api/kv-cached/get-user-courses-with-progress-data";
import createRoleApiHandler, {
  type CreateRoleApiArgs,
} from "@/src/pages/api/role/create-role";
import getLayersUserHasSpecialAccessTo from "@/src/pages/api/role/get-layers-user-has-special-access-to";
import removeAdminRoleApiHandler from "@/src/pages/api/role/remove-admin-role";
import createStripeAccessPassApiHandler from "@/src/pages/api/stripe/access-passes/create-access-pass";
import createAccessPassSubscription from "@/src/pages/api/stripe/access-passes/create-access-pass-subscription";
import createStripeOrganizationAccountApiHandler from "@/src/pages/api/stripe/paid-access-passes/create-account";
import taxRatesCreateApiHandler from "@/src/pages/api/stripe/paid-access-passes/tax-rates/create";
import createInstitutionUserApiHandler from "@/src/pages/api/users/create-institution-user";
import type {
  CreateInvite,
  InviteResponse,
  InviteWithLayerAndAccessPassAndInstitution,
  JoinInvite,
} from "@/src/types/invite.types";
import type { CreateLayerApiArgs } from "@/src/types/server/administration.types";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";
import type {
  CreateInstitutionUser,
  InstitutionUserManagementUser,
} from "@/src/types/user-management.types";
import type {
  CreateAccessPassData,
  CreateAccessPassSubscriptionData,
  CreateTaxRateData,
} from "@/src/utils/stripe-types";
import { apiTestHandlerWithJson } from "./index";

export const testApiHandler = {
  layer: {
    create: (args: CreateLayerApiArgs) =>
      apiTestHandlerWithJson<Layer & { course: Layer & { layer_id: string } }>(
        createLayerHandler,
        {
          method: "POST",
          body: args,
        },
      ),
    update: {
      reorderLayerPosition: (args: ReorderLayerPositionArgs) =>
        apiTestHandlerWithJson<{ success: boolean }>(
          reorderLayerPositionApiHandler,
          {
            method: "POST",
            body: args,
          },
        ),
    },
  },
  role: {
    create: (args: CreateRoleApiArgs) =>
      apiTestHandlerWithJson<{ message: string }>(createRoleApiHandler, {
        method: "POST",
        body: args,
      }),
    admin: {
      delete: (args: { userId: string }) =>
        apiTestHandlerWithJson<{ count: number }>(removeAdminRoleApiHandler, {
          method: "POST",
          body: args,
        }),
    },
    layers: {
      specialAccess: {
        get: () =>
          apiTestHandlerWithJson<any[]>(getLayersUserHasSpecialAccessTo, {
            method: "GET",
          }),
      },
    },
  },
  invite: {
    create: (args: CreateInvite) =>
      apiTestHandlerWithJson<Invite | [Invite]>(createInviteApiHandler, {
        method: "POST",
        body: args,
      }),
    get: (args: { token: string; layerId: string }) =>
      apiTestHandlerWithJson<InviteWithLayerAndAccessPassAndInstitution>(
        getInviteTokenApiHandler,
        {
          method: "GET",
          query: args,
        },
      ),
    join: (args: JoinInvite) =>
      apiTestHandlerWithJson<InviteResponse>(joinInviteApiHandler, {
        method: "POST",
        body: args,
      }),
  },
  user: {
    coursesAndUserProgress: {
      get: (id: string) =>
        apiTestHandlerWithJson<CourseWithDurationAndProgress>(
          getCoursesWithUserProgressApiHandler,
          {
            method: "GET",
            query: { id },
          },
        ),
    },
    institution: {
      create: (args: CreateInstitutionUser) =>
        apiTestHandlerWithJson<InstitutionUserManagementUser>(
          createInstitutionUserApiHandler,
          {
            method: "POST",
            body: args,
          },
        ),
    },
  },
  stripe: {
    accessPass: {
      create: (args: CreateAccessPassData) =>
        apiTestHandlerWithJson<Invite>(createStripeAccessPassApiHandler, {
          method: "POST",
          body: args,
        }),
      account: {
        create: () =>
          apiTestHandlerWithJson(createStripeOrganizationAccountApiHandler, {
            method: "POST",
          }),
      },
      subscription: {
        create: (args: CreateAccessPassSubscriptionData) =>
          apiTestHandlerWithJson<{ sessionUrl: string }>(
            createAccessPassSubscription,
            {
              method: "POST",
              body: args,
            },
          ),
      },
      taxRates: {
        create: (args: CreateTaxRateData) =>
          apiTestHandlerWithJson<{ id: string }>(taxRatesCreateApiHandler, {
            method: "POST",
            body: args,
          }),
      },
    },
  },
};
