export type StockInput = {
  applicationId: string;
  asOf: Date;
  vixLevel?: number;              // market volatility index
  mortgageSpreadBps?: number;     // spread vs risk-free
  riskOnSentiment?: number;       // 0–100 (risk-on vs risk-off)
  liquidityIndex?: number;        // 0–100 (market liquidity)
};

export type StockSanitized = {
  macroRiskScore: number;         // 0–100 (higher = more risk)
  investorAppetiteScore: number;  // 0–100 (higher = more appetite)
  marketCondition: "RISK_ON" | "NEUTRAL" | "RISK_OFF";
  flags: string[];
  notes: string[];
};
