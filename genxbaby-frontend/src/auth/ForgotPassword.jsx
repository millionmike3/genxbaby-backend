// src/auth/ForgotPassword.jsx
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import Button from "../components/ui/Button";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const inputStyle = {
    width: "100%",
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: "8px",
    border: `1px solid ${colors.slate}`,
    backgroundColor: colors.black,
    color: colors.metallicSilver,
    fontFamily: typography.fonts.body,
    transition: "all 250ms ease",
  };

  const reset = async () => {
    const res = await fetch("/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    alert(res.ok ? "Reset link sent" : "Error sending reset link");
  };

  return (
    <AuthLayout title="Reset Password">
      <input
        style={inputStyle}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button onClick={reset}>Send Reset Link</Button>

      <p style={{ marginTop: spacing.md }}>
        <a href="/login" style={{ color: colors.neonGreen }}>Back to Login</a>
      </p>
    </AuthLayout>
  );
}
