import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, get, set, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../services/firebase";
import Header from "../components/Header";

export default function Esportes() {
    const [esportes, setEsportes] = useState([]);
    const [esportesDoUsuario, setEsportesDoUsuario] = useState([]);
    const db = getDatabase(app);
    const auth = getAuth(app);

    useEffect(() => {
        const esportesRef = ref(db, "esportes");
        onValue(esportesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const lista = Object.entries(data).map(([id, valor]) => ({
                    id,
                    ...valor,
                }));
                setEsportes(lista);
            }
        });
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
    
        if (user) {
            const usuarioRef = ref(db, `usuarios/${user.uid}`);
            onValue(usuarioRef, (snapshot) => {
                if (snapshot.exists()) {
                    const dados = snapshot.val();
                    const esportes = dados.esportes || [];
                    setEsportesDoUsuario(esportes);
                }
            });
        }
    }, [auth.currentUser]);

    async function participarDoEsporte(idEsporte) {
        const user = auth.currentUser;
        if (!user) {
            alert("Você precisa estar logado.");
            return;
        }
    
        const usuarioRef = ref(db, `usuarios/${user.uid}`);
    
        try {
            const snapshot = await get(usuarioRef);
            if (snapshot.exists()) {
                const dados = snapshot.val();
                const esportes = dados.esportes || [];
    
                if (!esportes.includes(idEsporte)) {
                    esportes.push(idEsporte);
                    await update(usuarioRef, { esportes });
                    alert("Inscrição realizada com sucesso!");
                } else {
                    alert("Você já está inscrito nesse esporte.");
                }
            }
        } catch (error) {
            console.error("Erro ao participar do esporte:", error);
            alert("Erro ao participar do esporte.");
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0e2a] text-white">
            <Header />
            <div className="min-h-screen bg-blue-950 text-white flex flex-col items-center pt-10 px-4">
                <h1 className="text-2xl font-bold mb-6">Esportes Disponíveis</h1>

                <ul className="space-y-4">
                    {esportes.map((esporte) => {
                        const jaParticipa = esportesDoUsuario.includes(esporte.id);

                        return (
                            <li
                                key={esporte.id}
                                className="bg-blue-900 p-4 rounded-lg shadow flex justify-between items-center"
                            >
                                <span className="text-lg">{esporte.nome}</span>
                                <button
                                    className={`${
                                        jaParticipa
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-white hover:bg-gray-100 text-blue-800"
                                    } px-4 py-2 rounded`}
                                    onClick={() => participarDoEsporte(esporte.id)}
                                >
                                    {jaParticipa ? "Inscrito" : "Participar"}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
