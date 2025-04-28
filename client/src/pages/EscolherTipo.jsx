import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../services/firebase";

export default function EscolherTipo() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const db = getDatabase(app);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const snapshot = await get(ref(db, `usuarios/${user.uid}`));
        if (snapshot.exists()) {
          navigate("/");
          return;
        }
        setLoading(false);
      } catch (err) {
        console.error("Erro ao verificar registro:", err);
        setError("Erro ao verificar seu cadastro");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate, db]);

  const handleCriarContaAtleta = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");

      // Garante que o usuário está realmente autenticado
      await user.getIdToken(true);
      
      const userData = {
        id: user.uid,
        nome: user.displayName || "Novo Atleta",
        email: user.email,
        tipo: "ATLETA", // DEVE SER MAIÚSCULO
        dataCriacao: new Date().toISOString()
      };

      console.log("Tentando criar conta com:", userData);
      
      // Operação de escrita com tratamento robusto
      await set(ref(db, `usuarios/${user.uid}`), userData);
      
      console.log("Conta criada com sucesso!");
      navigate("/");
    } catch (err) {
      console.error("Erro detalhado:", err, err.code, err.message);
      setError(
        err.code === "PERMISSION_DENIED"
          ? "Sem permissão para criar conta. Contate o administrador."
          : `Erro: ${err.message || "Falha ao criar conta"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e2a] p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Complete seu cadastro
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-2">
            Você está se cadastrando como <strong className="text-blue-600">Atleta</strong>
          </p>
        </div>

        <button
          onClick={handleCriarContaAtleta}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Criando conta..." : "Confirmar Cadastro"}
        </button>
      </div>
    </div>
  );
}