import { useEffect, useState } from "react";
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
        `${PocketBaseCollection}/footer_data/records?expand=faculty,personal`,
      );
      setFooterData(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja podataka koji se nalaze u futeru. Molimo Vas da pokušate kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFooterData();
  }, []);

  return { footerData, error, loading };
};
