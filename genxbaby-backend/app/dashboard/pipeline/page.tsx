"use client";

const columns = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "review", label: "In Review" },
  { key: "approved", label: "Approved" },
  { key: "funded", label: "Funded" },
];

const sampleDeals = {
  new: [
    { borrower: "John Doe", amount: "$420,000", score: 92, investor: "PrimeVest" },
    { borrower: "Sarah Lee", amount: "$310,000", score: 88, investor: "BlueRock" },
  ],
  contacted: [
    { borrower: "Marcus Hill", amount: "$780,000", score: 95, investor: "CapitalOne Partners" },
  ],
  review: [
    { borrower: "Emily Carter", amount: "$250,000", score: 90, investor: "PrimeVest" },
  ],
  approved: [
    { borrower: "Michael Turner", amount: "$1.2M", score: 97, investor: "PrimeVest" },
  ],
  funded: [
    { borrower: "Alicia Gomez", amount: "$600,000", score: 93, investor: "BlueRock" },
  ],
};

export default function PipelinePage() {
  return (
    <div className="p-6 space-y-8">
      {/* PAGE HEADER */}
      <h1 className="gx-text-primary text-2xl font-bold">Pipeline</h1>

      {/* KANBAN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {columns.map((col) => (
          <PipelineColumn
            key={col.key}
            title={col.label}
            deals={sampleDeals[col.key]}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function PipelineColumn({
  title,
  deals,
}: {
  title: string;
  deals: any[];
}) {
  return (
    <div className="gx-card p-4 flex flex-col h-full">
      <h2 className="gx-text-primary text-lg font-semibold mb-4">{title}</h2>

      <div className="space-y-4 overflow-y-auto pr-1">
        {deals.length === 0 && (
          <p className="gx-text-muted text-sm">No deals</p>
        )}

        {deals.map((deal, idx) => (
          <DealCard key={idx} deal={deal} />
        ))}
      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: any }) {
  return (
    <div className="gx-card p-4 hover:bg-white/10 transition rounded-xl cursor-pointer">
      <div className="flex items-center justify-between">
        <span className="gx-text-primary font-semibold">{deal.borrower}</span>
        <ScoreChip score={deal.score} />
      </div>

      <div className="gx-text-secondary text-sm mt-1">
        Loan Amount: <span className="gx-text-primary">{deal.amount}</span>
      </div>

      <div className="gx-text-secondary text-sm">
        Investor: <span className="gx-text-primary">{deal.investor}</span>
      </div>
    </div>
  );
}

function ScoreChip({ score }: { score: number }) {
  const color =
    score >= 95
      ? "bg-green-600"
      : score >= 90
      ? "bg-blue-600"
      : "bg-purple-600";

  return (
    <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${color}`}>
      {score}
    </span>
  );
}
