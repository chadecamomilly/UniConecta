import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { sendEmailVerification } from "../../controllers/authController";

export default function VerificarEmail() {
  const { user } = useAuth();  // pega o usuário logado
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);


  return (
    <div className="min-h-screen bg-uniblue flex flex-col items-center justify-center p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Confirme seu endereço de email</h2>
      <p className="mb-6 text-center max-w-md">
        Enviamos um email de verificação para <strong>{user?.email}</strong>. 
        Por favor, verifique sua caixa de entrada (e a pasta de spam).
      </p>
    </div>
  );
}
