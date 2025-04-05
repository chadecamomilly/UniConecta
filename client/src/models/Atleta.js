import Usuario from "./Usuario.js";
import ModelError from "./ModelError.js";

export class Atleta extends Usuario {
  constructor(id, nome, email) {
    super(id, nome, email, "atleta");
    this.esportes = []; 
  }

  participarEsporte(esporte) {
    if (!esporte || !esporte.nome) {
      throw new ModelError("Esporte inválido.");
    }
    this.esportes.push(esporte); 
  }

  getEsportes() {
    return this.esportes;
  }
}