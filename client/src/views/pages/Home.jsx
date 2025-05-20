import { useState, useEffect } from 'react';
import Cabecalho from '../components/Header';
import Publicacao from '../components/Publicacao';
import PublicacaoController from '../../controllers/publicacaoController';
import { useAuth } from '../../contexts/AuthContext';

export default function Home() {
    const [publicacoes, setPublicacoes] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [publicacaoEditando, setPublicacaoEditando] = useState(null);
    const controller = new PublicacaoController();
    const { user } = useAuth();
    const perfil = user?.perfil;

    useEffect(() => {
        async function listarTodasPublicacoes() {
            try {
                const lista = await controller.listarTodasPublicacoes();
                setPublicacoes(lista);
            } catch (error) {
                console.error("Erro ao carregar publicações:", error);
            }
        }

        listarTodasPublicacoes();
    }, []);

    // Criar nova publicação
    async function handleSalvar(novaPublicacao) {
        try {
            await controller.criarPublicacao(novaPublicacao);
            const listaAtualizada = await controller.listarTodasPublicacoes();
            setPublicacoes(listaAtualizada);
            setMostrarForm(false);
        } catch (error) {
            console.error("Erro ao salvar publicação:", error);
        }
    }

    // Abrir modo editar para uma publicação
    function abrirEditar(pubUid) {
        setPublicacaoEditando(pubUid);
    }

    // Salvar a edição da publicação
    async function handleSalvarEdicao(publicacaoEditada) {
        try {
            const { uid, ...dados } = publicacaoEditada; // ← separe o uid do restante
            await controller.editarPublicacao(uid, dados); // ← envie corretamente
            const listaAtualizada = await controller.listarTodasPublicacoes();
            setPublicacoes(listaAtualizada);
            setPublicacaoEditando(null);
        } catch (error) {
            console.error("Erro ao salvar edição:", error);
        }
    }

    // Cancelar edição
    function cancelarEdicao() {
        setPublicacaoEditando(null);
    }

    async function handleExcluir(uid) {
        try {
            await controller.excluirPublicacao(uid); // Método do controller para excluir
            const listaAtualizada = await controller.listarTodasPublicacoes();
            setPublicacoes(listaAtualizada);
            setPublicacaoEditando(null); // Fecha o modo edição, se estiver aberto
        } catch (error) {
            console.error("Erro ao excluir publicação:", error);
        }
    }


    return (
        <div className="min-h-screen bg-uniblue text-white flex flex-col">
            <Cabecalho />

            <main className="flex-grow p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Publicações</h1>
                    {perfil === "responsavel" && (
                        <button
                            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
                            onClick={() => setMostrarForm(true)}
                        >
                            + Nova publicação
                        </button>
                    )}
                </div>

                {publicacoes.length === 0 ? (
                    <section className="bg-uniblue-light p-4 rounded-md shadow-md min-h-[300px] flex items-center justify-center text-gray-300">
                        <p>Ainda não há publicações para mostrar.</p>
                    </section>
                ) : (
                    publicacoes.map((pub) => {
                        const uid = pub.getUid();

                        // Se essa publicação está em edição, renderiza o formulário modo editar
                        if (publicacaoEditando === uid) {
                            return (
                                <Publicacao
                                    key={uid}
                                    uid={uid}
                                    titulo={pub.getTitulo()}
                                    conteudo={pub.getConteudo()}
                                    autor={pub.getAutor()}
                                    
                                    esportes={pub.getEsportes()}
                                    modo="editar"
                                    onSalvar={handleSalvarEdicao}
                                    onCancelar={cancelarEdicao}
                                    onExcluir={handleExcluir}
                                />
                            );
                        }

                        // Caso contrário, renderiza no modo visualizar com botão de editar
                        return (
                            <div key={uid} className="relative">
                                <Publicacao
                                    uid={uid}
                                    titulo={pub.getTitulo()}
                                    conteudo={pub.getConteudo()}
                                    autor={pub.getAutor()}
                                    data={pub.getDataCriacao()}
                                    esportes={pub.getEsportes()}
                                    modo="visualizar"
                                />
                                {perfil === "responsavel" && (
                                    <button
                                        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded text-sm"
                                        onClick={() => abrirEditar(uid)}
                                    >
                                        Editar
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </main>

            {/* Formulário de criação */}
            {mostrarForm && (
                <Publicacao
                    modo="criar"
                    onSalvar={handleSalvar}
                    onCancelar={() => setMostrarForm(false)}
                />
            )}
        </div>
    );
}
