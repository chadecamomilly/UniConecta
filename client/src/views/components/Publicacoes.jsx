import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { buscarPublicacoes } from '../../controllers/publicacaoController';

export default function Publicacoes() {
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await buscarPublicacoes();
        setPublicacoes(dados);
      } catch (erro) {
        console.error(erro);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, []);

  if (carregando) {
    return <div className="text-center text-white-800">Carregando publicações...</div>;
  }

  return (
    <div className="text-center text-white-800">
      <h1 className="text-2xl font-bold mb-4">Publicações</h1>

      {(user?.tipo === 'ADMIN' || user?.tipo === 'RESPONSAVEL') && (
        <Link
          to="/nova-publicacao"
          className="inline-block px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Criar Nova Publicação
        </Link>
      )}

      {publicacoes.length === 0 ? (
        <p className="mt-8">Não há publicações para exibir.</p>
      ) : (
        <div className="flex flex-col items-center p-4 space-y-4">
          {publicacoes.map((pub) => {
            const dataFormatada = new Date(pub.dataCriacao).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={pub.id}
                className="bg-white text-black rounded-2xl shadow-lg p-6 w-full max-w-md"
              >
                <h2 className="text-xl font-bold mb-2">{pub.titulo}</h2>
                <p className="mb-4">{pub.conteudo}</p>

                <div className="text-sm text-gray-600 mb-2">
                  <p><strong>Data:</strong> {dataFormatada}</p>
                  <p><strong>Autor:</strong> {pub.autorNome}</p>
                </div>

                {pub.esportes?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {pub.esportes.map((esporte, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        {esporte.nome || esporte}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}