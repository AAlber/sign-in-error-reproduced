import useEdgeConfig from "../zustand/edge-config";
import useUser from "../zustand/user";

export const isPartOfFakeTrialInstitutions = (institutionId?: string) => {
  const { user } = useUser.getState();
  const { edgeConfig } = useEdgeConfig.getState();

  const { institutionsThatHaveFakeTrialPlan } = edgeConfig;
  const instiId = institutionId || user?.currentInstitutionId;
  return institutionsThatHaveFakeTrialPlan.includes(instiId);
};

export function isRole(value: any): value is Role {
  return ["member", "educator", "moderator", "admin"].includes(value);
}
