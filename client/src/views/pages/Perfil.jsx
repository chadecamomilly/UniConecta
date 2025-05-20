import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import FotoPerfil from "../components/FotoPerfil";
import Cabecalho from "../components/Header";
import { useEffect } from "react";

export default function Perfil() {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch {
            alert("Erro ao sair. Tente novamente.");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col bg-uniblue text-white">
                <Cabecalho />
                <div className="flex-grow flex items-center justify-center">
                    <p>Carregando usuário...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-uniblue text-white flex flex-col">
            <Cabecalho />

            <main className="flex-grow flex flex-col items-center p-6">
                <h1 className="text-3xl font-bold mb-6">Perfil</h1>

                <FotoPerfil
                    photoURL={user.foto}
                    displayName={user.displayName || user.email}
                    size={120}
                />

                <p className="mt-4 text-xl font-semibold">{user.nome || "Usuário"}</p>
                <p className="text-gray-300">{user.email}</p>

                <button
                    onClick={handleLogout}
                    className="mt-8 bg-red-600 hover:bg-red-700 transition px-6 py-2 rounded-lg font-semibold"
                >
                    Sair
                </button>
            </main>
        </div>
    );
}
