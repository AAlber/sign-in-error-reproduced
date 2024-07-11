import { faker } from "@faker-js/faker";
import {
  type Institution,
  type Layer,
  type Role as PrismaUserRole,
  type User,
} from "@prisma/client";
import cuid from "cuid";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {
  createRequest,
  createResponse,
  type RequestOptions,
} from "node-mocks-http";
import { prisma } from "@/src/server/db/client";
import type { AppointmentData } from "@/src/types/appointment.types";
import type { ContentBlockSpecsMapping } from "@/src/types/content-block/types/specs.types";
import type { ContentBlock } from "@/src/types/course.types";
import type { UserWithInstitutionData } from "@/src/types/server/user.types";

const availableRoles = ["admin", "educator", "member", "moderator"] as const;
export const generateRandomRole = () => {
  return availableRoles[
    Math.floor(Math.random() * availableRoles.length)
  ] as Role;
};

function generateUid() {
  return cuid();
}

export const createMockUserRole = (
  args: Partial<PrismaUserRole & { role: Role }>,
): PrismaUserRole => {
  const {
    id = `role-${generateUid()}`,
    institutionId = `instiRole-${generateUid()}`,
    layerId = `layerRole-${generateUid()}`,
    role = "admin" as Role,
    userId = `userRole-${generateUid()}`,
    active = true,
  } = args;

  return {
    id,
    institutionId,
    active,
    layerId,
    role,
    userId,
  };
};

export const createMockUser = (
  args: Partial<User> & { withInstitutionData?: boolean },
): User | UserWithInstitutionData => {
  const {
    id = `user-${generateUid()}`,
    email = faker.internet.email(),
    name = faker.person.fullName(),
    password = faker.internet.password(),
    currentInstitution = `instiUser-${generateUid()}`,
    image = faker.image.url(),
    withInstitutionData = true,
    stripeAccountId = generateUid(),
  } = args;

  return {
    id,
    currentInstitution: currentInstitution as string,
    email,
    name,
    password,
    image,
    language: "",
    stripeAccountId,
    memberSince: new Date(),
    emailVerified: new Date(),
    ...(withInstitutionData
      ? {
          institution: {
            id: currentInstitution,
            logo: faker.image.url(),
            name: faker.company.name(),
            verified: true,
          },
        }
      : {}),
  };
};

export const createMockInstitution = (
  args: Partial<Institution>,
): Institution => {
  const {
    id = `insti-${generateUid()}`,
    logo = faker.image.url(),
    name = faker.company.name(),
  } = args;

  return {
    id,
    logo,
    name,
    theme: "blue",
    customThemeHEX: "#000000",
    verified: true,
  };
};

export function createMockLayer(args: Partial<Layer> & { isCourse: true }): any;
export function createMockLayer(
  args: Partial<Layer> & { isCourse: false },
): any;
export function createMockLayer(
  args: Partial<Layer> & {
    isCourse?: boolean;
  },
): any {
  const {
    id = `layer-${generateUid()}`,
    displayName = faker.company.name(),
    end = new Date(),
    institution_id = `instiLayer-${generateUid()}`,
    isCourse = true,
    name = faker.company.name(),
    parent_id = null,
    position = faker.number.int({ max: 10 }),
    start = new Date(),
  } = args;

  return {
    ...(isCourse
      ? {
          course: {
            icon: faker.internet.emoji(),
            layer_id: id,
            name,
          },
        }
      : {}),
    displayName,
    isLinkedCourse: false,
    linkedCourseLayerId: null,
    end,
    id,
    institution_id,
    isCourse,
    name,
    parent_id,
    position,
    start,
  };
}

export type UserWithRoleInstitutionAndLayersDataType = Awaited<
  ReturnType<typeof createUserWithRoleInstitutionAndLayersData>
>;

type createUserWithRoleInstitutionAndLayersDataArgs = {
  saveMockToPrismaDb?: boolean;
  numLayers?: number;
  user?: Partial<User>;
};

export async function createUserWithRoleInstitutionAndLayersData(
  args?: createUserWithRoleInstitutionAndLayersDataArgs,
) {
  const numLayers = args?.numLayers ?? 1;
  const saveMockToPrismaDb = args?.saveMockToPrismaDb ?? true;
  const _user = args?.user ? args.user : {};

  const user = createMockUser({
    ..._user,
    withInstitutionData: false,
  });

  const currentInstitution = user.currentInstitution as string;

  const institutionLayer = createMockLayer({
    isCourse: false,
    institution_id: currentInstitution,
    id: currentInstitution,
    end: null,
    start: null,
    position: null,
    parent_id: null,
    displayName: null,
    name: faker.company.name(),
  });

  const layers = new Array(numLayers).fill(undefined).map(() =>
    createMockLayer({
      institution_id: currentInstitution,
      parent_id: currentInstitution,
      isCourse: false,
    }),
  );

  const mockInstitution = createMockInstitution({
    id: currentInstitution,
    name: institutionLayer.name,
  });

  if (saveMockToPrismaDb) {
    await prisma.$transaction(
      async (tx) => {
        // Create the organization layer first
        await tx.layer.create({
          data: {
            ...institutionLayer,
            roles: {
              createMany: {
                // Create default roles
                data: ["admin", "moderator", "member"].map((role) => ({
                  institutionId: institutionLayer.id,
                  userId: user.id,
                  role,
                })),
              },
            },
          },
        });

        // Create institution
        const insti = await tx.institution.create({
          data: { name: mockInstitution.name, id: mockInstitution.id },
        });

        // Create the remaining layers within the institution
        const layer = await tx.layer.createMany({ data: layers });

        // Create user and roles
        const newUser = await tx.user.create({ data: user as User });
        const roles = await tx.role.createMany({
          data: layers.map((layer) => {
            return {
              institutionId: layer.institution_id,
              layerId: layer.id,
              role: "moderator",
              userId: user.id,
            };
          }),
        });

        return { newUser, insti, layer, roles };
      },
      { timeout: 15000 },
    );
  }

  return {
    institution: mockInstitution,
    layers,
    user,
  };
}

export const createMockContentBlock = <
  T extends keyof ContentBlockSpecsMapping = any,
>(
  args?: Partial<ContentBlock<T>>,
) => {
  return {
    description: faker.string.sample(),
    dueDate: null,
    startDate: null,
    id: generateUid(),
    layerId: generateUid(),
    name: faker.person.lastName(),
    position: 1,
    status: "PUBLISHED",
    ...args,
  } as ContentBlock<T>;
};

export const createMockAppointment = (
  args?: Partial<AppointmentData>,
): AppointmentData => ({
  address: faker.location.city(),
  onlineAddress: "",
  dateTime: faker.date.future().toISOString(),
  duration: 60000,
  layerIds: [],
  isOnline: true,
  organizerIds: [],
  userAttendeeIds: [],
  userGroupAttendeeIds: [],
  provider: "bbb" as const,
  roomId: "",
  seriesId: "",
  isHybrid: false,
  title: faker.internet.domainName(),
  notes: faker.lorem.paragraph(),
  // id: generateUid(),
  // location: faker.location.county(),
  ...args,
});

export const resetDb = () => {
  return Promise.allSettled([
    prisma.role.deleteMany(),
    prisma.user.deleteMany(),
    prisma.layer.deleteMany(),
    prisma.contentBlock.deleteMany(),
  ]);
};

// https://github.com/eugef/node-mocks-http/issues/255#issuecomment-1136674043
type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type APiResponse = NextApiResponse & ReturnType<typeof createResponse>;

export const apiTestHandler = async (
  handler: NextApiHandler,
  options: RequestOptions,
) => {
  let body = options.body;
  if (typeof body === "object") {
    body = JSON.stringify(body) as unknown as Body;
  }

  const req = createRequest<ApiRequest>({ ...options, body });
  const res = createResponse<APiResponse>();

  await handler(req, res);
  return res;
};

export async function apiTestHandlerWithJson<T>(
  handler: NextApiHandler,
  options: RequestOptions,
): Promise<T> {
  const result = await apiTestHandler(handler, options);
  const status = result._getStatusCode();
  const statusCode = status.toString();
  if (+statusCode[0]! > 3) throw new Error(result._getStatusMessage());

  return result._getJSONData();
}
