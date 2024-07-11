import type { InstitutionCreatorType } from "../../zustand";
import {
  useCreateInstitutionPopover,
  useCreatePaymentLink,
} from "../../zustand";

export default function InstitutionCredits({
  creatorType,
}: InstitutionCreatorType) {
  const zustand =
    creatorType === "create-organization"
      ? useCreateInstitutionPopover
      : useCreatePaymentLink;
  const { aiCredits, gbPerUser, baseStorageGb, accessPassDiscount } = zustand();
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-contrast">AI Credits</p>
        <div className="font-semibold">{aiCredits}</div>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-contrast">Storage Per User</p>
        <div className="font-semibold">{gbPerUser} GB</div>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-contrast">Base Organization Storage</p>
        <div className="font-semibold">{baseStorageGb} GB</div>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-contrast">Access Pass Discount</p>
        <div className="font-semibold">{accessPassDiscount}%</div>
      </div>
    </div>
  );
}
