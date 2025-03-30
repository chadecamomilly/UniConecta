import ModelError from "/model/ModelError.js";

export default class Comunicacao {
  constructor(id, titulo, conteudo, autor, esportes) {
    this.setId(id);
    this.setTitulo(titulo);
    this.setConteudo(conteudo);
    this.setAutor(autor);
    this.setEsportes(esportes);
    this.dataCriacao = new Date();
  }
  
  //-------------------------------GETTERS E SETTERS----------------------------------------------------------//
  
   getId() { return this.id; }

  setId(id) {
    Comunicacao.validarId(id);
    this.id = id;
  }

  getTitulo() { return this.titulo; }

  setTitulo(titulo) {
    Comunicacao.validarTitulo(titulo);
    this.titulo = titulo;
  }

  getConteudo() { return this.conteudo; }

  setConteudo(conteudo) {
    Comunicacao.validarConteudo(conteudo);
    this.conteudo = conteudo;
  }

  getAutor() { return this.autor; }

  setAutor(autor) {
    Comunicacao.validarAutor(autor);
    this.autor = { id: autor.id, nome: autor.nome };
  }

  getEsportes() { return [...this.esportes]; }
  
  setEsportes(esportes) {
    Comunicacao.validarEsportes(esportes);
    this.esportes = esportes.map(esporte => ({ id: esporte.id, nome: esporte.nome }));
  }
  
  //---------------------------------------VALIDACOES--------------------------------------------------//
  
  static validarId(id) {
    if (id !== null && typeof id !== "string") {
      throw new ModelError("ID deve ser string ou null");
    }
  }

  static validarTitulo(titulo) {
    if (!titulo || typeof titulo !== "string") {
      throw new ModelError("Título deve ser uma string não vazia");
    }
    if (titulo.length > 100) {
      throw new ModelError("Título muito longo (máx. 100 caracteres)");
    }
  }

  static validarConteudo(conteudo) {
    if (!conteudo || typeof conteudo !== "string") {
      throw new ModelError("Conteúdo deve ser uma string não vazia");
    }
    if (conteudo.length > 500) {
      throw new ModelError("Conteúdo muito longo (máx. 500 caracteres)");
    }
  }

  static validarAutor(autor) {
    if (!autor || typeof autor !== "object") {
      throw new ModelError("Autor deve ser um objeto");
    }
    if (!autor.id || typeof autor.id !== "string") {
      throw new ModelError("Autor deve ter um ID válido");
    }
    if (!autor.nome || typeof autor.nome !== "string") {
      throw new ModelError("Autor deve ter um nome válido");
    }
  }

  static validarEsportes(esportes) {
    if (!Array.isArray(esportes)) {
      throw new ModelError("Esportes deve ser um array");
    }
    if (esportes.length === 0) {
      throw new ModelError("Deve haver pelo menos 1 esporte");
    }
    esportes.forEach(esporte => {
      if (!esporte.id || typeof esporte.id !== "string") {
        throw new ModelError("Esporte com ID inválido");
      }
      if (!esporte.nome || typeof esporte.nome !== "string") {
        throw new ModelError("Esporte com nome inválido");
      }
    });
  }
  
  //----------------------------------------FIREBASE-------------------------------------------------//
  
  toFirestore() {
    return {
      titulo: this.titulo,
      conteudo: this.conteudo,
      autor: this.autor,
      esportes: this.esportes,
      dataCriacao: this.dataCriacao
    };
  }
  
  static fromFirestore(doc) {
    const data = doc.data();
    return new Comunicacao(
      doc.id,
      data.titulo,
      data.conteudo,
      data.autor,
      data.esportes
    );
  }
  
  //----------------------------------------RETORNO-------------------------------------------------//
  
  toString() {
  const esportesStr = this.esportes.map(e => e.nome).join(", ");
  return `[${this.dataCriacao.toLocaleString()}] ${this.titulo}\nAutor: ${this.autor.nome}\nEsportes: ${esportesStr}`;
}
}