import { prisma } from "@/lib/db/prisma";
import { calculateLeadScore } from "@/lib/lead-scoring";
import { getLeadEvents } from "@/lib/db/events";

async function runNightlyLeadScoring() {
  console.log("Starting nightly lead scoring…");

  const leads = await prisma.lead.findMany();

  for (const lead of leads) {
    const events = await getLeadEvents(lead.id);
    const score = calculateLeadScore(lead, events);

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        hardshipScore: score.hardshipScore,
        hardshipBand: score.hardshipBand,
        investorPotentialScore: score.investorPotentialScore,
        investorPotentialBand: score.investorPotentialBand,
        impulsivityScore: score.impulsivityScore,
        impulsivityBand: score.impulsivityBand,
        updatedAt: new Date(),
      },
    });

    console.log(`Scored lead ${lead.id}`);
  }

  console.log("Nightly scoring complete.");
}

runNightlyLeadScoring()
  .catch((err) => {
    console.error("Cron job failed:", err);
  })
  .finally(() => process.exit(0));
