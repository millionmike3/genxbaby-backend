for (const flag of flags) {
  const createdFlag = await prisma.fraudFlag.create({
    data: {
      type: flag.type,
      severity: flag.severity,
      message: flag.message,
      checkId: check.id,
    },
  });

  // AUTO-GENERATE SAR
  await prisma.suspiciousActivityReport.create({
    data: {
      flagId: createdFlag.id,
      checkId: check.id,
      severity: flag.severity,
      type: flag.type,
      summary: `Suspicious activity detected: ${flag.type} (${flag.severity}). Details: ${flag.message}`,
    },
  });

  // AUDIT LOG
  await logAudit("GENERATE_SAR", {
    flagId: createdFlag.id,
    checkId: check.id,
    severity: flag.severity,
    type: flag.type,
  });
}
