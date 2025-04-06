import { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../services/firebase";
import Box from "../components/Box";
import Header from "../components/Header";

export default function Perfil() {
    const auth = getAuth(app);
    const db = getDatabase(app);
    const [usuario, setUsuario] = useState(null);
    const [novaFoto, setNovaFoto] = useState("");

    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (userId) {
            const userRef = ref(db, "usuarios/" + userId);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    setUsuario(snapshot.val());
                }
            });
        }
    }, [auth]);

    const handleAtualizarFoto = async () => {
        if (!novaFoto) return;
        const userId = auth.currentUser?.uid;
        const userRef = ref(db, "usuarios/" + userId);
        await update(userRef, { foto: novaFoto });
        alert("Foto atualizada!");
        setUsuario((prev) => ({ ...prev, foto: novaFoto }));
        setNovaFoto("");
    };

    if (!usuario) return <div>Carregando perfil...</div>;

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0e2a] text-white">
            <Header />
            <div className="min-h-screen bg-blue-950 text-white flex flex-col items-center pt-10 px-4">
                <h1 className="text-2xl font-bold mb-6">Perfil</h1>
                <Box>
                    <div className="flex flex-col items-center space-y-4">
                        {usuario.foto ? (
                            <img src={usuario.foto} alt="Foto de perfil" className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                Sem foto
                            </div>
                        )}
                        <div className="text-center">
                            <p className="text-xl font-semibold">{usuario.nome}</p>
                            <p className="text-sm text-gray-600">{usuario.email}</p>
                            <p className="text-sm text-gray-400 capitalize">{usuario.tipo}</p>
                        </div>
                        <input
                            type="url"
                            className="border rounded p-2 w-full text-gray-500"
                            placeholder="Cole o link da nova foto"
                            value={novaFoto}
                            onChange={(e) => setNovaFoto(e.target.value)}
                        />
                        <button
                            onClick={handleAtualizarFoto}
                            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded"
                        >
                            Atualizar foto
                        </button>
                    </div>
                </Box>
            </div>
        </div>
    );
}
