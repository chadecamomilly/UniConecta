import { useState, useEffect } from "react";
import CampoInput from "./CampoInput";
import { formatarData } from "../../utils/formatarData";
import { useAuth } from "../../contexts/AuthContext";

const esportesValidos = [
  "basquete",
  "cheerleading",
  "futsal",
  "geral",
  "handebol",
  "natacao",
  "volei",
];

export default function Publicacao({
  uid,
  dataCriacao,
  titulo: tituloProp,
  conteudo: conteudoProp,
  autor: autorProp,
  data: dataProp,
  esportes: esportesProp,
  modo = "visualizar", // "visualizar" | "editar" | "criar"
  onSalvar,
  onExcluir,
  onCancelar,
}) {
  const [titulo, setTitulo] = useState(tituloProp || "");
  const [conteudo, setConteudo] = useState(conteudoProp || "");
  const [autor, setAutor] = useState(autorProp || "");
  const [esportes, setEsportes] = useState(esportesProp || []);
  const [error, setError] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const { user } = useAuth();
  const perfil = user?.perfil;
  const podeEditar = perfil === 'responsavel';

  // Sincroniza estado interno quando props mudam (ex: ao abrir para editar)
  useEffect(() => {
    setTitulo(tituloProp || "");
    setConteudo(conteudoProp || "");
    setAutor(autorProp || "");
    setEsportes(esportesProp || []);
    setError("");
    setMostrarConfirmacao(false);
  }, [tituloProp, conteudoProp, autorProp, esportesProp]);

  function toggleEsporte(esporte) {
    setEsportes((prev) =>
      prev.includes(esporte)
        ? prev.filter((e) => e !== esporte)
        : [...prev, esporte]
    );
  }

  function validar() {
    if (!titulo.trim()) {
      setError("Título é obrigatório.");
      return false;
    }
    if (!conteudo.trim()) {
      setError("Conteúdo é obrigatório.");
      return false;
    }
    if (!autor.trim()) {
      setError("Autor é obrigatório.");
      return false;
    }
    if (esportes.length === 0) {
      setError("Selecione pelo menos um esporte.");
      return false;
    }
    setError("");
    return true;
  }

  function handleSalvar() {
    if (!validar()) return;
    if (typeof onSalvar === "function") {
      onSalvar({
        uid,
        dataCriacao,
        autor: autor.trim(),
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        esportes,
      });
    }
  }

  // Modal de confirmação para exclusão
  function ConfirmacaoExcluir() {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmacao-excluir-titulo"
      >
        <div className="bg-white p-6 rounded shadow-md max-w-sm w-full text-black">
          <p
            id="confirmacao-excluir-titulo"
            className="mb-4 text-center text-lg font-semibold"
          >
            Tem certeza que deseja excluir esta publicação?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setMostrarConfirmacao(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onExcluir?.(uid);
                setMostrarConfirmacao(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modo visualizar
  if (modo === "visualizar" || perfil !== "responsavel") {
    return (
      <article className="bg-uniblue-light p-4 rounded-md shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">{tituloProp}</h2>
        <p className="mb-3 whitespace-pre-line">{conteudoProp}</p>

        <div className="text-sm text-gray-400 flex justify-between mb-2">
          <span>Por: {autorProp}</span>
          <span>{formatarData(dataProp)}</span>
        </div>

        <div className="mb-1 text-sm">
          <strong>Esportes:</strong>
        </div>
        <div className="flex flex-wrap gap-2">
          {esportesProp?.map((e) => (
            <span
              key={e}
              className="bg-blue-600 text-white rounded-full px-3 py-1 text-xs font-semibold select-none"
            >
              {e.charAt(0).toUpperCase() + e.slice(1)}
            </span>
          ))}
        </div>
      </article>
    );
  }

  // Modo criar/editar
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        // Não fecha modal ao clicar no fundo para evitar fechar acidentalmente.
        // onClick={onCancelar}  <-- removido para evitar fechamento acidental
      >
        <div
          className="bg-uniblue-light p-6 rounded-md shadow max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl mb-4">
            {modo === "editar" ? "Editar Publicação" : "Nova Publicação"}
          </h2>

          {error && (
            <div
              className="mb-4 p-2 bg-red-600 text-white rounded"
              aria-live="polite"
              role="alert"
            >
              {error}
            </div>
          )}

          <CampoInput
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            autoFocus
            aria-label="Título da publicação"
          />

          <label className="block mb-2">
            <span className="font-semibold">Conteúdo</span>
            <textarea
              className="w-full p-2 rounded mt-1 text-black"
              rows={5}
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
            />
          </label>

          <CampoInput
            label="Autor"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            disabled={modo !== "criar"}
            aria-label="Autor da publicação"
          />

          <fieldset className="mb-4">
            <legend className="font-semibold mb-1">Esportes</legend>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-auto">
              {esportesValidos.map((e) => (
                <label
                  key={e}
                  className="inline-flex items-center gap-1 bg-gray-200 rounded px-2 py-1 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={esportes.includes(e)}
                    onChange={() => toggleEsporte(e)}
                    aria-checked={esportes.includes(e)}
                  />
                  <span className="capitalize">{e}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-between items-center">
            {modo === "editar" && (
              <button
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                onClick={() => setMostrarConfirmacao(true)}
                type="button"
              >
                Excluir
              </button>
            )}

            <div className="ml-auto flex gap-2">
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={onCancelar}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                onClick={handleSalvar}
                type="button"
              >
                {modo === "editar" ? "Atualizar" : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mostrarConfirmacao && <ConfirmacaoExcluir />}
    </>
  );
}
