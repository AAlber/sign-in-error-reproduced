import { joinInvite } from "@/src/client-functions/client-invite";
import type { InviteResponse } from "@/src/types/invite.types";
import { Button } from "../reusable/shadcn-ui/button";
import usePersistInvite from "./persist-invite-zustand";
import useInvitation from "./zustand";

export default function JoinButton({ title }: { title: string }) {
  const { setInviteResponse, setLoading, invite } = useInvitation();
  const { setPersistedInvite } = usePersistInvite();

  return (
    <Button
      title={title}
      type="button"
      variant={"cta"}
      onClick={async () => {
        setLoading(true);
        const response: InviteResponse = await joinInvite({
          inviteId: invite!.id,
        });
        setInviteResponse(response);
        setLoading(false);
        setPersistedInvite(undefined);
      }}
    >
      <p className=" text-contrast">{title}</p>
    </Button>
  );
}
