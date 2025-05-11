import { db } from "../services/firebase";
import { ref, get, push, orderByChild, query } from "firebase/database";

export async function buscarPublicacoes() {
  const publicacoesRef = ref(db, "publicacoes");
  const queryRef = query(publicacoesRef, orderByChild("dataCriacao"));

  try {
    const snapshot = await get(queryRef);
    if (snapshot.exists()) {
      const data = snapshot.val();

      const publicacoesArray = Object.keys(data).map((id) => ({
        id,
        ...data[id],
        autorNome: data[id].autor?.nome || "Anônimo",
      })).sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));

      return publicacoesArray;
    } else {
      return [];
    }
  } catch (erro) {
    console.error("Erro ao buscar publicações:", erro);
    throw erro;
  }
}

export async function buscarEsportes() {
  const esportesRef = ref(db, "esportes");
  try {
    const snapshot = await get(esportesRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).map(id => ({
        id,
        nome: snapshot.val()[id].nome
      }));
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar esportes:", error);
    throw error;
  }
}

export async function criarPublicacao(publicacaoData) {
  const publicacoesRef = ref(db, "publicacoes");
  try {
    await push(publicacoesRef, publicacaoData);
    return true;
  } catch (error) {
    console.error("Erro ao criar publicação:", error);
    throw error;
  }
}