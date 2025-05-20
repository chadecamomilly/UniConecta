import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function RotaProtegida({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
