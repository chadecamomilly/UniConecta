import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function RotaProtegida({ children }) {
  const { user, loading } = useAuth();

  if (loading || user === undefined) {
    return <p>Carregando...</p>; // ou um spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
