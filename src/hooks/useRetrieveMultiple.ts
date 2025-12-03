/**
 * Exemplo de uso do RetrieveMultiple em um componente React
 */

'use client';

import { useEffect, useState } from 'react';
import { RetrieveMultiple, KeyValueResult } from '@/utils/retrieveMultiple.util';

export interface ResourceData {
  kvCompany?: KeyValueResult[];
  kvProfile?: KeyValueResult[];
}

export function useRetrieveMultiple() {
  const [data, setData] = useState<ResourceData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const result = await RetrieveMultiple.setResource([
          {
            resource: 'company',
            keyValue: true,
            alias: 'kvCompany',
          },
          {
            resource: 'profile',
            keyValue: true,
            alias: 'kvProfile',
          },
        ]);

        setData(result as ResourceData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return { data, loading, error };
}
