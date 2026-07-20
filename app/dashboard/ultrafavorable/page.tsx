"use client";

export default function UltraFavorablePage() {
  return (
    <div className="p-6 space-y-8">

      {/* HERO HEADER */}
      <div className="gx-gradient p-8 rounded-2xl shadow-lg">
        <h1 className="gx-text-primary text-3xl font-bold">UltraFavorable Deals</h1>
        <p className="gx-text-secondary mt-2 text-lg">
          Your highest‑scoring, highest‑probability matches — ranked and ready for action.
        </p>
      </div>

      {/* TOP DEALS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sampleDeals.map((deal, idx) => (
          <DealCard key={idx} deal={deal} rank={idx + 1} />
        ))}
      </div>

    </div>
  );
}

/* ---------------- SAMPLE DATA ---------------- */

const sampleDeals = [
  {
    borrower: "John Doe",
    amount: "$420,000",
    score: 97,
    probability: "98%",
    investor: "PrimeVest Capital",
    region: "East Coast",
  },
  {
    borrower: "Sarah Lee",
    amount: "$310,000",
    score: 95,
    probability: "96%",
    investor: "BlueRock Funding",
    region: "West Coast",
  },
  {
    borrower: "Marcus Hill",
    amount: "$780,000",
    score: 94,
    probability: "95%",
    investor: "CapitalOne Partners",
    region: "National",
  },
  {
    borrower: "Emily Carter",
    amount: "$250,000",
    score: 93,
    probability: "94%",
    investor: "PrimeVest Capital",
    region: "South",
  },
];

/* ---------------- COMPONENTS ---------------- */

function DealCard({ deal, rank }: { deal: any; rank: number }) {
  return (
    <div className="gx-card p-6 rounded-xl hover:bg-white/10 transition cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <h2 className="gx-text-primary text-xl font-bold">
          #{rank} — {deal.borrower}
        </h2>
        <ScoreChip score={deal.score} />
      </div>

      <div className="gx-text-secondary text-sm">
        Loan Amount: <span className="gx-text-primary">{deal.amount}</span>
      </div>

      <div className="gx-text-secondary text-sm">
        Investor Match: <span className="gx-text-primary">{deal.investor}</span>
      </div>

      <div className="gx-text-secondary text-sm">
        Region: <span className="gx-text-primary">{deal.region}</span>
      </div>

      <div className="gx-text-secondary text-sm mt-2">
        Match Probability:{" "}
        <span className="gx-text-primary font-semibold">{deal.probability}</span>
      </div>

      <button className="gx-btn-secondary mt-4 w-full py-2 text-sm">
        View Deal
      </button>
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
    <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${color}`}>
      {score}
    </span>
  );
}
