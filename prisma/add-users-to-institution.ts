import cuid from "cuid";
import { StreamChat } from "stream-chat";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import { prisma } from "../src/server/db/client";

export const streamChat = new StreamChat<StreamChatGenerics>(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET,
);

export default async function addUsersToInstitutions({
  institutionId,
  userAmount,
}: {
  institutionId: string;
  userAmount: number;
}) {
  try {
    const userList = [
      "Mark Smith",
      "Jane Doe",
      "John Doe",
      "John Smith",
      "Tom Henry",
      "Jessica Stone",
      "Emily Johnson",
      "Michael Brown",
      "Sophia Davis",
      "Daniel Anderson",
      "Olivia Martinez",
      "David Thompson",
      "Ava Taylor",
      "Joseph Garcia",
      "Benjamin Wilson",
      "Emma Lewis",
      "Mason Clark",
      "Sophie Allen",
      "Jacob Turner",
      "Abigail Wright",
      "William Walker",
      "Oliver Hall",
      "Isabella Green",
      "Ethan Hill",
      "Mia Mitchell",
      "Alexander Young",
      "Charlotte Scott",
      "James Phillips",
      "Amelia Torres",
      "Daniel Rodriguez",
      "Harper Patterson",
      "Joseph Jenkins",
      "Evelyn Cooper",
      "Samuel Murphy",
      "Elizabeth Rivera",
      "Matthew Reed",
      "Sofia Brooks",
      "Henry Ramirez",
      "Avery Torres",
      "Andrew Morgan",
      "Ella Rogers",
      "Anthony Peterson",
      "Grace Bennett",
      "David Hughes",
      "Scarlett Foster",
      "Michael Butler",
      "Victoria Coleman",
      "Christopher Cox",
      "Chloe Richardson",
      "Liam Powell",
      "Aria Price",
      "William Morris",
      "Zoe Ward",
      "Joseph White",
      "Lily Brooks",
      "Charles Jenkins",
      "Mila Watson",
      "Ryan Russell",
      "Madison Price",
      "Christian Gonzales",
      "Penelope Henderson",
      "Jackson Edwards",
      "Layla Cook",
      "John Stewart",
      "Riley James",
      "Sebastian Sullivan",
      "Nora Cox",
      "Henry Murphy",
      "Aubrey King",
      "Nathan Adams",
      "Hannah Bennett",
      "Samuel Foster",
      "Leah Ross",
      "Jonathan Perry",
      "Stella Howard",
      "Luke Richardson",
      "Ellie Long",
      "Dylan Scott",
      "Claire Collins",
      "Caleb Wright",
      "Natalie Sanders",
      "Owen Morgan",
      "Savannah Thompson",
      "Isaac Bell",
      "Audrey Price",
      "Wyatt Turner",
      "Brooklyn Evans",
      "Grayson Howard",
      "Maya Rodriguez",
      "Jack Ward",
      "Aaliyah Davis",
      "Julian Taylor",
      "Katherine Phillips",
      "Levi Green",
      "Bella Adams",
      "Carter Martinez",
      "Eleanor Wilson",
      "Daniel Mitchell",
      "Lucy Hall",
    ];

    console.log("Creating random users ...");

    const userPromise = userList.slice(0, userAmount).map((user) => {
      return prisma.user.create({
        data: {
          id: "user_" + cuid(),
          email: cuid() + "@test.com",
          name: user,
        },
      });
    });

    const users = await Promise.all(userPromise);

    console.log(`Creating roles for random users ...`);

    const roles = users.map((user) => {
      return prisma.role.create({
        data: {
          layerId: institutionId,
          institutionId: institutionId,
          userId: user.id,
          role: "member",
        },
      });
    });

    await Promise.all(roles);

    console.log(`Create Get Stream user instances...`);

    const streamUsers = users.map((user) => {
      return streamChat.upsertUser({
        id: user.id,
        name: user.name,
        teams: [institutionId],
      });
    });

    await Promise.all(streamUsers);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
