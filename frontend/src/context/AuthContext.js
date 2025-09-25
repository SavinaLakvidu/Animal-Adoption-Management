// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw && raw !== "undefined" ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("Failed to parse user from localStorage", err);
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" ? t : null;
  });

  // Keep storage in sync
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [user, token]);

  const register = async (name, email, password) => {
    const res = await API.post("/user/register", { name, email, password });
    const data = res.data;

    setUser(data.user);
    setToken(data.accessToken);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.accessToken);

  return data;
  };

  const login = async (email, password) => {
    const res = await API.post("/user/login", { email, password });
    const body = res.data;
    if (!body) throw new Error("No response body from login");

    if (body.error) {
      throw new Error(body.message || "Login failed");
    }

    const payload = body.data || {};
    const loggedUser = payload.user || payload?.user || null;
    const accessToken = payload.accessToken || payload.access_token || payload.token || null;

    if (!loggedUser || !accessToken) {
      console.error("Unexpected login response shape:", body);
      throw new Error(body.message || "Login response missing user or token");
    }

    setUser(loggedUser);
    setToken(accessToken);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    localStorage.setItem("token", accessToken);

    return { user: loggedUser, accessToken, refreshToken: payload.refreshToken || payload.refresh_token };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
