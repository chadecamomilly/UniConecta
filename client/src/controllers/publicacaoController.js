import DaoPublicacao from "../models/dao/DaoPublicacao.js";
import Publicacao from "../models/Publicacao.js";

export default class PublicacaoController {
  constructor() {
    this.dao = new DaoPublicacao();
  }

  async criarPublicacao({ autor, titulo, conteudo, esportes }) {
    const dataCriacao = new Date().toISOString();
    const novaPub = new Publicacao(null, dataCriacao, autor, titulo, conteudo, esportes);
    const uid = await this.dao.criar(novaPub);
    return uid;
  }

  async editarPublicacao(uid, dados) {
    const publicacaoExistente = await this.dao.buscarPorId(uid);
    if (!publicacaoExistente) throw new Error("Publicação não encontrada");

    const pubEditada = new Publicacao(
      uid,
      publicacaoExistente.dataCriacao,
      dados.autor,
      dados.titulo,
      dados.conteudo,
      dados.esportes
    );
    await this.dao.editar(uid, pubEditada);
  }

  async excluirPublicacao(uid) {
    await this.dao.excluir(uid);
  }

  async listarPublicacoesPorEsporte(esporteId) {
    return await this.dao.buscarPorEsporte(esporteId);
  }

  async listarTodasPublicacoes() {
    return await this.dao.buscarTodos();
  }
}
