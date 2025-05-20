import {
  getDatabase,
  ref,
  get,
  set,
  update,
  remove,
} from "firebase-database.js";
import Aluno from "../Aluno";
import ModelError from "../ModelError";

export default class DaoAluno {
  async obterConexao() {
    if (DaoAluno.promessaConexao == null) {
      DaoAluno.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível conectar ao banco de dados.")
          );
      });
    }
    return DaoAluno.promessaConexao;
  }

  async obterAlunoPorUid(uid) {
    if (!uid) throw new ModelError("UID inválido");

    const db = await this.obterConexao();
    const dbRef = ref(db, "alunos/" + uid);
    const resultado = await get(dbRef);

    if (!resultado.exists()) {
      throw new ModelError(`Aluno com UID ${uid} não encontrado.`);
    }

    const dados = resultado.val();
    return new Aluno(uid, dados.nome, "", dados.esportes || [], dados.foto);
  }

  async obterAlunos() {
    const db = await this.obterConexao();
    const dbRef = ref(db, "alunos/");
    const resultado = await get(dbRef);

    const lista = [];
    if (resultado.exists()) {
      const dados = resultado.val();
      for (let uid in dados) {
        const a = dados[uid];
        lista.push(new Aluno(uid, a.foto, a.nome, a.esportes || []));
      }
    }
    return lista;
  }

  async inserir(aluno) {
    if (!(aluno instanceof Aluno)) {
      throw new ModelError("Objeto inválido, esperado um Aluno.");
    }

    const db = await this.obterConexao();
    const dbRef = ref(db, "alunos/" + aluno.uid);

    await set(dbRef, {
      foto: aluno.foto || "",
      nome: aluno.nome,
      esportes: aluno.esportes || [],
    });
  }

  async alterar(aluno) {
    if (!(aluno instanceof Aluno)) {
      throw new ModelError("Objeto inválido, esperado um Aluno.");
    }

    const db = await this.obterConexao();
    const dbRef = ref(db, "alunos/" + aluno.uid);

    await update(dbRef, {
      foto: aluno.foto || "",
      nome: aluno.nome,
      esportes: aluno.esportes || [],
    });
  }

  async remover(uid) {
    if (!uid) throw new ModelError("UID inválido");

    const db = await this.obterConexao();
    const dbRef = ref(db, "alunos/" + uid);
    await remove(dbRef);
  }
}
