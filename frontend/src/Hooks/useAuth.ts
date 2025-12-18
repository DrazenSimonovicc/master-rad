import { useEffect, useState } from "react";
import { authService } from "@/libs/api";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser();
          setIsLoggedIn(true);
          setUserData(user);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
        setUserData(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    // Re-check auth periodically (every second)
    const interval = setInterval(checkAuth, 1000);

    // Re-check when window gains focus
    const handleFocus = () => checkAuth();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return { isLoggedIn, userData, authLoading };
};
