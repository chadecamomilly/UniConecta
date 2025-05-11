import { getDatabase, ref, onValue, get, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../services/firebase";

const db = getDatabase(app);
const auth = getAuth(app);

export function ouvirEsportes(callback) {
  const esportesRef = ref(db, "esportes");
  return onValue(esportesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const lista = Object.entries(data).map(([id, valor]) => ({
        id,
        ...valor,
      }));
      callback(lista);
    }
  });
}

export function ouvirEsportesDoUsuario(callback) {
  const user = auth.currentUser;
  if (!user) return;

  const usuarioRef = ref(db, `usuarios/${user.uid}`);
  return onValue(usuarioRef, (snapshot) => {
    if (snapshot.exists()) {
      const dados = snapshot.val();
      const esportes = dados.esportes || [];
      callback(esportes);
    }
  });
}

export async function participarDoEsporte(idEsporte) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Você precisa estar logado.");
  }

  const usuarioRef = ref(db, `usuarios/${user.uid}`);

  const snapshot = await get(usuarioRef);
  if (!snapshot.exists()) {
    throw new Error("Usuário não encontrado.");
  }

  const dados = snapshot.val();
  const esportes = dados.esportes || [];

  if (esportes.includes(idEsporte)) {
    throw new Error("Você já está inscrito nesse esporte.");
  }

  esportes.push(idEsporte);
  await update(usuarioRef, { esportes });
}
