import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage or API
    const saved = localStorage.getItem("genxbaby_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (data) => {
    localStorage.setItem("genxbaby_user", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("genxbaby_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
