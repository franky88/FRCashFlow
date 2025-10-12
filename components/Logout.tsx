"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const Logout = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <Button
      variant="link"
      onClick={handleLogout}
      disabled={loggingOut}
      className="flex items-start gap-2 h-7"
    >
      <LogOut className="h-4 w-4" />
      <span className="text-slate-800">
        {loggingOut ? "Logging out..." : "Logout"}
      </span>
    </Button>
  );
};

export default Logout;
