import { getDatabase, ref, get, set, update, remove } from "firebase/database";
import Esporte from "../Esporte";
import ModelError from "../ModelError";

export default class DaoEsportes {
  async obterConexao() {
    if (DaoEsportes.promessaConexao == null) {
      DaoEsportes.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível conectar ao banco de dados.")
          );
      });
    }
    return DaoEsportes.promessaConexao;
  }

  async obterEsportes() {
    const db = await this.obterConexao();
    const dbRef = ref(db, "esportes");
    const resultado = await get(dbRef);

    if (!resultado.exists()) {
      throw new ModelError("Não há dados de esportes no banco.");
    }

    const dados = resultado.val();
    return new Esporte(dados);
  }

  async inserir(esportes) {
    if (!(esportes instanceof Esporte)) {
      throw new ModelError(
        "Objeto inválido, esperado uma instância de Esportes."
      );
    }

    const db = await this.obterConexao();
    const dbRef = ref(db, "esportes");

    await set(dbRef, esportes.toObject());
  }

  async alterar(esportes) {
    if (!(esportes instanceof Esporte)) {
      throw new ModelError(
        "Objeto inválido, esperado uma instância de Esportes."
      );
    }

    const db = await this.obterConexao();
    const dbRef = ref(db, "esportes");

    await update(dbRef, esportes.toObject());
  }
}
