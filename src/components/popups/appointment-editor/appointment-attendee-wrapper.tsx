import { Users } from "lucide-react";
import React from "react";
import type { AppointmentAttendee } from "@/src/types/appointment.types";
import type { UserWithAvailability } from "@/src/types/user-management.types";
import type { UserGroup } from "../../institution-settings/setting-containers/insti-settings-groups";
import { AutoLayerCourseIconDisplay } from "../../reusable/course-layer-icons";
import UserDefaultImage from "../../user-default-image";
import { UserOption } from "./appointment-organizer-selector";

type RenderType = "tag" | "item";

export const AppointmentAttendeeWrapper = ({
  appointmentAttendee,
  renderType,
  size = "default",
}: {
  appointmentAttendee: AppointmentAttendee;
  renderType: RenderType;
  size?: "sm" | "default";
}) => {
  const selectedSize = size === "sm" ? "4" : "5";
  const handleRenderComponent = (
    item: AppointmentAttendee,
    renderType: RenderType,
  ) => {
    switch (item.type) {
      case "layer":
        return (
          <>
            <AutoLayerCourseIconDisplay
              course={item.course}
              className={`size-${selectedSize}`}
            />
            <p className="text-sm">{item.name}</p>
          </>
        );
      case "user":
        const user = item as unknown as UserWithAvailability;
        if (renderType === "tag") {
          return (
            <>
              <UserDefaultImage
                user={user}
                dimensions={`h-${selectedSize} w-${selectedSize}`}
              />
              <p className="text-sm">{user.name}</p>
            </>
          );
        }
        return <UserOption user={user} />;
      case "group":
        const group = item as unknown as UserGroup;
        return (
          <>
            <Users className={`size-${selectedSize}`} />
            <p className="text-sm">{group.name}</p>
          </>
        );
      default:
        return <></>;
    }
  };
  return <>{handleRenderComponent(appointmentAttendee, renderType)}</>;
};
