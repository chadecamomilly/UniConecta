import ModelError from "./ModelError.js";

export default class Usuario {
  constructor(id, nome, email, tipo) {
    this.setId(id);    
    this.setNome(nome); 
    this.setEmail(email); 
    this.setTipo(tipo); 
  }
  
  getId() {
    return this.id;
  }

  setId(id) {
    Usuario.validarId(id);
    this.id = id;
  }

  getNome() {
    return this.nome;
  }

  setNome(nome) {
    Usuario.validarNome(nome);
    this.nome = nome;
  }

  getEmail() {
    return this.email;
  }

  setEmail(email) {
    Usuario.validarEmail(email);
    this.email = email;
  }

  getTipo() {
    return this.tipo;
  }

  setTipo(tipo) {
    Usuario.validarTipo(tipo);
    this.tipo = tipo;
  }
  
   static validarId(id) {
    if (!id || typeof id !== "string") {
      throw new ModelError("ID inválido: deve ser uma string não vazia.");
    }
  }

  static validarNome(nome) {
    if (!nome || typeof nome !== "string" || nome.length < 3) {
      throw new ModelError("Nome inválido: mínimo 3 caracteres.");
    }
  }

  static validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      throw new ModelError("E-mail inválido.");
    }
  }

  static validarTipo(tipo) {
    const tiposValidos = ["admin", "atleta", "responsavel"];
    if (!tiposValidos.includes(tipo)) {
      throw new ModelError(`Tipo inválido: use ${tiposValidos.join(" ou ")}.`);
    }
  }
  
   toFirestore() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      tipo: this.tipo,
    };
  }
  
  toString() {
    return `[${this.tipo.toUpperCase()}] ${this.nome} (${this.email})`;
  }
}