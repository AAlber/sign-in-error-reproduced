import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import Switch from "../../settings-switches/switch";
import { Button } from "../../shadcn-ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../shadcn-ui/card";
import { Label } from "../../shadcn-ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn-ui/popover";
import useECTsExport from "./zustand";

export default function ExportPreferencesPopover() {
  const {
    includeTimeConstrainingLayer,
    setIncludeTimeConstrainingLayer,
    exportStructure,
    setExportStructure,
  } = useECTsExport();

  const { t } = useTranslation("page");

  return (
    <Popover>
      <PopoverTrigger>
        <Button size={"icon"}>
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px]">
        <CardHeader className="px-0 pb-4 pt-0">
          <CardTitle>{t("ects_export.export_preferences")}</CardTitle>
          <CardDescription>
            {t("ects_export.export_preferences_description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-0">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-3 flex flex-col">
              <Label htmlFor="active">{t("ects_export.grouped")}</Label>
              <p className="text-xs text-muted-contrast">
                {t("ects_export.grouped_description")}
              </p>
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <Switch
                checked={exportStructure === "grouped"}
                onChange={(value) => {
                  setExportStructure(value ? "grouped" : "flat");
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-3 flex flex-col">
              <Label htmlFor="send_invite">
                {t("ects_export.include_time_layer")}
              </Label>
              <p className="text-xs text-muted-contrast">
                {t("ects_export.include_time_layer_description")}
              </p>
            </div>{" "}
            <div className="col-span-1 flex items-center justify-end">
              <Switch
                checked={includeTimeConstrainingLayer}
                onChange={setIncludeTimeConstrainingLayer}
              />
            </div>
          </div>
        </CardContent>
      </PopoverContent>{" "}
    </Popover>
  );
}
