import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct way to import jwt-decode

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
    userId: null, // Add userId to the state
  });

  // Set default axios headers when the auth state updates
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = auth.token;

      // Decode the token to extract user information
      const decodedToken = jwtDecode(auth.token);
      setAuth((prevAuth) => ({
        ...prevAuth,
        userId: decodedToken._id, // Assuming your token payload has `_id`
      }));
    } else {
      delete axios.defaults.headers.common["Authorization"]; // Remove header if token is empty
    }
  }, [auth.token]);

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        user: parseData.user,
        token: parseData.token,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
