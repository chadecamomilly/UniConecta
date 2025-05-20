export default function Publicacao({ titulo, conteudo, autor, data }) {
  return (
    <article className="bg-uniblue-light p-4 rounded-md shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">{titulo}</h2>
      <p className="mb-3 whitespace-pre-line">{conteudo}</p>
      <div className="text-sm text-gray-400 flex justify-between">
        <span>Por: {autor}</span>
        <span>{data}</span>
      </div>
    </article>
  );
}
