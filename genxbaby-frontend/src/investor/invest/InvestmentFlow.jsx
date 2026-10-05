// src/investor/invest/InvestmentFlow.jsx
import React, { useState } from "react";

import StepSelectOpportunity from "./StepSelectOpportunity";
import StepReviewTerms from "./StepReviewTerms";
import StepEnterAmount from "./StepEnterAmount";
import StepKYC from "./StepKYC";
import StepConfirm from "./StepConfirm";
import StepReceipt from "./StepReceipt";

export default function InvestmentFlow() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);
  const [terms, setTerms] = useState(null);
  const [amount, setAmount] = useState(0);
  const [kyc, setKyc] = useState(null);
  const [receipt, setReceipt] = useState(null);

  return (
    <>
      {step === 1 && (
        <StepSelectOpportunity
          onSelect={(op) => {
            setSelected(op);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <StepReviewTerms
          opportunity={selected}
          onContinue={(t) => {
            setTerms(t);
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <StepEnterAmount
          opportunity={selected}
          onContinue={(amt) => {
            setAmount(amt);
            setStep(4);
          }}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <StepKYC
          onContinue={(kycData) => {
            setKyc(kycData);
            setStep(5);
          }}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && (
        <StepConfirm
          opportunity={selected}
          terms={terms}
          amount={amount}
          kyc={kyc}
          onConfirm={(r) => {
            setReceipt(r);
            setStep(6);
          }}
          onBack={() => setStep(4)}
        />
      )}

      {step === 6 && <StepReceipt receipt={receipt} />}
    </>
  );
}
