import { http } from "@/core/utils/http.util";
import { useEffect, useState } from "react";
import { QuerySchemaType } from "../utils/resource.util";

interface UseScreenDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

type ScreenDataOptions = {
  queryResources?: QuerySchemaType;
};

export const useScreenData = <T>(endpoint: string, options?: ScreenDataOptions): UseScreenDataReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await http.get(endpoint, options?.queryResources);
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
  }, [endpoint]);

  return { data, loading, error };
};
