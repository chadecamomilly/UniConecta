import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase } from 'https://camomilly-lasalle-firebase-default-rtdb.firebaseio.com/';

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


// Retorna o objeto app gerado pelo firebase
export default app;