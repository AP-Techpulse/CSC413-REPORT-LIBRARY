import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./Loader.jsx";

export default function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) return <Loader label="Checking your session..." />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
