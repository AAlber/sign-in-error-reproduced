import { CornerUpRight, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import Map from "../../reusable/map-display";

export default function AppointmentAddressDisplay({ appointment }) {
  const { t } = useTranslation("page");
  return (
    <div className="flex flex-col gap-2 text-sm font-medium text-contrast">
      {t("course_appointment_getting_there")}
      <div className="flex flex-col gap-4">
        <Map height="150px" address={(appointment as any).address} />
        <div className="flex items-center justify-between gap-2 text-xs font-normal text-muted-contrast">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{(appointment as any).address}</span>
          </span>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              (appointment as any).address,
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <CornerUpRight className="h-4 w-4 hover:text-primary" />
          </a>
        </div>
      </div>
    </div>
  );
}
