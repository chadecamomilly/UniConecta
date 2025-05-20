import React, { useEffect, useState } from "react";
import EsportesController from "../../controllers/esporteController";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import Cabecalho from "../components/Header";

export default function Configuracoes() {
    const [esportesAtivos, setEsportesAtivos] = useState([]);
    const [meusEsportes, setMeusEsportes] = useState([]);
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    const controller = new EsportesController();

    useEffect(() => {
        async function carregarDados() {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            const db = getDatabase();
            const perfilRef = ref(db, `usuarios/${user.uid}/perfil`);
            const perfilSnap = await get(perfilRef);
            const perfilValor = perfilSnap.val();

            setPerfil(perfilValor);

            // só carrega se for aluno ou responsavel
            if (perfilValor === "aluno" || perfilValor === "responsavel") {
                const [esportes, meus] = await Promise.all([
                    controller.listarEsportesAtivos(),
                    controller.listarEsportesDoUsuario(user.uid),
                ]);
                setEsportesAtivos(esportes);
                setMeusEsportes(meus);
            }

            setLoading(false);
        }

        carregarDados();
    }, []);

    async function handleParticipar(nomeEsporte) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        try {
            await controller.participarEsporte(nomeEsporte, user.uid);
            setMeusEsportes((prev) => [...prev, nomeEsporte]);
        } catch (err) {
            alert("Erro ao participar do esporte: " + err.message);
        }
    }

    if (loading) {
        return <div className="text-white text-center mt-10">Carregando...</div>;
    }

    if (perfil !== "aluno" && perfil !== "responsavel") {
        return <div className="text-white text-center mt-10">Apenas alunos ou responsáveis podem configurar esportes.</div>;
    }

    return (
        <div className="min-h-screen bg-uniblue text-white flex flex-col">
            <Cabecalho />

            <main className="flex-grow p-6 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-6 flex ">Esportes</h1>
                <ul className="space-y-4">
                    {esportesAtivos.map((esporte) => (
                        <li
                            key={esporte}
                            className="bg-uniblue-light p-4 rounded-2xl shadow-md flex justify-between items-center"
                        >
                            <span className="capitalize">{esporte}</span>
                            {meusEsportes.includes(esporte) ? (
                                <span className="text-green-400 font-semibold">Participando</span>
                            ) : (
                                <button
                                    onClick={() => handleParticipar(esporte)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition"
                                >
                                    Participar
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
