// src/landing/Landing.jsx
import React from "react";

import Hero from "./Hero";
import Features from "./Features";
import Trust from "./Trust";
import CTA from "./CTA";

import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";

export default function Landing() {
  const container = {
    backgroundColor: colors.black,
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden",
  };

  const section = {
    marginBottom: spacing.xxl,
  };

  return (
    <div style={container}>
      <div style={section}>
        <Hero />
      </div>

      <div style={section}>
        <Features />
      </div>

      <div style={section}>
        <Trust />
      </div>

      <div style={section}>
        <CTA />
      </div>
    </div>
  );
}
