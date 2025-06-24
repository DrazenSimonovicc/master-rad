import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { AnnouncementsType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementsType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${PocketBaseCollection}/important_announcements/records`,
      );
      setAnnouncements(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError(
        "Problem prilikom učitvanja važnih obaveštenja. Molimo Vas da pokušate kasnije.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements,
    error,
    loading,
  };
};
