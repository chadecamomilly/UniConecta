import { getDatabase, ref, push, update, remove, get, child } from "firebase/database";
import Publicacao from "../../models/Publicacao";

export default class DaoPublicacao {
    constructor() {
        this.db = getDatabase();
        this.refPublicacoes = ref(this.db, "publicacoes");
    }

    async criar(publicacao) {
        const uid = push(this.refPublicacoes).key;
        if (!uid) throw new Error("Erro ao gerar UID para publicação.");

        const dataCriacao = publicacao.getDataCriacao();
        if (!dataCriacao) throw new Error("Publicação sem data de criação.");

        const publicacaoObj = publicacao.toFirebase();

        const updates = {};
        updates[uid] = publicacaoObj;
        await update(this.refPublicacoes, updates);

        return uid;
    }


    async editar(uid, publicacao) {
        const publicacaoObj = publicacao.toFirebase();
        const publicacaoRef = ref(this.db, `publicacoes/${uid}`);
        await update(publicacaoRef, publicacaoObj);
    }

    async excluir(uid) {
        const publicacaoRef = ref(this.db, `publicacoes/${uid}`);
        await remove(publicacaoRef);
    }

    async buscarPorEsporte(esporteId) {
        const snapshot = await get(this.refPublicacoes);
        if (!snapshot.exists()) return [];

        const publicacoesRaw = snapshot.val();
        const resultados = [];

        for (const uid in publicacoesRaw) {
            const pubDados = publicacoesRaw[uid];
            if (Array.isArray(pubDados.esportes) && pubDados.esportes.includes(esporteId)) {
                try {
                    const p = new Publicacao(
                        uid,
                        pubDados.data_criacao,
                        pubDados.autor,
                        pubDados.titulo,
                        pubDados.conteudo,
                        pubDados.esportes
                    );
                    resultados.push(p);
                } catch (e) {
                    console.warn("Publicação inválida ignorada:", e);
                }
            }
        }

        return resultados;
    }

    async buscarTodos() {
        const snapshot = await get(this.refPublicacoes);
        if (!snapshot.exists()) return [];

        const publicacoesRaw = snapshot.val();
        const resultados = [];

        for (const uid in publicacoesRaw) {
            const pubDados = publicacoesRaw[uid];
            try {
                const p = new Publicacao(
                    uid,
                    pubDados.data_criacao,
                    pubDados.autor,
                    pubDados.titulo,
                    pubDados.conteudo,
                    pubDados.esportes
                );
                resultados.push(p);
            } catch (e) {
                console.warn("Publicação inválida ignorada:", e);
            }
        }

        resultados.sort((a, b) => new Date(b.getDataCriacao()) - new Date(a.getDataCriacao()));

        return resultados;
    }

    async buscarPorId(uid) {
        const publicacaoRef = ref(this.db, `publicacoes/${uid}`);
        const snapshot = await get(publicacaoRef);

        if (!snapshot.exists()) return null;

        const dados = snapshot.val();

        return new Publicacao(
            uid,
            dados.data_criacao,
            dados.autor,
            dados.titulo,
            dados.conteudo,
            dados.esportes
        );
    }
}
