import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function useCase(caseId: string) {
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/cases/${caseId}`);
      setCaseData(res.data);
    }

    load();
  }, [caseId]);

  return { caseData };
}
