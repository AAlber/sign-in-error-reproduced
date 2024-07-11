import { KeyRoundIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { createRole } from "@/src/client-functions/client-user-management";
import { truncate } from "@/src/client-functions/client-utils";
import { useSelectMenuUserFilter } from "@/src/components/institution-user-management/select-menu/zustand";
import AsyncSelect from "@/src/components/reusable/async-select";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  HoverCard,
  HoverCardSheet,
  HoverCardTrigger,
} from "@/src/components/reusable/shadcn-ui/hover-card";
import GiveAccessToLayersTip from "@/src/components/reusable/tips/give-access-to-layer";
import useUser from "@/src/zustand/user";
import LayerSelectPathHoverCard from "../../../../../reusable/layer-select-path-card";

export function GiveAccessTo() {
  const { t } = useTranslation("page");
  const [open, setOpen] = useState(false);

  const { filteredUserIds, emptyFilter } = useSelectMenuUserFilter();

  const { user } = useUser();
  const currentUserId = user.id;

  return (
    <HoverCard openDelay={300}>
      <AsyncSelect
        open={open}
        setOpen={setOpen}
        side="bottom"
        trigger={
          <HoverCardTrigger asChild>
            <Button variant="ghost">
              <KeyRoundIcon className="h-4 w-4" />
            </Button>
          </HoverCardTrigger>
        }
        placeholder="general.search"
        noDataMessage="general.empty"
        fetchData={structureHandler.get.layersUserHasSpecialAccessTo}
        onSelect={(item) => {
          const promises = filteredUserIds.map((id) => {
            if (id !== currentUserId) {
              return createRole({
                userId: id,
                layerId: item.id,
                role: "member",
              });
            }
          });
          Promise.all(promises).catch(console.log);
          emptyFilter();
        }}
        searchValue={(item) => item.name + " " + item.id}
        itemComponent={(item) => (
          <div className="flex w-full items-center justify-between">
            <p className="flex w-full items-center gap-2">
              <AutoLayerCourseIconDisplay
                course={item.course}
                className="h-5 w-5"
              />
              <span> {truncate(item.name ?? "", 20)}</span>
            </p>
          </div>
        )}
        renderHoverCard={true}
        hoverCard={(item) => <LayerSelectPathHoverCard layer={item} />}
      />{" "}
      {!open && (
        <HoverCardSheet className="mt-3 bg-background p-3">
          <GiveAccessToLayersTip />
        </HoverCardSheet>
      )}
    </HoverCard>
  );
}
