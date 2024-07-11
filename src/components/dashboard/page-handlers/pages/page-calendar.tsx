import { Calendar } from "lucide-react";
import { PaginatedUpcomingEvents } from "@/src/components/course/info/paginated-upcoming-event";
import { DayWeekMonitorDisplay } from "@/src/components/schedule/day-week-monitor-display";
import ScheduleToolbar from "@/src/components/schedule/navigation";
import { PageBuilder } from "../page-registry";

const calendar = new PageBuilder("CALENDAR")
  .withIconComponent(<Calendar size={18} />)
  .withNavigationType("with-static-secondary-navigation")
  .withSecondaryNavigationElements([
    {
      id: "calendar",
      toolbarComponent: <ScheduleToolbar />,
      contentComponent: <DayWeekMonitorDisplay />,
      searchValue: "",
      tabComponent: () => <PaginatedUpcomingEvents />,
      type: "tab",
    },
  ])
  .withOptions({ searchDisabled: true, fixedSecondaryNavigation: true })
  .build();

export { calendar };
