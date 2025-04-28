import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { db } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          
          // Busca os dados no caminho 'usuarios' (conforme suas regras)
          const userRef = ref(db, `usuarios/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          

          if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log('Tipo do usuário:', userData.tipo);
            
            setUser({
              uid: firebaseUser.uid,
              email: userData.email || firebaseUser.email,
              nome: userData.nome || firebaseUser.displayName,
              tipo: userData.tipo || 'ATLETA' // Mantém o valor original (já validado pelas regras)
            });
          } else {
            console.warn('Usuário não encontrado em "usuarios"');
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              tipo: 'ATLETA' // Valor padrão se não existir no banco
            });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          // Fallback seguro mantendo o usuário logado mas com permissões mínimas
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            tipo: 'ATLETA' // Assume o pior cenário por segurança
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Função para atualizar os dados do usuário manualmente
  const refreshUser = async () => {
    if (auth.currentUser) {
      try {
        const snapshot = await get(ref(db, `usuarios/${auth.currentUser.uid}`));
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUser(prev => ({
            ...prev,
            ...userData,
            tipo: userData.tipo || prev.tipo
          }));
          return true;
        }
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
      }
    }
    return false;
  };

  const value = {
    user,
    loading,
    logout,
    refreshUser,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}