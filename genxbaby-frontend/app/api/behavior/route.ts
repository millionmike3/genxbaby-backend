import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------
// SCORING FORMULAS PER PILLAR
// ---------------------------------------------------------

// ⭐ STOCK SANITIZER PILLAR
function scoreStockSanitizer(metrics: any) {
  const {
    clickRate,
    burstIndex,
    rageClickScore,
    formFillTimeMs,
    abandonedFormsCount,
    sessionVolatility,
    avgTimeOnPageMs,
    assetChangeCount,
    rapidChangeBursts,
    undoActions,
    holdingPeriodMs,
    portfolioVolatilityIndex,
    reactionTimeToMarketEventMs,
  } = metrics;

  const changeRate = assetChangeCount / metrics.sessionMinutes;
  const reversalRatio = assetChangeCount > 0 ? undoActions / assetChangeCount : 0;
  const holdingHaste = holdingPeriodMs > 0 ? 1_000_000 / holdingPeriodMs : 0;
  const reactionSpeed =
    reactionTimeToMarketEventMs > 0
      ? 1_000_000 / reactionTimeToMarketEventMs
      : 0;

  const raw =
    0.25 * changeRate +
    0.20 * rapidChangeBursts +
    0.15 * reversalRatio +
    0.15 * holdingHaste +
    0.15 * portfolioVolatilityIndex +
    0.10 * reactionSpeed;

  return Math.max(0, Math.min(100, raw));
}

// ⭐ CUSTOMER / LEAD PILLAR
function scoreCustomer(metrics: any) {
  const {
    formFillTimeMs,
    abandonedFormsCount,
    formsStarted,
    productSwitchCount,
    pagesVisited,
    sessionMinutes,
    messageUrgencyScore,
    responseTimeMs,
    sessionVolatility,
  } = metrics;

  const formHaste = formFillTimeMs > 0 ? 1_000_000 / formFillTimeMs : 0;
  const abandonRatio =
    formsStarted > 0 ? abandonedFormsCount / formsStarted : 0;
  const switchRate = productSwitchCount / sessionMinutes;
  const navSpeed = pagesVisited / sessionMinutes;
  const responseHaste = responseTimeMs > 0 ? 1_000_000 / responseTimeMs : 0;

  const raw =
    0.20 * formHaste +
    0.20 * abandonRatio +
    0.15 * switchRate +
    0.15 * navSpeed +
    0.15 * messageUrgencyScore +
    0.10 * responseHaste +
    0.05 * sessionVolatility;

  return Math.max(0, Math.min(100, raw));
}

// ⭐ INVESTOR PILLAR
function scoreInvestor(metrics: any) {
  const {
    commitmentChangeCount,
    withdrawalSpeedMs,
    termChangeCount,
    sentimentScore,
    reactionTimeToNewsMs,
    investmentVolatilityIndex,
    communicationFrequency,
    sessionMinutes,
  } = metrics;

  const commitRate = commitmentChangeCount / sessionMinutes;
  const withdrawHaste =
    withdrawalSpeedMs > 0 ? 1_000_000 / withdrawalSpeedMs : 0;
  const reactionSpeed =
    reactionTimeToNewsMs > 0 ? 1_000_000 / reactionTimeToNewsMs : 0;

  const raw =
    0.25 * commitRate +
    0.20 * withdrawHaste +
    0.15 * termChangeCount +
    0.15 * sentimentScore +
    0.10 * reactionSpeed +
    0.10 * investmentVolatilityIndex +
    0.05 * communicationFrequency;

  return Math.max(0, Math.min(100, raw));
}

// ---------------------------------------------------------
// CLASSIFICATION
// ---------------------------------------------------------
function classify(score: number, pillar: string) {
  if (pillar === "STOCK_SANITIZER") {
    if (score <= 25) return "stable";
    if (score <= 50) return "reactive";
    if (score <= 75) return "impulsive";
    return "volatile";
  }

  if (pillar === "CUSTOMER") {
    if (score <= 30) return "stable";
    if (score <= 60) return "reactive";
    if (score <= 80) return "impulsive";
    return "volatile";
  }

  if (pillar === "INVESTOR") {
    if (score <= 25) return "stable";
    if (score <= 50) return "reactive";
    if (score <= 75) return "impulsive";
    return "volatile";
  }

  return "stable";
}

// ---------------------------------------------------------
// MAIN API ROUTE
// ---------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      leadId,
      investorId,
      pillar,
      page,
      startedAt,
      endedAt,
      metrics,
    } = body;

    // Compute pillar-specific score
    let impulsivenessScore = 0;

    if (pillar === "STOCK_SANITIZER") {
      impulsivenessScore = scoreStockSanitizer(metrics);
    } else if (pillar === "CUSTOMER") {
      impulsivenessScore = scoreCustomer(metrics);
    } else if (pillar === "INVESTOR") {
      impulsivenessScore = scoreInvestor(metrics);
    }

    const level = classify(impulsivenessScore, pillar);

    // Create BehaviorSession
    const session = await prisma.behaviorSession.create({
      data: {
        userId,
        leadId,
        investorId,
        pillar,
        page,
        startedAt: new Date(startedAt),
        endedAt: new Date(endedAt),
        impulsivenessScore,

        // Raw metrics stored directly
        clickCount: metrics.clickCount,
        clickRate: metrics.clickRate,
        burstIndex: metrics.burstIndex,
        rageClickScore: metrics.rageClickScore,
        formFillTimeMs: metrics.formFillTimeMs,
        abandonedFormsCount: metrics.abandonedFormsCount,
        avgTimeOnPageMs: metrics.avgTimeOnPageMs,
        sessionVolatility: metrics.sessionVolatility,
      },
    });

    // Update BehaviorProfile
    const where = userId
      ? { userId, pillar }
      : leadId
      ? { leadId, pillar }
      : { investorId, pillar };

    const existing = await prisma.behaviorProfile.findFirst({ where });

    let profile;

    if (!existing) {
      profile = await prisma.behaviorProfile.create({
        data: {
          userId,
          leadId,
          investorId,
          pillar,
          sessionsCount: 1,
          avgImpulsivenessScore: impulsivenessScore,
          maxImpulsivenessScore: impulsivenessScore,
          impulsivenessLevel: level,
        },
      });
    } else {
      const newSessionsCount = existing.sessionsCount + 1;
      const newAvg =
        (existing.avgImpulsivenessScore * existing.sessionsCount +
          impulsivenessScore) /
        newSessionsCount;
      const newMax = Math.max(
        existing.maxImpulsivenessScore,
        impulsivenessScore
      );

      profile = await prisma.behaviorProfile.update({
        where: { id: existing.id },
        data: {
          sessionsCount: newSessionsCount,
          avgImpulsivenessScore: newAvg,
          maxImpulsivenessScore: newMax,
          impulsivenessLevel: classify(newAvg, pillar),
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      session,
      profile,
    });
  } catch (err) {
    console.error("BEHAVIOR ERROR:", err);
    return NextResponse.json(
      { error: "Failed to record behavior" },
      { status: 500 }
    );
  }
}
