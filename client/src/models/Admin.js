import Usuario from "./Usuario.js";
import ModelError from "./ModelError.js";

class Admin extends Usuario {
  constructor(id, nome, email) {
    super(id, nome, email, "admin");
  }
  
    /**
   * Cria uma nova comunicação (postagem) no sistema.
   * @param {string} titulo - Título da comunicação.
   * @param {string} conteudo - Corpo do texto.
   * @param {Object} esporte - Esporte relacionado ({ nome: string }).
   * @returns {Object} Comunicação criada.
   * @throws {ModelError} Se dados forem inválidos.
   */

  
   criarComunicacao(titulo, conteudo, esporte) {
    if (!titulo || !conteudo || !esporte) {
      throw new ModelError("Dados inválidos para criar comunicação.");
    }
    if (typeof titulo !== "string" || typeof conteudo !== "string") { 
    throw new ModelError("Título e conteúdo devem ser strings.");
  }
    return {
      titulo,
      conteudo,
      esporte,
      criadoPor: this.nome,
      dataCriacao: new Date()
    };
  }
  
  adicionarEsporte(listaEsportes, novoEsporte) {
    if (!novoEsporte || !novoEsporte.nome) {
      throw new ModelError("Esporte inválido.");
    }
    listaEsportes.push(novoEsporte);
  }

  removerEsporte(listaEsportes, nomeEsporte) {
    const index = listaEsportes.findIndex(esporte => esporte.nome === nomeEsporte);
    if (index === -1) {
      throw new ModelError("Esporte não encontrado.");
    }
    listaEsportes.splice(index, 1);
  }
  
  toFirestore() {
  return {
    ...super.toFirestore(), 
    funcoes: ["criar_comunicacao", "gerenciar_esportes"] 
  };
}
}