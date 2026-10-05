// src/index.jsx
import React from "react";
import AppRouter from "./navigation/AppRouter";
import colors from "./design/tokens/colors";

export default function App() {
  const globalStyle = {
    margin: 0,
    padding: 0,
    backgroundColor: colors.black,
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <div style={globalStyle}>
      <AppRouter />
    </div>
  );
}
