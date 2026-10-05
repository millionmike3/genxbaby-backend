export type BehaviorInput = {
  applicationId: string;
  borrowerId: string;
  ipAddress?: string;
  deviceId?: string;
  submittedAt: Date;
  priorApplicationsCount: number;
  rejectedApplicationsCount: number;
  documentCount: number;
  avgDocumentUploadDelayMinutes: number;
};

export type BehaviorAnalysis = {
  behaviorScore: number;        // 0–100
  fraudScore: number;           // 0–100
  riskFlags: string[];          // e.g. ["IP_MISMATCH", "DOC_PATTERN_ANOMALY"]
  notes: string[];
};
