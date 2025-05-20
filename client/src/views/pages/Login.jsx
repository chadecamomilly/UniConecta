import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginComEmailSenha, loginComGoogle } from "../../controllers/authController";
import { useAuth } from "../../contexts/AuthContext";
import logo from '../../assets/logoUniConecta.png';

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useAuth();
    

    const handleLoginGoogle = async () => {
        try {
            setLoading(true);
            setErro("");
            const { user, userData } = await loginComGoogle();
            setUser({ ...user, ...userData });
            navigate("/");
        } catch (error) {
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setErro("");

            const { user, userData } = await loginComEmailSenha(email, senha);
            setUser({ ...user, ...userData });
            
            // Redirecionar para a página inicial
            navigate("/");

        } catch (error) {
            console.error("Erro no login:", error);
            setErro(
                error.message.includes("wrong-password") 
                    ? "Senha incorreta" 
                : error.message.includes("user-not-found") 
                    ? "Usuário não encontrado" 
                    : "Erro ao fazer login. Tente novamente."
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
                onSubmit={handleLogin}
                className="w-full max-w-md bg-uniblue-light rounded-xl shadow-lg p-8"
            >
                <h2 className="text-2xl font-bold text-center text-white mb-6">
                    Faça login na sua conta
                </h2>

                {erro && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {erro}
                    </p>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-white font-medium mb-1">
                            Email *
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

                    <div>
                        <label htmlFor="senha" className="block text-white font-medium mb-1">
                            Senha *
                        </label>
                        <input
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-uniblue focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                            placeholder="Digite sua senha"
                        />
                    </div>
                </div>

                <div className="mt-2 text-right">
                    <Link
                        to="/recuperar-senha"
                        className="text-sm text-white hover:text-white underline hover:no-underline"
                    >
                        Esqueceu sua senha?
                    </Link>
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
                            Processando...
                        </span>
                    ) : "Entrar"}
                </button>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">ou</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    type="button"
                    onClick={handleLoginGoogle}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-uniblue-light disabled:opacity-50"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Entrar com Google
                </button>

                <p className="mt-6 text-center text-sm text-white">
                    Não tem uma conta?{" "}
                    <Link
                        to="/cadastro"
                        className="font-medium text-white hover:text-white underline hover:no-underline"
                    >
                        Cadastre-se
                    </Link>
                </p>
            </form>
        </div>
    );
}