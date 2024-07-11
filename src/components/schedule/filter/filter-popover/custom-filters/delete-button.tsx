import { X } from "lucide-react";
import confirmAction from "@/src/client-functions/client-options-modal";
import { deleteScheduleCustomFilter } from "@/src/client-functions/client-schedule-filter";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useScheduleFilter from "../../../zustand-filter";

export default function DeleteFilterButton(props: { id: string }) {
  const { setFilteredLayers, setHaveNewCustomFilter } = useScheduleFilter();

  return (
    <Button
      className="ml-auto hidden h-4 w-4 text-contrast group-hover:flex"
      variant={"ghost"}
      size={"icon"}
      onClick={() =>
        confirmAction(
          async () => {
            await deleteScheduleCustomFilter(props.id!);
            setHaveNewCustomFilter(true);
            setFilteredLayers([]);
          },
          {
            title: "schedule_custom_filter_delete_title",
            description: "schedule_custom_filter_delete_description",
            allowCancel: true,
            actionName: "general.delete",
          },
        )
      }
    >
      <X />
    </Button>
  );
}
