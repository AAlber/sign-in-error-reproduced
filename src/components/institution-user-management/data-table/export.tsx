import type { InstitutionUserDataField } from "@prisma/client";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { exportUserDataForFieldsAsCSV } from "@/src/client-functions/client-institution-user-data-field";
import ScrollableItemSelector from "../../reusable/scrollable-item-selector";
import { Button } from "../../reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../reusable/shadcn-ui/popover";
import WithToolTip from "../../reusable/with-tooltip";
import { useSelectMenuUserFilter } from "../select-menu/zustand";
import { useInstitutionUserManagement } from "../zustand";

export default function Export() {
  const { filteredUserIds } = useSelectMenuUserFilter();
  const [popOverOpen, setPopOverOpen] = useState(false);

  const { dataFields } = useInstitutionUserManagement();
  const { t } = useTranslation("page");
  const [loading, setLoading] = useState(false);

  const defaultFields = [
    { id: "name", name: t("name") },
    { id: "email", name: t("email") },
    { id: "status", name: t("status") },
  ];

  const allExportableFields = [...defaultFields, ...dataFields];
  const [selectedFields, setSelectedFields] = useState<string[]>(
    defaultFields.map((field) => field.id),
  );

  return (
    <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
      <PopoverTrigger>
        <WithToolTip delay={300} text={t("export")} disabled={popOverOpen}>
          <Button variant="ghost">
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </WithToolTip>
      </PopoverTrigger>
      <PopoverContent className="flex w-[400px] flex-col gap-2">
        <div>
          <h2 className="font-medium">{t("export_user_data")}</h2>
          <p className="text-sm text-muted-contrast">
            {t("export_user_data.desc")}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-end">
            <Button
              variant={"ghost"}
              size={"small"}
              className="text-sm font-normal text-muted-contrast"
              onClick={() => {
                if (selectedFields.length < allExportableFields.length) {
                  setSelectedFields(
                    allExportableFields.map((field) => field.id),
                  );
                } else {
                  setSelectedFields([]);
                }
              }}
            >
              {t(
                selectedFields.length < allExportableFields.length
                  ? "select-all"
                  : "deselect-all",
              )}
            </Button>
          </div>
          <ScrollableItemSelector<
            InstitutionUserDataField | { id: string; name: string }
          >
            items={allExportableFields}
            selected={allExportableFields.filter((field) =>
              selectedFields.includes(field.id),
            )}
            setSelected={(selected) =>
              setSelectedFields(selected.map((field) => field.id))
            }
            itemRenderer={(item) => {
              return (
                <p className="t-primary flex h-8 items-center gap-2 text-sm">
                  <span>{item.name}</span>
                </p>
              );
            }}
          />
        </div>
        <div className="flex w-full items-center justify-end">
          <Button
            disabled={!selectedFields.length || loading}
            onClick={async () => {
              setLoading(true);
              await exportUserDataForFieldsAsCSV(
                selectedFields,
                filteredUserIds.map((id) => ({ id })),
              );

              setSelectedFields([]);
              setLoading(false);
            }}
            variant={"cta"}
          >
            {t(loading ? "general.loading" : "export")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
