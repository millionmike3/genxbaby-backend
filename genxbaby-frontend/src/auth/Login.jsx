// src/auth/Login.jsx
import React, { useState, useContext } from "react";
import AuthLayout from "./AuthLayout";
import Button from "../components/ui/Button";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";
import { AuthContext } from "./AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);

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

  const handleLogin = async () => {
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid login");
        return;
      }

      // Store user + role in AuthContext + localStorage
      login({
        email: data.email,
        role: data.role, // ADMIN / OWNER / BORROWER / INVESTOR
      });

      // Redirect based on role
      if (data.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }

    } catch (err) {
      alert("Login error");
    }
  };

  return (
    <AuthLayout title="Login">
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

      <Button onClick={handleLogin}>Login</Button>

      <p style={{ marginTop: spacing.md }}>
        <a href="/register" style={{ color: colors.neonGreen }}>
          Create Account
        </a>
      </p>

      <p>
        <a href="/forgot" style={{ color: colors.electricCyan }}>
          Forgot Password?
        </a>
      </p>
    </AuthLayout>
  );
}
