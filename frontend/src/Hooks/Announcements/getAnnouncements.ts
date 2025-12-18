import { useCallback, useEffect, useState } from "react";
import { AnnouncementsType } from "@/Interfaces/BaseType";
import { announcementService } from "@/libs/api";

export const useFetchAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementsType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await announcementService.getAll();
      setAnnouncements(response.items || []);
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
