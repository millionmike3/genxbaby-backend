import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function useChecks(bankProfileId?: string) {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await api.get('/checks', {
        params: { bankProfileId },
      });
      setChecks(res.data);
      setLoading(false);
    }

    load();
  }, [bankProfileId]);

  return { checks, loading };
}
