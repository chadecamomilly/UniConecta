import { useEffect, useState } from "react";
import { buscarUsuario, atualizarFotoUsuario, getCurrentUserId } from "../../controllers/userController";
import Box from "../components/Box";
import Header from "../components/Header";

export default function Perfil() {
    const [usuario, setUsuario] = useState(null);
    const [novaFoto, setNovaFoto] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const carregarPerfil = async () => {
            try {
                const userId = getCurrentUserId();
                if (userId) {
                    const dadosUsuario = await buscarUsuario(userId);
                    setUsuario(dadosUsuario);
                }
                setCarregando(false);
            } catch (error) {
                setErro("Erro ao carregar perfil");
                setCarregando(false);
                console.error(error);
            }
        };

        carregarPerfil();
    }, []);

    const handleAtualizarFoto = async () => {
        if (!novaFoto.trim()) return;
        
        try {
            const userId = getCurrentUserId();
            if (!userId) throw new Error("Usuário não autenticado");
            
            const fotoAtualizada = await atualizarFotoUsuario(userId, novaFoto);
            setUsuario(prev => ({ ...prev, foto: fotoAtualizada }));
            setNovaFoto("");
            alert("Foto atualizada com sucesso!");
        } catch (error) {
            setErro("Erro ao atualizar foto");
            console.error(error);
        }
    };

    if (carregando) return <div className="min-h-screen flex flex-col bg-[#0a0e2a] text-white"><Header /><div className="flex-1 flex items-center justify-center">Carregando perfil...</div></div>;
    if (erro) return <div className="min-h-screen flex flex-col bg-[#0a0e2a] text-white"><Header /><div className="flex-1 flex items-center justify-center text-red-500">{erro}</div></div>;
    if (!usuario) return <div className="min-h-screen flex flex-col bg-[#0a0e2a] text-white"><Header /><div className="flex-1 flex items-center justify-center">Usuário não encontrado</div></div>;

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0e2a] text-white">
            <Header />
            <div className="min-h-screen bg-blue-950 text-white flex flex-col items-center pt-10 px-4">
                <h1 className="text-2xl font-bold mb-6">Perfil</h1>
                <Box>
                    <div className="flex flex-col items-center space-y-4">
                        {usuario.foto ? (
                            <img 
                                src={usuario.foto} 
                                alt="Foto de perfil" 
                                className="w-24 h-24 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/150";
                                }}
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                Sem foto
                            </div>
                        )}
                        <div className="text-center">
                            <p className="text-xl font-semibold">{usuario.nome}</p>
                            <p className="text-sm text-gray-400">{usuario.email}</p>
                            <p className="text-sm text-gray-400 capitalize">{usuario.tipo}</p>
                        </div>
                        
                        <div className="w-full space-y-2">
                            <input
                                type="url"
                                className="border rounded p-2 w-full text-gray-800"
                                placeholder="Cole o link da nova foto"
                                value={novaFoto}
                                onChange={(e) => setNovaFoto(e.target.value)}
                            />
                            <button
                                onClick={handleAtualizarFoto}
                                disabled={!novaFoto.trim()}
                                className={`w-full py-2 rounded ${novaFoto.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-500 cursor-not-allowed'} text-white transition-colors`}
                            >
                                Atualizar foto
                            </button>
                        </div>
                    </div>
                </Box>
            </div>
        </div>
    );
}
