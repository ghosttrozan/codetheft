"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/userStore";

const FetchUser = () => {
  const { data: session } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const setLoaded = useUserStore((state) => state.setLoading);

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.id) {
        setLoaded();
        return;
      }
      const res = await fetch(`/api/users/${session?.user?.id}`);
      const data = await res.json();
      setUser(data);
      setLoaded();
    };
    fetchUser();
  }, [session, setUser]);

  return null;
};

export default FetchUser;
