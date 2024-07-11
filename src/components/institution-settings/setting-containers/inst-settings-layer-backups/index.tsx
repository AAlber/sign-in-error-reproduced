import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ListX } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import administrationOperations from "@/src/client-functions/client-administration/administration-operations";
import type { Layer } from "@/src/components/administration/types";
import AsyncTable from "@/src/components/reusable/async-table";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import { EmptyState } from "@/src/components/reusable/empty-state";
import useUser from "@/src/zustand/user";
import SettingsSection from "../../../reusable/settings/settings-section";
import { LayerDeletionDeadline } from "./deletion-deadline";
import { LayerRecoverButton } from "./recover-button";

export const LayerBackups = () => {
  const { t } = useTranslation("page");
  const { user } = useUser();
  dayjs.locale(user?.language || "en");
  const [data, setData] = useState<Layer[]>([]);
  const [refresh, setRefresh] = useState(false);

  const layersPendingDeletion = data.filter((layer) => {
    const deletionDate = dayjs(layer.deletedAt).add(30, "days");
    return dayjs().isBefore(deletionDate);
  });

  const columns: ColumnDef<Layer>[] = [
    {
      id: "name",
      header: t("name"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <AutoLayerCourseIconDisplay
              course={row.original.course || null}
              className="size-6"
              height={24}
              width={24}
            />
            <p>{row.original.name}</p>
          </div>
        );
      },
    },
    {
      id: "timeleft",
      header: t("insti_settings.layer_backups.time_left"),
      cell: ({ row }) => <LayerDeletionDeadline layer={row.original} />,
    },
    {
      id: "recover",
      cell: ({ row }) => (
        <LayerRecoverButton
          layer={row.original}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ),
    },
  ];

  return (
    <SettingsSection
      noFooter
      title="insti_settings.layer_backups.title"
      subtitle="insti_settings.layer_backups.description"
    >
      <AsyncTable
        columns={columns}
        promise={async () => await administrationOperations.getDeletedLayers()}
        data={layersPendingDeletion}
        setData={setData}
        refreshTrigger={refresh}
        styleSettings={{
          emptyState: (
            <EmptyState
              icon={ListX}
              title="insti_settings.layer_backups.no_backups"
              description="insti_settings.layer_backups.no_backups_description"
            />
          ),
        }}
      />
    </SettingsSection>
  );
};
