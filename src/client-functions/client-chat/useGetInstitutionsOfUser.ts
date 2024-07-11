import { useEffect } from "react";
import { create } from "zustand";
import { fetchInstitutions } from "@/src/client-functions/client-user";

/**
 * hook to fetch user institutions
 *
 * currently used in:
 * 1. inside chat window, to show the institution name of the other institutions of user
 *
 * @returns a mapping of `institutionId` to `institutionName`
 */
export default function useGetInstitutionsOfUser() {
  const { userInstitutions, setUserInstitutions } = useUserInstitutions();

  useEffect(() => {
    if (!Object.keys(userInstitutions).length) {
      fetchInstitutions().then((institutions) => {
        const userInstitutions = institutions.reduce(
          (p, c) => ({ ...p, [c.id]: c.name }),
          {} as Record<string, string>,
        );

        setUserInstitutions(userInstitutions);
      });
    }
  }, [userInstitutions]);
}

type Institutions = {
  userInstitutions: Record<string, string>;
  setUserInstitutions: (data: Institutions["userInstitutions"]) => void;
};

// TODO?: store in local storage, to avoid fetching everytime chat window open
export const useUserInstitutions = create<Institutions>()((set) => ({
  userInstitutions: {},
  setUserInstitutions: (data) =>
    set((state) => ({
      userInstitutions: { ...state.userInstitutions, ...data },
    })),
}));
