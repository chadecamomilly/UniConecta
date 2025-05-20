import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enviarEmailRedefinicaoSenha } from "../../controllers/authController";
import logo from '../../assets/logoUniConecta.png';

export default function RecuperarSenha() {
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            setErro("");
            setMensagem("");
            
            await enviarEmailRedefinicaoSenha(email);
            setMensagem(`E-mail de redefinição enviado para ${email}. Verifique sua caixa de entrada.`);
            
        } catch (error) {
            console.error("Erro ao enviar e-mail de redefinição:", error);
            setErro(
                error.message.includes("user-not-found") 
                    ? "Nenhum usuário encontrado com este e-mail."
                    : "Erro ao enviar e-mail de redefinição. Tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-uniblue flex flex-col items-center justify-center p-4">
            <img
                src={logo}
                alt="Logo UniConecta"
                className="w-48 mb-8"
            />

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-uniblue-light rounded-xl shadow-lg p-8"
            >
                <h2 className="text-2xl font-bold text-center text-white mb-6">
                    Redefinir senha
                </h2>

                {erro && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {erro}
                    </p>
                )}
                
                {mensagem && (
                    <p className="text-green-500 text-sm mb-4 text-center">
                        {mensagem}
                    </p>
                )}

                <div className="mb-4">
                    <label htmlFor="email" className="block text-white font-medium mb-1">
                        Digite seu e-mail cadastrado *
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-uniblue focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                        placeholder="nome@exemplo.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-uniblue hover:bg-uniblue-dark text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-uniblue-light disabled:opacity-50"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enviando...
                        </span>
                    ) : "Enviar e-mail de redefinição"}
                </button>

                <p className="mt-6 text-center text-sm text-white">
                    Lembrou sua senha?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="font-medium text-white hover:text-white underline hover:no-underline cursor-pointer"
                    >
                        Voltar para login
                    </button>
                </p>
            </form>
        </div>
    );
}