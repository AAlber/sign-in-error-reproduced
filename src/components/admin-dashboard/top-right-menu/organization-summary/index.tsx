import { type InstitutionCreatorType } from "../zustand";
import InstitutionInfo from "./institution-info/institution-info";
import SubscriptionOverview from "./subscription-overview";

export default function OrganizationSummary({
  creatorType,
}: InstitutionCreatorType) {
  return (
    <div className="w-[400px]">
      <InstitutionInfo creatorType={creatorType} />
      <SubscriptionOverview creatorType={creatorType} />
    </div>
  );
}
