import { useState } from "react";
import { useNavigate } from "react-router-dom";
import app from "../../services/firebase";
import Box from "../components/Box";
import Botao from "../components/Botao";
import PgCentralizada from "../components/PgCentralizada";
import { registrarUsuarioComEmail, loginComGoogle } from "../../controllers/authController";

export default function Cadastro() {
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError("");
            await loginComGoogle();
            navigate("/escolher-tipo");
        } catch (error) {
            setError("Erro ao fazer login com Google: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            await registrarUsuarioComEmail(email, password);
            navigate("/escolher-tipo");
        } catch (error) {
            setError("Erro ao registrar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PgCentralizada>
            <Box>
                <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-white">Cadastro</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
                        {error}
                    </div>
                )}
                <form onSubmit={handleRegister}>
                    <div className="mb-5">
                        <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Seu nome
                        </label>
                        <input
                            type="text"
                            id="nome"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Digite seu nome"
                            required
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Seu email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="nome@exemplo.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Sua senha
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            minLength={6}
                        />
                    </div>

                    <Botao type="submit" disabled={loading}>
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </Botao>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 shadow-sm hover:bg-gray-100 mt-4 disabled:opacity-50"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                        {loading ? "Processando..." : "Entrar com Google"}
                    </button>
                </form>
            </Box>
        </PgCentralizada>
    );
}