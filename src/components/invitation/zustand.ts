import { create } from "zustand";
import type {
  InviteResponse,
  InviteWithLayerInstitutionAndAccessPass,
} from "@/src/types/invite.types";

interface InvitationZustand {
  loading: boolean;
  setLoading: (data: boolean) => void;

  inviteResponse: InviteResponse | undefined;
  setInviteResponse: (data: InviteResponse | undefined) => void;

  invite?: InviteWithLayerInstitutionAndAccessPass;
  setInvite: (
    data: InviteWithLayerInstitutionAndAccessPass | undefined,
  ) => void;
}

const initalState = {
  loading: true,
  inviteResponse: undefined,
  invite: undefined,
};

const useInvitation = create<InvitationZustand>((set) => ({
  ...initalState,
  setLoading: (data) => set(() => ({ loading: data })),
  setInviteResponse: (data) => set(() => ({ inviteResponse: data })),
  setInvite: (data) => set(() => ({ invite: data })),
}));

export default useInvitation;
