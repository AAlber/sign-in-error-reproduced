import DashboardFilter from "./filter";

export default function AdminDashFilters() {
  return (
    <div className="flex gap-2 rounded-md">
      <DashboardFilter filterId="No Filter" />
      <DashboardFilter filterId="No Subscription" />
      <DashboardFilter filterId="Test Institution" />
      <DashboardFilter filterId="Fake Trial (like FHS)" />
      <DashboardFilter filterId="Subscription" />
    </div>
  );
}
