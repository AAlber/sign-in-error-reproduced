import type { User } from "@clerk/clerk-sdk-node";
import { faker } from "@faker-js/faker";

export const useUser = jest.fn().mockReturnValue({
  user: {
    id: faker.string.uuid(),
  },
});

export const clerkClient = {
  users: {
    getUser(userId: string) {
      const primaryEmailId = faker.string.uuid();
      return {
        id: userId,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        emailAddresses: [
          { emailAddress: faker.internet.email(), id: primaryEmailId },
        ],
        primaryEmailAddressId: primaryEmailId,
      } as User;
    },
    getUserList: jest.fn().mockResolvedValue([]),
  },
};
