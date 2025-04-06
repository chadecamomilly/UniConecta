import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import app from "../services/firebase";
import Box from "../components/Box";
import Botao from "../components/Botao";
import PgCentralizada from "../components/PgCentralizada";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = getAuth(app);
    const db = getDatabase(app);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const userRef = ref(db, "usuarios/" + uid);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const usuario = snapshot.val();
                alert(`Bem-vindo(a), ${usuario.nome || "usuário"}!`);
                navigate("/home");
            } else {
                alert("Usuário não encontrado no banco de dados.");
            }
        } catch (error) {
            alert("Erro ao logar: " + error.message);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            alert(`Login com Google feito! Bem-vindo, ${user.displayName}`);
            // Redirecionar se quiser
            navigate("/timeline");
        } catch (error) {
            alert("Erro no login com Google: " + error.message);
        }
    };

    return (
        <PgCentralizada>
            <Box>
                <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-white">Login</h2>
                <form onSubmit={handleLogin}>
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

                    <Botao type="submit">Entrar</Botao>
                </form>

                <button
                    onClick={handleGoogleLogin}
                    className="mt-4 w-full flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 shadow-sm hover:bg-gray-100"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="w-5 h-5 mr-2"
                    />
                    Entrar com Google
                </button>
            </Box>
        </PgCentralizada>
    );
}
