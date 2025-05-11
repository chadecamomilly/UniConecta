import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { criarContaAtleta, verificarCadastroUsuario } from "../../controllers/escolherTipoController";

export default function EscolherTipo() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const jaTemCadastro = await verificarCadastroUsuario(user.uid);
        if (jaTemCadastro) {
          navigate("/");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro ao verificar registro:", err);
        setError("Erro ao verificar seu cadastro");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleCriarContaAtleta = async () => {
    setLoading(true);
    setError(null);

    try {
      await criarContaAtleta();
      navigate("/");
    } catch (err) {
      console.error("Erro detalhado:", err);
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
            Você está se cadastrando como{" "}
            <strong className="text-blue-600">Atleta</strong>
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