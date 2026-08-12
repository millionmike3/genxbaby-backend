import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function useCases() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get('/cases');
      setCases(res.data);
    }

    load();
  }, []);

  return { cases };
}
