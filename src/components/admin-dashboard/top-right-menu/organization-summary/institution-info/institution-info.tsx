import type { InstitutionCreatorType } from "../../zustand";
import InstitutionCredits from "./institution-credits";
import InstitutionDetails from "./institution-details";
import InstitutionLogo from "./logo";

export default function InstitutionInfo({
  creatorType,
}: InstitutionCreatorType) {
  return (
    <>
      <div className="flex items-center gap-2">
        <InstitutionLogo />
        <InstitutionDetails creatorType={creatorType} />
      </div>
      <InstitutionCredits creatorType={creatorType} />
    </>
  );
}
