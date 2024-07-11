import {
  Activity,
  Book,
  Bot,
  Calendar,
  DollarSign,
  Rocket,
  Users,
} from "lucide-react";
import {
  activeNowWidgetData,
  getWidgetData,
  nextInvoiceWidgetData,
  usersWidgetData,
} from "@/src/client-functions/client-widgets";

export const widgets: Widget[] = [
  {
    identifier: "total_users",
    title: "admin_dashboard.total_users_widget",
    icon: <Users size={16} className="text-primary" />,
    promise: async () => usersWidgetData(),
  },
  {
    identifier: "total_courses",
    title: "admin_dashboard.total_courses_widget",
    icon: <Book size={16} className={"text-primary"} />,
    promise: () => getWidgetData("total_courses"),
  },
  {
    identifier: "total_active_now",
    title: "admin_dashboard.total_active_now_widget",
    icon: <Activity size={16} className="text-primary" />,
    promise: () => activeNowWidgetData(),
  },
  {
    identifier: "total_appointments",
    title: "admin_dashboard.total_appointments_widget",
    icon: <Calendar size={16} className="text-primary" />,
    promise: () => getWidgetData("total_appointments"),
  },
  {
    identifier: "ai_usage",
    title: "admin_dashboard.ai_usage_widget",
    icon: <Bot size={16} className="text-primary" />,
    promise: () => getWidgetData("ai_usage"),
  },
  {
    identifier: "next_invoice",
    title: "admin_dashboard.next_invoice_widget",
    icon: <DollarSign size={16} className="text-primary" />,
    promise: () => nextInvoiceWidgetData(),
  },
  {
    identifier: "current_plan",
    title: "user_capacity",
    icon: <Rocket size={16} className="text-primary" />,
    promise: () => getWidgetData("current_plan"),
  },
];
