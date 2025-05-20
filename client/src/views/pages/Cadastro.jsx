import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UsuarioController from "../../controllers/usuarioController";
import { useAuth } from "../../contexts/AuthContext";
import { cadastrarComEmailSenha, loginComGoogle } from "../../controllers/authController";
import Aluno from "../../models/Aluno";
import logo from '../../assets/logoUniConecta.png';

export default function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useAuth();
    const usuarioController = new UsuarioController();

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

    const handleCadastro = async (e) => {
        e.preventDefault();

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem");
            return;
        }

        try {
            setLoading(true);
            setErro("");
            setMensagemSucesso("");

            // 1. Cadastrar o usuário no Firebase Auth
            const userCredential = await cadastrarComEmailSenha(
                email,
                senha,
                nome,
            );

            const user = userCredential.user;

            // 2. Criar registro do aluno no Realtime Database
            const aluno = new Aluno(user.uid, nome, email, []);

            // Usando o controller para Realtime Database
            await usuarioController.criarUsuario(
                user.uid,  // ID como parâmetro separado
                {
                    nome,
                    email,
                    perfil: "aluno",
                    ...aluno.toObject()
                }
            );

            // 3. Atualizar estado do contexto de autenticação
            setUser({
                uid: user.uid,
                email: user.email,
                nome,
                perfil: "aluno"
            });

            setMensagemSucesso("Cadastro realizado com sucesso!");

            // Limpar formulário
            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");

            // Redirecionar após 2 segundos
            setTimeout(() => navigate("/confirmar-email"), 2000);

        } catch (error) {
            console.error("Erro no cadastro:", error);
            setErro(error.message.includes("permission-denied")
                ? "Sem permissão para criar conta"
                : error.message.includes("email-already-in-use")
                    ? "Este e-mail já está em uso"
                    : "Erro ao cadastrar. Tente novamente."
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
                onSubmit={handleCadastro}
                className="w-full max-w-md bg-uniblue-light rounded-xl shadow-lg p-8"
            >
                <h2 className="text-2xl font-bold text-center text-white mb-6">
                    Criar nova conta
                </h2>

                {erro && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {erro}
                    </p>
                )}
                {mensagemSucesso && (
                    <p className="text-green-600 text-sm mb-4 text-center">
                        {mensagemSucesso}
                    </p>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-white font-medium mb-1">
                            Nome completo *
                        </label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-uniblue focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                            placeholder="Digite seu nome"
                        />
                    </div>

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
                            Senha (mínimo 6 caracteres) *
                        </label>
                        <input
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            minLength={6}
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-uniblue focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                            placeholder="Digite sua senha"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmarSenha" className="block text-white font-medium mb-1">
                            Confirmar Senha *
                        </label>
                        <input
                            type="password"
                            id="confirmarSenha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                            minLength={6}
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-uniblue focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white"
                            placeholder="Confirme sua senha"
                        />
                    </div>
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
                    ) : "Criar conta"}
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
                    Cadastre-se com Google
                </button>

                <p className="mt-6 text-center text-sm text-white">
                    Já tem uma conta?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-white hover:text-white underline hover:no-underline"
                    >
                        Faça login
                    </Link>
                </p>
            </form>
        </div>
    );
}