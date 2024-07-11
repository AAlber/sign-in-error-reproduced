import { Import, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getChildrenIdsOfLayerInAppointment } from "@/src/client-functions/client-appointment";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useAppointmentEditor from "../../zustand";

export default function LayerPopover({
  children,
  row,
}: {
  children: React.ReactNode;
  row: any;
}) {
  const { t } = useTranslation("page");
  const { layerIds, setLayerIds } = useAppointmentEditor();
  const [childrenIds, setChildrenIds] = useState<string[]>([]);

  const getChildrenIds = async () => {
    setChildrenIds(await getChildrenIdsOfLayerInAppointment(row.original.id));
  };

  useEffect(() => {
    getChildrenIds();
  }, [layerIds]);

  return (
    <>
      {childrenIds.length === 1 ? (
        <Button
          size={"iconSm"}
          variant={"ghost"}
          className="mr-1"
          onClick={() =>
            setLayerIds(layerIds.filter((id) => id !== row.original.id))
          }
        >
          <X className="h-4 w-4 text-muted-contrast" />
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={async () => {
                if (childrenIds.length === 1) return;
                setLayerIds([
                  ...layerIds,
                  ...childrenIds.filter(
                    (id) => !layerIds.includes(id) && id !== row.original.id,
                  ),
                ]);
              }}
            >
              <Import className="h-4 w-4" />
              {t("appointment_modal.add_layerIds_add")}{" "}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() =>
                setLayerIds(layerIds.filter((id) => id !== row.original.id))
              }
            >
              <Trash2 className="h-4 w-4" />
              <span>{t("appointment_modal.add_layerIds_remove")}</span>{" "}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
