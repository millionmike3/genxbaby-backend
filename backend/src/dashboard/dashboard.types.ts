export interface DashboardSummary {
  totalChecks: number;
  flaggedChecks: number;
  totalOwners: number;
  totalUsers: number;
  recentActivity: any[];
}

export interface CheckStat {
  status: string;
  count: number;
}

export interface FraudStat {
  type: string;
  count: number;
}
