import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../services/firebase";

const auth = getAuth(app);
const db = getDatabase(app);

export async function verificarCadastroUsuario(uid) {
  const snapshot = await get(ref(db, `usuarios/${uid}`));
  return snapshot.exists();
}

export async function criarContaAtleta() {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  await user.getIdToken(true); // Revalida token

  const userData = {
    id: user.uid,
    nome: user.displayName || "Novo Atleta",
    email: user.email,
    tipo: "ATLETA",
    dataCriacao: new Date().toISOString(),
  };

  await set(ref(db, `usuarios/${user.uid}`), userData);
}
