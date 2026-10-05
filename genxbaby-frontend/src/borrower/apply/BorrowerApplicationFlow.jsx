// src/borrower/apply/BorrowerApplicationFlow.jsx
import React, { useState } from "react";

import StepPurpose from "./StepPurpose";
import StepAmount from "./StepAmount";
import StepIncome from "./StepIncome";
import StepKYC from "./StepKYC";
import StepDocuments from "./StepDocuments";
import StepReview from "./StepReview";
import StepReceipt from "./StepReceipt";

export default function BorrowerApplicationFlow() {
  const [step, setStep] = useState(1);

  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState(0);
  const [income, setIncome] = useState(null);
  const [kyc, setKyc] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [receipt, setReceipt] = useState(null);

  return (
    <>
      {step === 1 && (
        <StepPurpose
          onContinue={(p) => {
            setPurpose(p);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <StepAmount
          onContinue={(amt) => {
            setAmount(amt);
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <StepIncome
          onContinue={(i) => {
            setIncome(i);
            setStep(4);
          }}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <StepKYC
          onContinue={(k) => {
            setKyc(k);
            setStep(5);
          }}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && (
        <StepDocuments
          onContinue={(docs) => {
            setDocuments(docs);
            setStep(6);
          }}
          onBack={() => setStep(4)}
        />
      )}

      {step === 6 && (
        <StepReview
          purpose={purpose}
          amount={amount}
          income={income}
          kyc={kyc}
          documents={documents}
          onSubmit={(r) => {
            setReceipt(r);
            setStep(7);
          }}
          onBack={() => setStep(5)}
        />
      )}

      {step === 7 && <StepReceipt receipt={receipt} />}
    </>
  );
}
