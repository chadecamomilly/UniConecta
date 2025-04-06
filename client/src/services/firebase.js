import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// 
// Configuração do projeto no firebase
//
const firebaseConfig = {
  apiKey: "AIzaSyCWjcbC99DqzcY_v8KDrEtqKKEt5LoFsoA",
  authDomain: "camomilly-lasalle-firebase.firebaseapp.com",
  databaseURL: "https://camomilly-lasalle-firebase-default-rtdb.firebaseio.com",
  projectId: "camomilly-lasalle-firebase",
  storageBucket: "camomilly-lasalle-firebase.firebasestorage.app",
  messagingSenderId: "717274023578",
  appId: "1:717274023578:web:690c7346ce0779ad198123",
  measurementId: "G-5DT18D8PFP"
};

// Chama a função initializeApp do firebase (ver o import acima)
let app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
const auth = getAuth(app);


// Retorna o objeto app gerado pelo firebase
export default app;
export { auth };