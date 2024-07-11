import dayjs from "dayjs";
import { Ban, Check, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  fetchOrganizers,
  getUsersOfInstitutionAndAvailabilityForTime,
} from "@/src/client-functions/client-appointment";
import classNames from "@/src/client-functions/client-utils";
import type { UserWithAvailability } from "@/src/types/user-management.types";
import { AsyncTagSelect } from "../../reusable/async-tag-select";
import { Button } from "../../reusable/shadcn-ui/button";
import { Label } from "../../reusable/shadcn-ui/label";
import WithToolTip from "../../reusable/with-tooltip";
import UserDefaultImage from "../../user-default-image";
import useAppointmentEditor from "./zustand";

export default function AppointmentOrganizerSelector() {
  const { dateTime, duration, organizerIds, setOrganizerIds } =
    useAppointmentEditor();
  const { t } = useTranslation("page");

  const handleSelect = (user: UserWithAvailability) => {
    if (organizerIds.includes(user.id)) return;
    const orgs = [...organizerIds, user.id];
    setOrganizerIds(orgs);
  };

  const handleRemove = (user: UserWithAvailability) => {
    const filteredOrganizerIds = organizerIds.filter((id) => id !== user.id);
    setOrganizerIds(filteredOrganizerIds);
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
              {t("planner.organizers.title")}
              <WithToolTip text={t("organizer.tooltip")}>
                <Button variant={"ghost"} size={"iconSm"}>
                  <HelpCircle className="size-3.5 text-muted-contrast" />
                </Button>
              </WithToolTip>
            </div>
          </Label>
        </div>
        <div className="w-[70%]">
          <AsyncTagSelect
            tagsPromise={fetchOrganizers}
            placeholder="general.search"
            placeholderWithTags="search.more_users"
            noDataMessage="general.no_results"
            fetchData={() =>
              getUsersOfInstitutionAndAvailabilityForTime(dateTime, duration)
            }
            onSelect={handleSelect}
            onRemove={handleRemove}
            filter={(user) => !organizerIds.includes(user.id)}
            searchValue={(user) => user.name + " " + user.id}
            itemComponent={(user) => <UserOption user={user} />}
            tagComponent={(user) => (
              <div className="flex items-center gap-2 pr-3">
                <UserDefaultImage user={user} dimensions="h-5 w-5" />
                <p className="text-sm">{user.name}</p>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export const UserOption = ({ user }: { user: UserWithAvailability }) => {
  const { t } = useTranslation("page");

  return (
    <div className="flex items-center space-x-3">
      <UserDefaultImage user={user} dimensions="w-7 h-7" />
      <div className="flex flex-col -space-y-1">
        <span className="text-sm font-medium">{user.name}</span>
        {(!user.conflicts || user.conflicts.length === 0) && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            {" "}
            {t("appointment_modal.organizer_search_available")}
            <Check className="w-3 text-emerald-500" />
          </span>
        )}
        {user.conflicts.length !== 0 && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            {t("appointment_modal.organizer_search_in_event")}{" "}
            {user.conflicts[0] && user.conflicts[0].duration ? (
              <>
                In event from{" "}
                {dayjs(user.conflicts[0].dateTime).format("HH:mm") +
                  " to " +
                  dayjs(user.conflicts[0].dateTime)
                    .add(user.conflicts[0].duration, "minute")
                    .format("HH:mm")}
              </>
            ) : (
              <>{t("appointment_modal.organizer_search_unavailable")}</>
            )}
            <Ban className="w-3 text-destructive" />
          </span>
        )}
      </div>
    </div>
  );
};
