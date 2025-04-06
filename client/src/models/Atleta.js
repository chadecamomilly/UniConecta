import Usuario from "./Usuario.js";
import ModelError from "./ModelError.js";

export class Atleta extends Usuario {
  constructor(id, nome, email, esportes = [], foto = null) {
    super(id, nome, email, "atleta");
    this.esportes = esportes;
  }

  participarEsporte(idEsporte) {
    if (!idEsporte || typeof idEsporte !== "string") {
      throw new ModelError("ID do esporte inválido.");
    }

    if (!this.esportes.includes(idEsporte)) {
      this.esportes.push(idEsporte);
    } else {
      throw new ModelError("Usuário já participa desse esporte.");
    }
  }

  getEsportes() {
    return this.esportes;
  }

  removerEsporte(idEsporte) {
    this.esportes = this.esportes.filter(id => id !== idEsporte);
  }
}

export default Atleta;