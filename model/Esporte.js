import ModelError from "/model/ModelError.js";


export default class Esporte {
    
  //-----------------------------------------------------------------------------------------//

  constructor(id, nome) {
    this.setId(id);
    this.setNome(nome);
    this.comunicacoes = [];
  }

  getId() {
    return this.id;
  }

  setId(id) {
    Esporte.validarId(id);
    this.id = id;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNome() {
    return this.nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNome(nome) {
    Esporte.validarNome(nome);
    this.nome = nome;
  }
  
   addComunicacao(comunicacao) {
    if (!comunicacao) throw new ModelError("Comunicação inválida!");
    this.comunicacoes.push(comunicacao);
  }

  getComunicacoes() {
    return this.comunicacoes;
  }
  

  

  //-----------------------------------------------------------------------------------------//
  
  static validarId(id) {
     if (id !== null && typeof id !== "string") {
      throw new ModelError("ID deve ser uma string ou null");
    }
  }

  static validarNome(nome) {
    if(nome == null || nome == "" || nome == undefined)
      throw new ModelError("O nome do Esporte não pode ser nulo!");
    if(typeof nome !== "string")
      throw new ModelError("O nome do Esporte precisa ser uma String!");
    for (let i = 0; i < nome.length; i++) {
        let c = nome.codePointAt(i);
        if ((c < 65 || c > 90) && (c != 32)) 
          throw new ModelError("Caracter inválido na posição " + i + " da sigla: " + c);
    } 
  }

  //-----------------------------------------------------------------------------------------//
  
  toFirestore() {
    return {
      id: this.id,
      nome: this.nome,
      comunicacoes: this.comunicacoes // Armazena apenas os IDs
    };
  }
   
  toString() {
    return `Esporte: ${this.nome} (${this.comunicacoes.length} comunicações)`;
  }
  
  
}