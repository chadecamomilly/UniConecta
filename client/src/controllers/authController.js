import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import app from "../services/firebase";

const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export async function registrarUsuarioComEmail(email, senha) {
  try {
    const credenciais = await createUserWithEmailAndPassword(auth, email, senha);
    return credenciais.user;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function loginComEmailESenha(email, senha) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const uid = userCredential.user.uid;
    
    const userRef = ref(db, "usuarios/" + uid);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      throw new Error("Usuário não encontrado no banco de dados.");
    }
    
    return { user: userCredential.user, userData: snapshot.val() };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function loginComGoogle() {
  try {
    const resultado = await signInWithPopup(auth, provider);
    return resultado.user;
  } catch (error) {
    throw new Error(error.message);
  }
}