import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, role, token }
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("ehr-user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      // Example API call -> adjust with your backend
      const res = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        credentials
      );
      const loggedInUser = res.data; // { id, role, token }

      setUser(loggedInUser);
      localStorage.setItem("ehr-user", JSON.stringify(loggedInUser));
      return { success: true, user: loggedInUser };
    } catch (err) {
      console.error("Login failed", err);
      return {
        success: false,
        message: err.response?.data?.error || "Login failed",
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("ehr-user");
  };

  // Auth header helper (used in services)
  const authHeader = () => {
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authHeader, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
