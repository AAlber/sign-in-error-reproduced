import TruncateHover from "@/src/components/reusable/truncate-hover";
import type { InstitutionCreatorType } from "../../zustand";
import {
  useCreateInstitutionPopover,
  useCreatePaymentLink,
} from "../../zustand";

export default function InstitutionDetails({
  creatorType,
}: InstitutionCreatorType) {
  const zustand =
    creatorType === "create-organization"
      ? useCreateInstitutionPopover
      : useCreatePaymentLink;
  const { name, language } = zustand();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs">
        <p className="text-2xl font-semibold">
          <TruncateHover text={name || "Untitled"} truncateAt={15} />
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-xs text-muted-contrast">Language</p>
        <div className="text-sm font-semibold">
          {language === "en" ? "English" : "German"}
        </div>
      </div>
    </div>
  );
}
