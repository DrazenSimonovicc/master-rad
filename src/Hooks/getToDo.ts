import { useState, useEffect } from "react";
import axios from "axios";
import { toDoType } from "@/Interfaces/Todo";
import { PocketBaseCollection } from "@/libs/pocketbase";

export const useFetchToDo = () => {
  const [toDo, setToDo] = useState<toDoType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchTODOData() {
    try {
      const response = await axios.get(`${PocketBaseCollection}/todo/records`);
      setToDo(response.data.items || []);
      setError(null);
    } catch (error: any) {
      setError("Error fetching to-do items. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTODOData();
  }, []);

  const updateToDo = (newItem: toDoType) => {
    setToDo((prevToDo) => [...prevToDo, newItem]);
  };

  return { toDo, updateToDo, error, loading };
};
