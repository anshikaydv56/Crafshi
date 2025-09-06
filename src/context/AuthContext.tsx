import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../config/api"; // Axios instance

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserFromSignup: (user: User, token: string) => void; // ✅ for signup
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Signup/Login helper (save token + user)
  const setUserFromSignup = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // ✅ Login
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const loggedInUser: User = res.data.user;
      const token: string = res.data.token;

      setUserFromSignup(loggedInUser, token);
    } catch (error: any) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // optional
    } catch (error) {
      console.warn("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const isAuthenticated = !!user;

  // ✅ Restore session
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);

          // Optional: verify token
          const res = await api.get("/auth/me");
          setUser(res.data.user);
        } catch {
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUserFromSignup, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
