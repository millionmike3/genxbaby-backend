"use client";

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-8">

      {/* TOP ROW — KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard label="Active Borrowers" value="128" />
        <KpiCard label="Active Investors" value="54" />
        <KpiCard label="Signals Today" value="312" />
        <KpiCard label="Pipeline Volume" value="$4.2M" />
      </div>

      {/* MIDDLE ROW — ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityCard title="Recent Signals" />
        <ActivityCard title="Recent Investor Activity" />
      </div>

      {/* BOTTOM ROW — SYSTEM HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HealthCard title="Bluetooth Scanner" status="Online" />
        <HealthCard title="API Uptime" status="99.98%" />
        <HealthCard title="Queue Latency" status="12ms" />
      </div>

    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="gx-card p-6 flex flex-col">
      <span className="gx-text-secondary text-sm">{label}</span>
      <span className="gx-text-primary text-3xl font-bold mt-2">{value}</span>
    </div>
  );
}

function ActivityCard({ title }: { title: string }) {
  return (
    <div className="gx-card p-6">
      <h2 className="gx-text-primary text-lg font-semibold mb-4">{title}</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="gx-text-secondary">John Doe triggered a signal</span>
          <span className="gx-text-muted text-sm">2m ago</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="gx-text-secondary">Investor matched with borrower</span>
          <span className="gx-text-muted text-sm">10m ago</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="gx-text-secondary">New borrower added to pipeline</span>
          <span className="gx-text-muted text-sm">22m ago</span>
        </div>
      </div>
    </div>
  );
}

function HealthCard({ title, status }: { title: string; status: string }) {
  return (
    <div className="gx-card p-6">
      <h2 className="gx-text-primary text-lg font-semibold mb-2">{title}</h2>
      <span className="gx-text-secondary text-xl font-bold">{status}</span>
    </div>
  );
}
