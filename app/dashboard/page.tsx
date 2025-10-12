import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CashflowDashboard from "@/components/CashflowDashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <CashflowDashboard userId={data.user.id} />
    </div>
  );
}
