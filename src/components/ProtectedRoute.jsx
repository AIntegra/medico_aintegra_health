import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // o spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
