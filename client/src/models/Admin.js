import Usuario from "./Usuario.js";
import ModelError from "./ModelError.js";

class Admin extends Usuario {
  constructor(id, nome, email, foto = null) {
    super(id, nome, email, "admin", foto);
  }

  criarComunicacao(titulo, conteudo, esporteId) {
    if (!titulo || !conteudo || !esporteId) {
      throw new ModelError("Dados inválidos para criar comunicação.");
    }

    if (typeof titulo !== "string" || typeof conteudo !== "string") {
      throw new ModelError("Título e conteúdo devem ser strings.");
    }

    return {
      titulo,
      conteudo,
      esporteId,
      criadoPor: this.nome,
      dataCriacao: new Date().toISOString(),
    };
  }

  editarComunicado(comunicado, novosDados) {
    if (!comunicado || !novosDados) {
      throw new ModelError("Dados inválidos para edição.");
    }

    return {
      ...comunicado,
      ...novosDados,
      editadoPor: this.nome,
      dataEdicao: new Date().toISOString(),
    };
  }

  excluirComunicado(comunicados, idComunicado) {
    const index = comunicados.findIndex((c) => c.id === idComunicado);
    if (index === -1) {
      throw new ModelError("Comunicado não encontrado.");
    }
    comunicados.splice(index, 1);
  }

  adicionarEsporte(listaEsportes, novoEsporte) {
    if (!novoEsporte || !novoEsporte.nome) {
      throw new ModelError("Esporte inválido.");
    }

    const jaExiste = listaEsportes.some(
      (esporte) => esporte.nome.toLowerCase() === novoEsporte.nome.toLowerCase()
    );

    if (jaExiste) {
      throw new ModelError("Esporte já existe na lista.");
    }

    listaEsportes.push(novoEsporte);
  }

  removerEsporte(listaEsportes, nomeEsporte) {
    const index = listaEsportes.findIndex(
      (esporte) => esporte.nome.toLowerCase() === nomeEsporte.toLowerCase()
    );

    if (index === -1) {
      throw new ModelError("Esporte não encontrado.");
    }

    listaEsportes.splice(index, 1);
  }

  adicionarEvento(calendario, evento) {
    if (!evento || !evento.titulo || !evento.data) {
      throw new ModelError("Evento inválido.");
    }

    calendario.push({
      ...evento,
      criadoPor: this.nome,
      dataCriacao: new Date().toISOString(),
    });
  }

  removerEvento(calendario, idEvento) {
    const index = calendario.findIndex((e) => e.id === idEvento);
    if (index === -1) {
      throw new ModelError("Evento não encontrado.");
    }
    calendario.splice(index, 1);
  }

  promoverUsuario(usuarios, idUsuario, novoTipo) {
    const permitido = ["responsavel", "admin"];
    if (!permitido.includes(novoTipo)) {
      throw new ModelError("Tipo de promoção inválido.");
    }

    const usuario = usuarios.find((u) => u.id === idUsuario);
    if (!usuario) {
      throw new ModelError("Usuário não encontrado.");
    }

    usuario.tipo = novoTipo;
    return usuario;
  }

  toFirestore() {
    return {
      ...super.toFirestore(),
      funcoes: [
        "criar_comunicacao",
        "editar_comunicado",
        "excluir_comunicado",
        "gerenciar_esportes",
        "gerenciar_calendario",
        "promover_usuario",
      ],
    };
  }
}

export default Admin;