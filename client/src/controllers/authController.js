import app from "../services/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  browserSessionPersistence,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

const auth = getAuth(app);
auth.setPersistence(browserSessionPersistence);

const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// Salvar no banco
async function salvarUsuario(uid, nome, email, perfil = "aluno", foto = "") {
  // salva em /usuarios
  await set(ref(db, `usuarios/${uid}`), {
    nome,
    email,
    perfil,
  });

  // salva em /alunos
  await set(ref(db, `alunos/${uid}`), {
    nome,
    foto,
    esportes: [],
  });
}

// Login com email e senha
export async function loginComEmailSenha(email, senha) {
  if (!email || !senha) throw new Error("Email e senha são obrigatórios");

  const cred = await signInWithEmailAndPassword(auth, email, senha);
  const user = cred.user;

  if (!user.emailVerified) {
    throw new Error("Email não verificado");
  }

  return user;
}

// Cadastro com email e senha
export async function cadastrarComEmailSenha(email, senha, nome) {
  if (!email || !senha || !nome)
    throw new Error("Todos os campos são obrigatórios");

  const cred = await createUserWithEmailAndPassword(auth, email, senha);
  const user = cred.user;

  await updateProfile(user, {
    displayName: nome
  });

  await user.reload();

  await sendEmailVerification(user);

  await salvarUsuario(user.uid, nome, email);

  return cred;
}

// Login com Google
export async function loginComGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Verifica se já existe em /usuarios
  const refUsuario = ref(db, `usuarios/${user.uid}`);
  const snapshot = await get(refUsuario);

  if (!snapshot.exists()) {
    await salvarUsuario(user.uid, user.displayName, user.email, "aluno", user.photoURL || "");
  }

  return user;
}

// Redefinição de senha
export const enviarEmailRedefinicaoSenha = async (email) => {
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email);
};


// Logout
export async function logout() {
  await auth.signOut();
}
