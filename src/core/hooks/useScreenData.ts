import { useEffect, useState } from "react";
import { http } from "@/core/utils/http.util";

interface UseScreenDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useScreenData = <T>(endpoint: string, dependencies: unknown[] = []): UseScreenDataReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await http.get(endpoint);
        setData(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao buscar dados";
        setError(errorMessage);
        console.error(`Erro ao buscar dados de ${endpoint}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, ...dependencies]);

  return { data, loading, error };
};
