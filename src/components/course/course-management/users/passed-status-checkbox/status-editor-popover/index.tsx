import { Label } from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import { PopoverContent } from "@/src/components/reusable/shadcn-ui/popover";
import { Textarea } from "@/src/components/reusable/shadcn-ui/text-area";
import useUserStatusCheckbox, { modes } from "../zustand";
import StatusEditorModeOption from "./mode-option";
import StatusEditorSaveButton from "./save-button";

export default function StatusEditorPopover({
  courseMember,
}: {
  courseMember: CourseMember;
}) {
  const { mode, notes, setNotes } = useUserStatusCheckbox();
  const { t } = useTranslation("page");

  return (
    <PopoverContent className="w-[350px]">
      <CardHeader className="px-0 pb-4 pt-0">
        <CardTitle>{t("status_settings")}</CardTitle>
        <CardDescription>{t("status_settings_description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1 p-0">
        {modes.map((m) => (
          <StatusEditorModeOption mode={m} key={m.name} />
        ))}
        {mode !== "automatic" && (
          <div className="grid gap-2 pt-2">
            <Label>{t("notes")}</Label>
            <Textarea
              id="notes"
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
              placeholder="Add any additional information here..."
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end space-x-2 px-0 pb-0 pt-2">
        <StatusEditorSaveButton courseMember={courseMember} />
      </CardFooter>
    </PopoverContent>
  );
}
