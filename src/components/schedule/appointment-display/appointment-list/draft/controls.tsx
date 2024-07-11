import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import React from "react";
import {
  acceptDraftAppointment,
  declineDraftAppointment,
} from "@/src/components/planner/functions";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { AppointmentWithRowData } from "../../../zustand";
import { APPOINTMENTS_QUERY_KEY } from "../../config";

type Props = {
  appointment: AppointmentWithRowData;
};

export default function Controls({ appointment }: Props) {
  const qc = useQueryClient();
  return (
    <div className="milkblur-light absolute bottom-1 right-1 flex flex-1 items-end self-end rounded-lg border border-muted bg-foreground/50">
      <Button
        variant={"ghost"}
        size={"iconSm"}
        className="hover:bg-muted/50"
        onClick={async () => {
          await acceptDraftAppointment(appointment);
          await qc.refetchQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
        }}
      >
        <Check className="h-3.5 w-3.5 text-positive" />
      </Button>
      <Button
        variant={"ghost"}
        size={"iconSm"}
        className="hover:bg-muted/50"
        onClick={() => declineDraftAppointment(appointment)}
      >
        <X className="h-3.5 w-3.5 text-destructive" />
      </Button>
    </div>
  );
}
