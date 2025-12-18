import { useEffect, useState } from "react";
import { FooterItemType } from "@/Interfaces/Footer";

export const useFetchFooter = () => {
  const [footerData, setFooterData] = useState<FooterItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Footer data functionality disabled - returns empty array
  // TODO: Implement footer data API endpoint if needed
  
  useEffect(() => {
    setFooterData([]);
    setLoading(false);
  }, []);

  return { footerData, error, loading };
};
