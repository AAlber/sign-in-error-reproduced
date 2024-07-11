import GradingOverviewTable from "../../../grading-overview-table";
import { useUserOverview } from "../../zustand";

export const UserGradesTable = () => {
  const { user } = useUserOverview();

  if (!user) return null;

  return <GradingOverviewTable userId={user.id} />;
};
