import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import app from "../services/firebase";
import Box from "../components/Box";
import Botao from "../components/Botao";
import Usuario from "../models/Usuario";
import PgCentralizada from "../components/PgCentralizada";


export default function Cadastro() {
    const auth = getAuth(app);
    const db = getDatabase(app);
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tipo, setTipo] = useState("atleta"); //

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            navigate("/escolher-tipo");
    
        } catch (error) {
            alert("Erro ao fazer login com Google: " + error.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const novoUsuario = new Usuario(user.uid, nome, email, tipo);

            await set(ref(db, 'usuarios/' + user.uid), novoUsuario);

            alert("Usuário registrado com sucesso!");
            navigate("/");
        } catch (error) {
            alert("Erro ao registrar: " + error.message);
        }
    };

    return (
        <PgCentralizada>
            <Box>
                <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-white">Cadastro</h2>
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
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="tipo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Tipo de usuário
                        </label>
                        <select
                            id="tipo"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                        >
                            <option value="atleta">Atleta</option>
                            <option value="responsavel">Responsável de esporte</option>
                        </select>
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
                        />
                    </div>

                    <Botao type="submit">Cadastrar</Botao>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 shadow-sm hover:bg-gray-100 mt-4"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                        Entrar com Google
                    </button>
                </form>
            </Box>
        </PgCentralizada>
    );
}