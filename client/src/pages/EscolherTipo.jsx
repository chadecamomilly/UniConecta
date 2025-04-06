import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
import app from "../services/firebase";

export default function EscolherTipo() {
  const [tipo, setTipo] = useState("atleta");
  const navigate = useNavigate();
  const db = getDatabase(app);

  const location = useLocation();
  const user = location.state?.user;

  const handleSalvarTipo = async () => {
    if (!user) return alert("Usuário não encontrado!");

    const userRef = ref(db, "usuarios/" + user.uid);
    await set(userRef, {
      id: user.uid,
      nome: user.displayName,
      email: user.email,
      tipo: tipo,
    });

    alert("Tipo de usuário salvo com sucesso!");
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Escolha seu tipo de usuário</h2>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="atleta">Atleta</option>
          <option value="responsavel">Responsável de esporte</option>
        </select>

        <button
          onClick={handleSalvarTipo}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
