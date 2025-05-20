import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  onValue,
  set,
  update,
  remove,
} from "firebase/database";
import Usuario from "../Usuario";
import ModelError from "../ModelError";

export default class DaoUsuario {
  async obterConexao() {
    if (DaoUsuario.promessaConexao == null) {
      DaoUsuario.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível conectar ao banco de dados.")
          );
      });
    }
    return DaoUsuario.promessaConexao;
  }

  async obterUsuarioPorUid(uid) {
    if (!uid) throw new ModelError("UID inválido");

    const db = await this.obterConexao();
    const dbRef = ref(db, "usuarios/" + uid);
    const resultado = await get(dbRef);

    if (!resultado.exists()) {
      throw new ModelError(`Usuário com UID ${uid} não encontrado.`);
    }

    const dados = resultado.val();
    return new Usuario(uid, dados.nome, dados.email, dados.perfil);
  }

  async obterUsuarios() {
    const db = await this.obterConexao();
    const dbRef = ref(db, "usuarios/");
    const resultado = await get(dbRef);

    const lista = [];
    if (resultado.exists()) {
      const dados = resultado.val();
      for (let uid in dados) {
        const u = dados[uid];
        lista.push(new Usuario(uid, u.nome, u.email, u.perfil));
      }
    }
    return lista;
  }

  async inserir(usuario) {
    if (!(usuario instanceof Usuario)) {
      throw new ModelError("Objeto inválido, esperado um Usuario.");
    }

    const db = await this.obterConexao();
    const dbRef = ref(db, "usuarios/" + usuario.uid);

    await set(dbRef, {
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.perfil,
    });
  }

  async alterar(usuario) {
    if (!(usuario instanceof Usuario)) {
      throw new ModelError("Objeto inválido, esperado um Usuario.");
    }

    const db = await this.obterConexao();
    const dbRef = ref(db, "usuarios/" + usuario.uid);

    await update(dbRef, {
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.perfil,
    });
  }

  async remover(uid) {
    if (!uid) throw new ModelError("UID inválido");

    const db = await this.obterConexao();
    const dbRef = ref(db, "usuarios/" + uid);
    await remove(dbRef);
  }
}
