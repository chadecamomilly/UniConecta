import ModelError from "/model/ModelError.js";


export default class Esporte {
    
  //-----------------------------------------------------------------------------------------//

  constructor(nome) {
    this.setNome(nome);
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
  

  //-----------------------------------------------------------------------------------------//

  static validarNome(nome) {
    if(nome == null || nome == "" || nome == undefined)
      throw new ModelError("O nome do Esporte não pode ser nulo!");
    if(typeof nome !== "string")
      throw new ModelError("O nome do Esporte precisa ser uma String!");
    if(nome.length != 25)
      throw new ModelError("O nome precisa ser uma String com 25 caracteres!");
    for (let i = 0; i < nome.length; i++) {
        let c = nome.codePointAt(i);
        if ((c < 65 || c > 90) && (c != 32)) 
          throw new ModelError("Caracter inválido na posição " + i + " da sigla: " + c);
    } 
  }

  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Sigla: " + this.nome;
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}