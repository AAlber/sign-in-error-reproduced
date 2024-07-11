import Head from "next/head";
import { AdminDashboard } from "@/src/components/admin-dashboard/table";

export default function AdminDash() {
  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin Dashboard Fuxam" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <AdminDashboard />
    </>
  );
}
