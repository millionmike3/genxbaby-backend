import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function useCheck(checkId: string) {
  const [check, setCheck] = useState(null);
  const [uw, setUw] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/checks/${checkId}`);
      setCheck(res.data);
    }

    load();
  }, [checkId]);

  async function underwrite() {
    const res = await api.get(`/checks/${checkId}/underwrite`);
    setUw(res.data);
  }

  return { check, uw, underwrite };
}
