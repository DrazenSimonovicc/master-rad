"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const usePageLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // If pathname changes, show loading
    if (currentPath && currentPath !== pathname) {
      setIsLoading(true);
      
      // Hide loading after a short delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
    
    // Update current path
    setCurrentPath(pathname);
  }, [pathname, currentPath]);

  return isLoading;
};
