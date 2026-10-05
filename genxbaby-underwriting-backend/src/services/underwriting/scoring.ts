export const calculateRiskScore = ({
  behaviorScore,
  collateralScore,
  macroRiskScore,
  borrowerScore
}) => {
  return (
    behaviorScore * 0.25 +
    collateralScore * 0.35 +
    macroRiskScore * 0.20 +
    borrowerScore * 0.20
  );
};
