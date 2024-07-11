import { memo } from "react";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import type { AdminDashInstitution } from "@/src/utils/stripe-types";
import { useAdminDash } from "../zustand";

export const InstitutionNameButton = memo(function InstitutionNameButton({
  adminDashInstitution,
  index,
}: {
  index: number;
  adminDashInstitution: AdminDashInstitution;
}) {
  const { institution } = adminDashInstitution;
  const { setOpenedAdminDashInstitution, setOpenOverviewSheet } =
    useAdminDash();
  return (
    <p
      className="text-sm text-contrast hover:font-semibold hover:underline"
      onClick={() => {
        setOpenedAdminDashInstitution(adminDashInstitution);
        setOpenOverviewSheet(true);
      }}
    >
      <TruncateHover
        text={`${index + 1}. ${institution.name}`}
        truncateAt={30}
      />
    </p>
  );
});
