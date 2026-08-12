import { useCase } from '@/hooks/useCase';

export default function CaseView({ params }) {
  const { caseData } = useCase(params.id);

  if (!caseData) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Case #{caseData.caseId}</h1>

      <section className="mb-6">
        <h2 className="font-semibold">Fraud Intelligence</h2>
        <pre>{JSON.stringify(caseData.fraudIntel, null, 2)}</pre>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold">Synthetic Intelligence</h2>
        <pre>{JSON.stringify(caseData.syntheticIntel, null, 2)}</pre>
      </section>

      <section>
        <h2 className="font-semibold">Underwriting Intelligence</h2>
        <pre>{JSON.stringify(caseData.underwritingIntel, null, 2)}</pre>
      </section>
    </div>
  );
}
