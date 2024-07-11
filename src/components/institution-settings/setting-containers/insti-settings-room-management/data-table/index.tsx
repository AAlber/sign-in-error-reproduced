"use client";

import type { InstitutionRoom } from "@prisma/client";
import { Building, Plus } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { deleteInstitutionRooms } from "@/src/client-functions/client-institution-room";
import confirmAction from "@/src/client-functions/client-options-modal";
import AsyncTable from "@/src/components/reusable/async-table";
import { EmptyState } from "@/src/components/reusable/empty-state";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useCreateRoomModal } from "../create-room-modal/zustand";
import { useInstitutionRoomList } from "../zustand";
import { useColumns } from "./columns";

export function DataTable() {
  const { t } = useTranslation("page");
  const { rooms, selectedRows, setSelectedRows } = useInstitutionRoomList();
  const { openRoomCreation } = useCreateRoomModal();
  const hasSelectedRows = selectedRows.length > 0;

  return (
    <AsyncTable<InstitutionRoom>
      columns={useColumns()}
      data={rooms}
      promise={async () => rooms}
      refreshTrigger={rooms}
      styleSettings={{
        showComponentWithoutData: true,
        emptyState: (
          <EmptyState
            icon={Building}
            title="room.empty.title"
            description="room.empty.description"
          >
            <EmptyState.Article articleId={8707836} />
          </EmptyState>
        ),
        additionalComponent: (
          <div className="flex items-center space-x-2">
            {hasSelectedRows && (
              <Button
                variant={"destructive"}
                onClick={() => {
                  const selectedRowIds = selectedRows.map((row) => row.id);
                  confirmAction(
                    () => {
                      deleteInstitutionRooms(selectedRowIds);
                      setSelectedRows([]);
                    },
                    {
                      title: `${t("general.delete")} ${selectedRows.length} ${t(
                        "organization_settings.confirm_action_delete_rooms_title2",
                      )}`,
                      description:
                        "organization_settings.confirm_action_delete_rooms_description",
                      actionName: "general.delete",
                      requiredConfirmationCode: true,
                      dangerousAction: true,
                    },
                  );
                }}
              >
                {t("organization_settings.room_management_table_button_delete")}
              </Button>
            )}
            <Button
              variant={"cta"}
              onClick={openRoomCreation}
              className="flex items-center gap-2"
            >
              {<Plus className="mr-1 h-4 w-4" />}
              {t("organization_settings.room_management_table_button_new")}
            </Button>
          </div>
        ),
      }}
    />
  );
}
