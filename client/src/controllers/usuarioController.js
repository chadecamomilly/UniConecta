import Usuario from "../models/Usuario";
import DaoUsuario from "../models/dao/DaoUsuario";
import ModelError from "../models/ModelError";

export default class UsuarioController {
  constructor() {
    this.dao = new DaoUsuario();
  }

  async criarUsuario(dadosUsuario) {
    try {
      // Valida se todos os campos estão presentes
      if (
        !dadosUsuario.id ||
        !dadosUsuario.nome ||
        !dadosUsuario.email ||
        !dadosUsuario.perfil
      ) {
        return this._retornarErro(
          "Todos os campos (id, nome, email, perfil) são obrigatórios."
        );
      }

      // Cria instância do Model (ele faz validações internas)
      const usuario = new Usuario(
        dadosUsuario.id,
        dadosUsuario.nome,
        dadosUsuario.email,
        dadosUsuario.perfil
      );

      // Verifica se já existe usuário com o mesmo ID
      try {
        const existente = await this.dao.obterUsuarioPorUid(usuario.getId());
        if (existente) {
          return this._retornarErro(
            `Usuário com ID ${usuario.getId()} já existe.`
          );
        }
      } catch (err) {
        if (
          !(err instanceof ModelError && err.message.includes("não encontrado"))
        ) {
          // Erro inesperado no banco
          console.error("Erro ao consultar usuário existente:", err);
          return this._retornarErro(
            "Erro interno ao verificar usuário existente."
          );
        }
        // Usuário não existe, tudo certo para criar
      }

      // Insere no banco
      await this.dao.inserir(usuario);

      // Retorna sucesso
      return this._retornarSucesso(
        "Usuário criado com sucesso.",
        usuario.toObject()
      );
    } catch (error) {
      // Se for ModelError, retorna mensagem amigável
      if (error instanceof ModelError) {
        return this._retornarErro(error.message);
      }
      // Se for outro erro, loga e retorna mensagem genérica
      console.error("Erro inesperado em criarUsuario:", error);
      return this._retornarErro("Erro inesperado ao criar usuário.");
    }
  }

  async alterarUsuario(dadosUsuario) {
    try {
      if (!dadosUsuario.id) {
        return this._retornarErro(
          "ID do usuário é obrigatório para alteração."
        );
      }

      const usuario = new Usuario(
        dadosUsuario.id,
        dadosUsuario.nome,
        dadosUsuario.email,
        dadosUsuario.perfil
      );

      // Verifica se usuário existe
      try {
        await this.dao.obterUsuarioPorUid(usuario.getId());
      } catch (err) {
        if (
          err instanceof ModelError &&
          err.message.includes("não encontrado")
        ) {
          return this._retornarErro(
            `Usuário com ID ${usuario.getId()} não encontrado.`
          );
        }
        console.error("Erro ao verificar usuário para alteração:", err);
        return this._retornarErro("Erro interno ao alterar usuário.");
      }

      await this.dao.alterar(usuario);
      return this._retornarSucesso(
        "Usuário alterado com sucesso.",
        usuario.toObject()
      );
    } catch (error) {
      if (error instanceof ModelError) {
        return this._retornarErro(error.message);
      }
      console.error("Erro inesperado em alterarUsuario:", error);
      return this._retornarErro("Erro inesperado ao alterar usuário.");
    }
  }

  async removerUsuario(id) {
    try {
      if (!id)
        return this._retornarErro("ID do usuário é obrigatório para remoção.");

      // Verifica se usuário existe antes de remover
      try {
        await this.dao.obterUsuarioPorUid(id);
      } catch (err) {
        if (
          err instanceof ModelError &&
          err.message.includes("não encontrado")
        ) {
          return this._retornarErro(`Usuário com ID ${id} não encontrado.`);
        }
        console.error("Erro ao verificar usuário para remoção:", err);
        return this._retornarErro("Erro interno ao remover usuário.");
      }

      await this.dao.remover(id);
      return this._retornarSucesso("Usuário removido com sucesso.");
    } catch (error) {
      console.error("Erro inesperado em removerUsuario:", error);
      return this._retornarErro("Erro inesperado ao remover usuário.");
    }
  }

  async listarUsuarios() {
    try {
      const lista = await this.dao.obterUsuarios();
      return this._retornarSucesso(
        "Lista de usuários obtida com sucesso.",
        lista.map((u) => u.toObject())
      );
    } catch (error) {
      console.error("Erro inesperado em listarUsuarios:", error);
      return this._retornarErro("Erro ao listar usuários.");
    }
  }

  async buscarUsuarioPorId(id) {
    try {
      if (!id)
        return this._retornarErro("ID do usuário é obrigatório para busca.");

      const usuario = await this.dao.obterUsuarioPorUid(id);
      return this._retornarSucesso("Usuário encontrado.", usuario.toObject());
    } catch (error) {
      if (error instanceof ModelError) {
        return this._retornarErro(error.message);
      }
      console.error("Erro inesperado em buscarUsuarioPorId:", error);
      return this._retornarErro("Erro inesperado ao buscar usuário.");
    }
  }

  // Métodos auxiliares para padronizar retorno
  _retornarSucesso(mensagem, dados = null) {
    return { sucesso: true, mensagem, dados };
  }

  _retornarErro(mensagem) {
    return { sucesso: false, mensagem };
  }
}
