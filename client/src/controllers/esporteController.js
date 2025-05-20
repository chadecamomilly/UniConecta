import Esporte from "../models/Esporte";
import DaoEsportes from "../models/dao/DaoEsportes.js";
import ModelError from "../models/ModelError.js";

export default class EsportesController {
  constructor() {
    this.dao = new DaoEsportes();
  }

  // Lista todos os esportes ativos (true) do nó /esportes
  async listarEsportesAtivos() {
    try {
      const esportes = await this.dao.obterEsportes();
      return esportes.getEsportesAtivos(); // retorna array de nomes
    } catch (err) {
      throw new ModelError(`Erro ao listar esportes: ${err.message}`);
    }
  }

  // Inscreve o usuário (uid) no esporte passado (nomeEsporte)
  async participarEsporte(nomeEsporte, uid) {
    if (!uid) throw new ModelError("UID do usuário é obrigatório.");

    // Validar esporte
    if (!DaoEsportes.esportesValidos.includes(nomeEsporte)) {
      throw new ModelError(`Esporte inválido: ${nomeEsporte}`);
    }

    const db = await this.dao.obterConexao();
    const { ref, get, update } = await import("firebase/database");

    // Pega os esportes atuais do aluno
    const esportesRef = ref(db, `alunos/${uid}/esportes`);
    const snapshot = await get(esportesRef);

    let esportesAtuais = [];
    if (snapshot.exists()) {
      esportesAtuais = snapshot.val();
      if (!Array.isArray(esportesAtuais)) {
        esportesAtuais = Object.values(esportesAtuais); // caso seja objeto
      }
    }

    // Se já está inscrito, não faz nada
    if (esportesAtuais.includes(nomeEsporte)) return;

    // Adiciona o esporte à lista
    esportesAtuais.push(nomeEsporte);

    // Atualiza no banco
    await update(ref(db, `alunos/${uid}`), { esportes: esportesAtuais });
  }

  // Lista os esportes do usuário (uid)
  async listarEsportesDoUsuario(uid) {
    if (!uid) throw new ModelError("UID do usuário é obrigatório.");

    const db = await this.dao.obterConexao();
    const { ref, get } = await import("firebase/database");

    const esportesRef = ref(db, `alunos/${uid}/esportes`);
    const snapshot = await get(esportesRef);

    if (!snapshot.exists()) {
      return [];
    }

    let esportes = snapshot.val();
    if (!Array.isArray(esportes)) {
      esportes = Object.values(esportes);
    }

    return esportes;
  }
}

// Adiciona esta propriedade para validação no controller
DaoEsportes.esportesValidos = [
  "basquete",
  "cheerleading",
  "futsal",
  "handebol",
  "natacao",
  "volei",
  "geral",
];
