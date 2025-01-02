import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, requiredRole, children }) => {
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
