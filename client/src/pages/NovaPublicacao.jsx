import { useState, useEffect } from "react";
import { db, auth } from "../services/firebase";
import { push, ref, get } from "firebase/database"; // Importando funções para ler dados do Realtime Database
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Comunicacao from "../models/Comunicacao";
import Header from "../components/Header";

export default function NovaPublicacao() {
    const [titulo, setTitulo] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [esportesSelecionados, setEsportesSelecionados] = useState([]);
    const [userId, setUserId] = useState(null); // Armazenar o ID do usuário
    const [userName, setUserName] = useState(""); // Armazenar o nome do usuário
    const [esportes, setEsportes] = useState([]); // Estado para armazenar a lista de esportes

    const handleToggleEsporte = (esporteId) => {
        setEsportesSelecionados(prev => 
          prev.includes(esporteId)
            ? prev.filter(id => id !== esporteId)
            : [...prev, esporteId]
        );
      };


    useEffect(() => {
        const fetchEsportes = async () => {
            const esportesRef = ref(db, "esportes"); 
            const snapshot = await get(esportesRef);
            if (snapshot.exists()) {
                const esportes = snapshot.val();
                const esportesArray = Object.keys(esportes).map((id) => ({
                    id,
                    nome: esportes[id].nome,
                }));
                setEsportes(esportesArray);
            }
        };

        fetchEsportes();
    }, []);

    // Monitorando o estado do usuário autenticado
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid); // Definindo o ID do usuário
                setUserName(user.displayName || "Usuário"); 
            } else {
                // Usuário não autenticado
                setUserId(null);
                setUserName("");
            }
        });
    }, []);

    const handleSelectEsportes = (e) => {
        setEsportesSelecionados([...e.target.selectedOptions].map(o => o.value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert("Usuário não autenticado");
            return;
        }

        try {
            const autor = { id: userId, nome: userName }; // Agora temos o ID e nome do usuário
            const esportesSelecionadosList = esportes.filter(e => esportesSelecionados.includes(e.id));

            const novaPublicacao = new Comunicacao(
                null,
                titulo,
                conteudo,
                autor,
                esportesSelecionadosList
            );

            const dadosParaSalvar = novaPublicacao.toRealtimeDatabase(); // Método alterado para trabalhar com Realtime Database

            // Referência para a coleção 'publicacoes' no Realtime Database
            const publicacoesRef = ref(db, "publicacoes");

            // Adicionando uma nova publicação com uma chave única gerada automaticamente
            await push(publicacoesRef, dadosParaSalvar);

            // Limpa os campos do formulário após o envio
            setTitulo("");
            setConteudo("");
            setEsportesSelecionados([]);

            alert("Publicação criada com sucesso!");
        } catch (erro) {
            console.error(erro);
            alert("Erro ao criar publicação: " + erro.message);
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-[#0a0e2a] text-white">
            <Header />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Nova Publicação</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="titulo" className="block text-lg font-medium text-gray-700">Título</label>
                            <input
                                id="titulo"
                                type="text"
                                placeholder="Título da publicação"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="conteudo" className="block text-lg font-medium text-gray-700">Conteúdo</label>
                            <textarea
                                id="conteudo"
                                placeholder="Conteúdo da publicação"
                                value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                                rows={5}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Esportes</label>
                            <div className="grid grid-cols-2 gap-2">
                                {esportes.map((esporte) => (
                                    <label key={esporte.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={esportesSelecionados.includes(esporte.id)}
                                            onChange={() => handleToggleEsporte(esporte.id)}
                                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-gray-800">{esporte.nome}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 mt-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Publicar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
