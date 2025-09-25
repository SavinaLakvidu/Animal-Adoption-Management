// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = (user.role || "").toUpperCase();

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== String(requiredRole).toUpperCase()) {
    // Wrong role
    return <Navigate to="/" replace />;
  }

  return children; // allowed
}

export default ProtectedRoute;
