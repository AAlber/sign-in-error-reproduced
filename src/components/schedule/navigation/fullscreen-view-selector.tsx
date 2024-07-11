import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../reusable/shadcn-ui/select";
import useSchedule from "../zustand";

export default function FullScreenViewSelector() {
  const { t } = useTranslation("page");
  const { fullScreenView, setFullScreenView } = useSchedule();

  return (
    <Select value={fullScreenView} onValueChange={setFullScreenView}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="day">{t("day")}</SelectItem>
        <SelectItem value="week">{t("week")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
