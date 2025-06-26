import { useEffect, useState } from "react";
import { pb } from "@/libs/pocketbase";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid) {
      setIsLoggedIn(true);
      const user = pb.authStore.record;
      setUserData(user);
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
    setAuthLoading(false);
  }, []);

  return { isLoggedIn, userData, authLoading };
};
