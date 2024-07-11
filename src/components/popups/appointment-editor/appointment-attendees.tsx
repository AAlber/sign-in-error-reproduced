import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  fetchAllAttendees,
  fetchSelectedAttendees,
} from "@/src/client-functions/client-appointment";
import classNames from "@/src/client-functions/client-utils";
import type { AppointmentAttendee } from "@/src/types/appointment.types";
import { AsyncTagSelect } from "../../reusable/async-tag-select";
import { Button } from "../../reusable/shadcn-ui/button";
import { Label } from "../../reusable/shadcn-ui/label";
import WithToolTip from "../../reusable/with-tooltip";
import { AppointmentAttendeeWrapper } from "./appointment-attendee-wrapper";
import useAppointmentEditor from "./zustand";

export const AppointmentAttendees = () => {
  const {
    layerIds,
    userAttendeeIds,
    userGroupAttendeeIds,
    dateTime,
    duration,
    setLayerIds,
    setUserAttendeeIds,
    setUserGroupAttendeeIds,
  } = useAppointmentEditor();
  const { t } = useTranslation("page");

  const handleSelect = (attendee: AppointmentAttendee) => {
    switch (attendee.type) {
      case "layer":
        setLayerIds([...layerIds, attendee.id]);
        return;
      case "user":
        setUserAttendeeIds([...userAttendeeIds, attendee.id]);
        return;
      case "group":
        setUserGroupAttendeeIds([...userGroupAttendeeIds, attendee.id]);
      default:
        return;
    }
  };

  const handleRemove = (attendee: AppointmentAttendee) => {
    switch (attendee.type) {
      case "layer":
        const filteredLayerIds = layerIds.filter((id) => id !== attendee.id);
        setLayerIds(filteredLayerIds);
      case "user":
        const filteredUserIds = userAttendeeIds.filter(
          (id) => id !== attendee.id,
        );
        setUserAttendeeIds(filteredUserIds);
      case "group":
        const filteredUserGroupIds = userGroupAttendeeIds.filter(
          (id) => id !== attendee.id,
        );
        setUserGroupAttendeeIds(filteredUserGroupIds);
      default:
        return;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-start gap-2">
        <div className="w-[30%]">
          <Label
            className={classNames(
              "col-span-1 flex flex-col justify-start gap-1",
            )}
          >
            <div className="relative flex w-full items-center gap-1">
              {t("attendees")}
              <WithToolTip text={t("attendees.tooltip")}>
                <Button variant={"ghost"} size={"iconSm"}>
                  <HelpCircle className="size-3.5 text-muted-contrast" />
                </Button>
              </WithToolTip>
            </div>
          </Label>
        </div>
        <div className="w-[70%]">
          <AsyncTagSelect
            tagsPromise={async () =>
              await fetchSelectedAttendees(
                userAttendeeIds,
                layerIds,
                userGroupAttendeeIds,
              )
            }
            fetchData={async () => await fetchAllAttendees(dateTime, duration)}
            searchValue={(item) => item.name + " " + item.id}
            itemComponent={(item) => (
              <div className="flex items-center gap-2 pr-3">
                <AppointmentAttendeeWrapper
                  appointmentAttendee={item}
                  renderType="item"
                />
              </div>
            )}
            noDataMessage="general.empty"
            placeholder="general.search"
            filter={(item) =>
              !layerIds.includes(item.id) &&
              !userAttendeeIds.includes(item.id) &&
              !userGroupAttendeeIds.includes(item.id)
            }
            onSelect={handleSelect}
            onRemove={handleRemove}
            placeholderWithTags="search.more_users"
            tagComponent={(item) => (
              <div className="flex items-center gap-2 pr-3">
                <AppointmentAttendeeWrapper
                  appointmentAttendee={item}
                  renderType="tag"
                />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};
