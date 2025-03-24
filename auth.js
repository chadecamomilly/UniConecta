//---- Carregando as definições do nosso projeto no Firebase ----//
import app from "/firebase.js";
//---- Importando as funções associadas à autenticação (Versão 10.9.0 do Firebase) ----//
import {
  getAuth,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
//---- Importando as função para manipulação do Realtime Database (Versão 10.9.0 do Firebase) ----//
import {
  getDatabase,
  ref,
  get,
  set,
  query,
  child
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

//----------------------------------------------------------------------//

function obterElemento(nomeWidget) {
  let elemento = document.getElementById(nomeWidget);
  if (elemento === null || elemento === undefined)
    throw new Error("Widget " + nomeWidget + " não encontrada");
  return elemento;
}

//----------------------------------------------------------------------//

// Recuperando as referências para os elementos presentes na página novaconta.html
let btLogin = obterElemento("btLogin");
let btNovaConta = obterElemento("btNovaConta");
let tfConta = obterElemento("tfConta");
let tfSenha = obterElemento("tfSenha");

// Verificar se o usuário já está na entrada de usuários do Realtime Database
const connDB = getDatabase(app);

//----------------------------------------------------------------------//

function btLoginCallback() {
  // Recuperando o que está preenchido no input tfConta
  let conta = tfConta.value;
  if (conta == null || conta == "") {
    alert("conta não preenchida");
    return;
  }
  // Recuperando o que está preenchido no input tfSenha
  let senha = tfSenha.value;
  if (senha == null || senha == "") {
    alert("senha não preenchida");
    return;
  }
  // Recuperando o objeto gerenciador de autenticação do Firebase
  const auth = getAuth(app);
  auth.setPersistence(browserSessionPersistence);

  // Recuperando as credenciais do usuário
  signInWithEmailAndPassword(auth, conta, senha)
    .then((credencial) => {
      // Conta e senha estão ok segundo o Firebase
      let usr = credencial.user;
      console.log("Usuário Autenticado: ", usr);

      // Verificando se o usuário já verificou o seu email. Se não, não continuo o processo de autenticação
      if (!usr.emailVerified) {
        alert("Email não verificado. Veja sua caixa e confirme sua conta.");
        return;
      }

      // Monto uma referência para o objeto que desejo recuperar
      let dbRefUsuario = ref(connDB, "usuarios/" + usr.uid);
      // Monto a consulta a partir da referência
      let consulta = query(dbRefUsuario);
      // Executo a consulta. Ela devolve uma Promise
      get(consulta)
        .then((dataSnapshot) => {
          // Se a consulta teve um resultado, então pegamos o conteúdo (val()) do objeto
          let usuario = dataSnapshot.val();
          if (dataSnapshot.exists() && dataSnapshot.val().funcao != "INABILITADO") {
            // O usuário já está na entrada de usuários no firebase e pode usar o sistema
            window.location.href = "logged.html";
          } else
            alert("Sua conta ainda não foi liberada por um administrador.");
        })
        .catch((e) => {
          console.log(e)
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Conta ainda não criada.");
      console.log("#------->" + errorMessage + " " + errorCode);
    });
}

//----------------------------------------------------------------------//

function btNovaContaCallback() {
  window.location.href = "novaconta.html";
}

//----------------------------------------------------------------------//

btLogin.onclick = btLoginCallback;
btNovaConta.onclick = btNovaContaCallback;

const TOKENS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Número de Milisegundos desde 1/1/2024 até agora
let numero = Math.abs(~~((Date.now() - new Date(2024,1,1)) / 1000)) ;
let saida = "";
let TAM = TOKENS.length;
while(numero > 0) {
  let letra = TOKENS[ numero % TAM ];
  saida += TOKENS[ numero % TAM ];
  console.log("SAIDA: ", numero % TAM, letra, saida, numero);  
  numero = Math.abs(~~(numero / TOKENS.length));   
}
console.log("SAIDA: ", saida, numero);


let i = 0;
let inverso = 0; 
let tam = saida.length;
console.log('tam', tam);
while(i < tam) {
  console.log(i, saida[i], TOKENS.indexOf(saida[i]), TAM * (tam-i),  TOKENS.indexOf(saida[i]) * Math.pow(TAM, tam-i), inverso)
  inverso += TOKENS.indexOf(saida[i]) * Math.pow(TAM, tam-i);
  i++;
}
console.log(inverso)


//----------------------------------------------------------------------//

//
// O código abaixo está relacionado com o deploy do Service Worker. Isso permite que nossa 
// aplicação se torne um App para Dispositivos Mobile
//
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
  .then(function(reg) {
    // registration worked
    console.log('Registro do Service Worker bem sucedido. O escopo de uso é ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registro do Service Worker com ' + error);
  });
}