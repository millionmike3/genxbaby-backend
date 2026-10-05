// src/auth/Register.jsx
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import Button from "../components/ui/Button";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const register = async () => {
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      alert("Registration failed");
    }
  };

  return (
    <AuthLayout title="Create Account">
      <input
        style={inputStyle}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={inputStyle}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={register}>Register</Button>

      <p style={{ marginTop: spacing.md }}>
        <a href="/login" style={{ color: colors.neonGreen }}>Already have an account?</a>
      </p>
    </AuthLayout>
  );
}
