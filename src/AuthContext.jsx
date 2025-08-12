import { createContext, useContext, useEffect, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [location, setLocation] = useState("GATE");
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("token");
    if (saved) {
      setToken(saved);
      setLocation("TABLET");
    }
  }, []);

  async function signup(username) {
    setError(null);
    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ username, password: "password123" }),
      });
      const data = await res.json();

      if (!res.ok || !data?.token) {
        throw new Error(data?.message || "Signup failed");
      }

      setToken(data.token);
      sessionStorage.setItem("token", data.token);
      setLocation("TABLET");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  async function authenticate() {
    setError(null);
    if (!token) {
      const msg = "No token found. Please sign up first.";
      setError(msg);
      throw new Error(msg);
    }
    try {
      const res = await fetch(`${API}/authenticate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Authentication failed");
      }
      setLocation("TUNNEL");
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    }
  }

  const value = { token, location, error, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
