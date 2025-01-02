import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AboutPage from "./pages/AboutPage";
import Logout from "./pages/Logout";
import Features from "./pages/FeaturesPage";
import { checkAuth, logoutUser } from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user authentication state
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authenticatedUser = await checkAuth();
        setUser(authenticatedUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={
            user && user.role === "Admin" ? (
              <SignUp />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<Features />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/admin-dashboard" /> : <Login />}
        />
        <Route
          path="/admin-dashboard"
          element={
            user && user.role === "Admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
        <Route
          path="/user-dashboard"
          element={
            user && user.role !== "Admin" ? (
              <UserDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            user && user.role === "Manager" ? (
              <ManagerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
