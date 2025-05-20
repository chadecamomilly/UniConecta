import Cabecalho from '../components/Header';
import Publicacao from '../components/Publicacao';

const publicacoesMock = [
  {
    id: 1,
    titulo: "Bem-vindo ao UniConecta!",
    conteudo: "Este é o seu espaço para ficar por dentro de tudo que rola na atlética.",
    autor: "Admin",
    data: "20/05/2025",
  },
  {
    id: 2,
    titulo: "Treinos da semana",
    conteudo: "Não perca os treinos de vôlei às segundas e quartas às 18h no ginásio.",
    autor: "Coordenador de Esportes",
    data: "19/05/2025",
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-uniblue text-white flex flex-col">
      <Cabecalho />

      <main className="flex-grow p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Publicações</h1>

        {publicacoesMock.length === 0 ? (
          <section className="bg-uniblue-light p-4 rounded-md shadow-md min-h-[300px] flex items-center justify-center text-gray-300">
            <p>Ainda não há publicações para mostrar.</p>
          </section>
        ) : (
          publicacoesMock.map(pub => (
            <Publicacao
              key={pub.id}
              titulo={pub.titulo}
              conteudo={pub.conteudo}
              autor={pub.autor}
              data={pub.data}
            />
          ))
        )}
      </main>
    </div>
  );
}
