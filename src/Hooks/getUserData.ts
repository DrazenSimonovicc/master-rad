import { useState, useEffect } from "react";
import axios from "axios";
import { userDataType } from "@/Interfaces/BaseType";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchUserData = () => {
  const [userData, setUserData] = useState<userDataType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchUserData() {
    try {
      const response = await axios.get(`${PocketBaseCollection}/users/records`);
      setUserData(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError("Error fetching to-do items. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return { userData, error, loading };
};
