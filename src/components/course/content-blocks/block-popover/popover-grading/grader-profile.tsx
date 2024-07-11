import type { ContentBlockUserGrading } from "@prisma/client";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import UserDefaultImage from "@/src/components/user-default-image";

export const BlockGraderProfile = ({
  graderProfile,
  grading,
  openChatWithUser,
}: {
  graderProfile: Pick<SimpleUser, "name" | "image" | "id">;
  grading: ContentBlockUserGrading;
  openChatWithUser: (id: string, name: string) => void;
}) => {
  return (
    <div className="mr-auto mt-6 flex w-full flex-col gap-4">
      <div className="flex gap-2">
        <UserDefaultImage user={graderProfile} dimensions="h-5 w-5" />
        <div className="mt-[-2px] flex flex-col">
          <p className="text-sm font-medium">{graderProfile.name}</p>
          <p className="text-sm text-muted-contrast">{grading.text}</p>
        </div>
      </div>
      <Button
        onClick={() => openChatWithUser(graderProfile.id, graderProfile.name)}
        className="w-full"
        variant="cta"
      >
        Chat
      </Button>
    </div>
  );
};
