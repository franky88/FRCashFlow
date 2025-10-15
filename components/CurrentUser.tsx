"use client";

import { User } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Logout from "./Logout";

export default function CurrentUser() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, [supabase.auth]);

  return (
    <>
      <p>
        Welcome back{" "}
        <strong>
          {user?.user_metadata.full_name?.toUpperCase().split(" ")[0]}
        </strong>
        !
      </p>
      {/* <Avatar>
        <AvatarImage src={user?.user_metadata.avatar_url} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar> */}
      <Logout />
    </>
  );
}
