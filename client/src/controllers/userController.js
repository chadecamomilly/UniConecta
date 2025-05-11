import { getDatabase, ref, get, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../services/firebase";

const auth = getAuth(app);
const db = getDatabase(app);

export async function buscarUsuario(userId) {
    try {
        const userRef = ref(db, "usuarios/" + userId);
        const snapshot = await get(userRef);
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        throw error;
    }
}

export async function atualizarFotoUsuario(userId, novaFoto) {
    try {
        const userRef = ref(db, "usuarios/" + userId);
        await update(userRef, { foto: novaFoto });
        return novaFoto;
    } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        throw error;
    }
}

export function getCurrentUserId() {
    return auth.currentUser?.uid;
}