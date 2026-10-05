export const sanitizeProperty = async (property) => {
  return {
    normalizedAddress: property.address.trim(),
    collateralScore: 85,
    ltvRisk: "LOW",
    flags: []
  };
};
