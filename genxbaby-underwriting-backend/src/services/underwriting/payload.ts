export const buildUnderwritingPayload = ({
  application,
  behavior,
  property,
  stock,
  decision
}) => {
  return {
    applicationId: application.id,
    borrower: {
      name: application.name,
      income: application.income,
      creditScore: application.creditScore
    },
    behavior,
    property,
    stock,
    decision,
    timestamp: Date.now()
  };
};
