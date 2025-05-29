import { useState, useEffect } from "react";
import axios from "axios";
import { FooterItemType } from "@/Interfaces/Footer";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchFooter = () => {
  const [footerData, setFooterData] = useState<FooterItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchFooterData() {
    try {
      const response = await axios.get(
        `${PocketBaseCollection}/Footer_data/records?expand=faculty,personal`,
      );
      setFooterData(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError("Error fetching footer data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFooterData();
  }, []);

  return { footerData, error, loading };
};
