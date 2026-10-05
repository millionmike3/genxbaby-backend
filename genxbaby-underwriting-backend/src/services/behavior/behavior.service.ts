import { BehaviorInput, BehaviorAnalysis } from "./behavior.types";

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

const scoreApplicationHistory = (input: BehaviorInput) => {
  const { priorApplicationsCount, rejectedApplicationsCount } = input;

  let fraudScore = 0;
  let flags: string[] = [];

  if (priorApplicationsCount > 3) {
    fraudScore += 20;
    flags.push("HIGH_APPLICATION_FREQUENCY");
  }

  if (rejectedApplicationsCount > 1) {
    fraudScore += 25;
    flags.push("MULTIPLE_REJECTIONS");
  }

  return { fraudScore, flags };
};

const scoreDocumentBehavior = (input: BehaviorInput) => {
  const { documentCount, avgDocumentUploadDelayMinutes } = input;

  let fraudScore = 0;
  let flags: string[] = [];

  if (documentCount === 0) {
    fraudScore += 30;
    flags.push("NO_SUPPORTING_DOCUMENTS");
  }

  if (avgDocumentUploadDelayMinutes > 1440) {
    fraudScore += 15;
    flags.push("SLOW_DOCUMENT_UPLOAD");
  }

  return { fraudScore, flags };
};

const scoreTimingBehavior = (input: BehaviorInput) => {
  const hour = input.submittedAt.getUTCHours();

  let fraudScore = 0;
  let flags: string[] = [];

  if (hour >= 0 && hour <= 4) {
    fraudScore += 10;
    flags.push("LATE_NIGHT_SUBMISSION");
  }

  return { fraudScore, flags };
};

export const analyzeBehavior = async (
  input: BehaviorInput
): Promise<BehaviorAnalysis> => {
  const history = scoreApplicationHistory(input);
  const docs = scoreDocumentBehavior(input);
  const timing = scoreTimingBehavior(input);

  const totalFraudScore = clamp(
    history.fraudScore + docs.fraudScore + timing.fraudScore
  );

  const behaviorScore = clamp(100 - totalFraudScore);

  const riskFlags = [...history.flags, ...docs.flags, ...timing.flags];

  const notes: string[] = [];

  if (totalFraudScore >= 60) {
    notes.push("High fraud risk based on behavioral patterns.");
  } else if (totalFraudScore >= 30) {
    notes.push("Moderate behavioral risk; consider manual review.");
  } else {
    notes.push("Behavioral profile appears low risk.");
  }

  return {
    behaviorScore,
    fraudScore: totalFraudScore,
    riskFlags,
    notes
  };
};
