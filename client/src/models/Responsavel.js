import Usuario from "./Usuario.js";
import ModelError from "./ModelError.js";

class Responsavel extends Usuario {
    constructor(id, nome, email, esporteId, foto = null) {
        super(id, nome, email, "responsavel", foto);

        if (!esporteId) {
            throw new ModelError("Responsável precisa estar vinculado a um esporte.");
        }

        this.esporteId = esporteId;
    }

    criarComunicado(titulo, conteudo) {
        if (!titulo || !conteudo) {
            throw new ModelError("Título e conteúdo são obrigatórios.");
        }

        if (typeof titulo !== "string" || typeof conteudo !== "string") {
            throw new ModelError("Título e conteúdo devem ser strings.");
        }

        return {
            titulo,
            conteudo,
            esporteId: this.esporteId,
            criadoPor: this.nome,
            dataCriacao: new Date().toISOString()
        };
    }

    editarComunicado(comunicado, novoTitulo, novoConteudo) {
        if (comunicado.esporteId !== this.esporteId) {
            throw new ModelError("Você não pode editar comunicados de outro esporte.");
        }

        if (!novoTitulo || !novoConteudo) {
            throw new ModelError("Título e conteúdo atualizados são obrigatórios.");
        }

        comunicado.titulo = novoTitulo;
        comunicado.conteudo = novoConteudo;
        comunicado.dataEdicao = new Date().toISOString();

        return comunicado;
    }

    excluirComunicado(comunicado) {
        if (comunicado.esporteId !== this.esporteId) {
            throw new ModelError("Você não pode excluir comunicados de outro esporte.");
        }

        return true; // A lógica de exclusão real acontece no banco, aqui só retorna permissão.
    }

    adicionarEventoCalendario(evento) {
        if (!evento || !evento.titulo || !evento.data) {
            throw new ModelError("Evento inválido.");
        }

        evento.esporteId = this.esporteId;
        evento.criadoPor = this.nome;
        evento.dataCriacao = new Date().toISOString();

        return evento;
    }

    editarEventoCalendario(evento, novosDados) {
        if (evento.esporteId !== this.esporteId) {
            throw new ModelError("Você não pode editar eventos de outro esporte.");
        }

        return {
            ...evento,
            ...novosDados,
            dataEdicao: new Date().toISOString()
        };
    }

    excluirEventoCalendario(evento) {
        if (evento.esporteId !== this.esporteId) {
            throw new ModelError("Você não pode excluir eventos de outro esporte.");
        }

        return true;
    }

    promoverAtletaParaResponsavel(atleta, nome, email) {
        if (!atleta || atleta.tipo !== "atleta") {
            throw new ModelError("Usuário não é um atleta válido.");
        }

        return {
            id: atleta.id,
            nome: nome || atleta.nome,
            email: email || atleta.email,
            tipo: "responsavel",
            esporteId: this.esporteId,
            foto: atleta.foto || null
        };
    }

    toFirestore() {
        return {
            ...super.toFirestore(),
            esporteId: this.esporteId,
            funcoes: [
                "criar_comunicado",
                "editar_comunicado",
                "excluir_comunicado",
                "gerenciar_calendario",
                "promover_atleta"
            ]
        };
    }
}

export default Responsavel;
