import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InviteWithLayerInstitutionAndAccessPass } from "@/src/types/invite.types";

interface PersistInviteZustand {
  persistedInvite?: InviteWithLayerInstitutionAndAccessPass | null;
  setPersistedInvite: (
    data: InviteWithLayerInstitutionAndAccessPass | undefined | null,
  ) => void;
}
const initalState = {
  persistedInvite: undefined,
};

const usePersistInvite = create<PersistInviteZustand>()(
  persist(
    (set) => ({
      ...initalState,
      setPersistedInvite: (data) => set(() => ({ persistedInvite: data })),
    }),
    { name: "persist-invite" },
  ),
);

export default usePersistInvite;
