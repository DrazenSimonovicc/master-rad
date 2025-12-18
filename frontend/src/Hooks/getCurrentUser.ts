import { useEffect, useState } from "react";
import { userDataType } from "@/Interfaces/BaseType";
import { authService } from "@/libs/api";

export const useFetchCurrentUser = () => {
  const [userData, setUserData] = useState<userDataType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchCurrentUser() {
    try {
      // Prvo proveri da li postoji token
      if (!authService.isAuthenticated()) {
        setError("Korisnik nije prijavljen");
        setLoading(false);
        return;
      }

      // Pozovi API za dobijanje podataka o trenutnom korisniku
      const response = await authService.getMe();
      setUserData(response as userDataType);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching current user:", error);
      setError(
        error.response?.data?.error || 
        "Problem prilikom učitavanja podataka korisnika. Molimo Vas da pokušate kasnije."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return { userData, error, loading, refetch: fetchCurrentUser };
};



