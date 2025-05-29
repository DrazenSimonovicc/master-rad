import { useState, useEffect } from "react";
import { pb } from "@/libs/pocketbase";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null); // Adjust type as needed
  const [authLoading, setAuthLoading] = useState(true); // New state to track loading

  useEffect(() => {
    if (pb.authStore.isValid) {
      setIsLoggedIn(true);
      const user = pb.authStore.record;
      setUserData(user);
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
    setAuthLoading(false); // Authentication check is complete
  }, []);

  return { isLoggedIn, userData, authLoading };
};
