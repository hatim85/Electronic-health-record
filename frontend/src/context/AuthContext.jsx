import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { userId, userRole, token }
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
      const res = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        credentials
      );
      console.log("credentials: ", credentials);
      // Map response into frontend format
      const loggedInUser = res.data;

      setUser(loggedInUser);
      localStorage.setItem("ehr-user", JSON.stringify(loggedInUser));
      console.log("Login successful:", loggedInUser);
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

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.userRole === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.userRole);
  };

  // Get the logged-in user's ID (for admin operations)
  const getLoggedInUserId = () => {
    return user?.userID;
  };

  // Get the logged-in user's role
  const getLoggedInUserRole = () => {
    return user?.userRole;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      authHeader,
      loading,
      hasRole,
      hasAnyRole,
      getLoggedInUserId,
      getLoggedInUserRole
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
