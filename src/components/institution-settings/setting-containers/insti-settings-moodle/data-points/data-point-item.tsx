import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/components/reusable/shadcn-ui/select";
import type { MoodleIntegrationDataPoint, TransferType } from "../schema";

type Props = {
  label: keyof MoodleIntegrationDataPoint;
  value: TransferType;
  capabilities: ("read" | "write" | "readWrite")[];
  onChange: (key: keyof MoodleIntegrationDataPoint, v: TransferType) => void;
};

export function DataPointItem({ capabilities, label, value, onChange }: Props) {
  const { t } = useTranslation("page");
  const handleSelectChange = (v: TransferType) => {
    onChange(label, v);
  };

  const minimumRequirementsNotMet =
    !capabilities.includes("readWrite") && !capabilities.includes("read");

  let translatedValue = "";
  switch (value) {
    case "no-transfer": {
      translatedValue = t("moodle.action.select.no_transfer");
      break;
    }
    case "to-fuxam": {
      translatedValue = t("moodle.action.select.to_fuxam");
      break;
    }
    case "both-ways": {
      translatedValue = t("moodle.action.select.both_ways");
      break;
    }
  }

  return (
    <li className="flex items-center justify-between capitalize ">
      <span>{label}</span>
      <Select
        onValueChange={handleSelectChange}
        defaultValue={value}
        value={value}
      >
        <SelectTrigger className="w-48">{translatedValue}</SelectTrigger>
        <SelectContent>
          <SelectItem value="no-transfer">
            {t("moodle.action.select.no_transfer")}
            {minimumRequirementsNotMet && (
              <p className="max-w-[95%] text-xs text-muted-contrast">
                {t("moodle.insuficient_permissions.no_read_write_capability", {
                  label: t(label),
                })}
              </p>
            )}
          </SelectItem>
          {(capabilities.includes("readWrite") ||
            capabilities.includes("read")) && (
            <SelectItem value="to-fuxam">
              {t("moodle.action.select.to_fuxam")}
            </SelectItem>
          )}

          {capabilities.includes("readWrite") && (
            <SelectItem value="both-ways">
              {t("moodle.action.select.both_ways")}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </li>
  );
}
