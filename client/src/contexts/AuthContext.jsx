import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para criar estrutura inicial do usuário
  const createInitialUserData = async (firebaseUser) => {
    try {
      const initialData = {
        email: firebaseUser.email,
        nome: firebaseUser.displayName || 'Novo Usuário',
        perfil: 'aluno',
        dataCriacao: new Date().toISOString()
      };

      await set(ref(db, `usuarios/${firebaseUser.uid}`), initialData);

      // Se for aluno, cria estrutura em alunos/
      if (initialData.perfil === 'aluno') {
        await set(ref(db, `alunos/${firebaseUser.uid}`), {
          foto: firebaseUser.photoURL,
          nome: firebaseUser.displayName || 'Novo Usuário',
          esportes: []
        });
      }

      return initialData;
    } catch (error) {
      console.error('[Auth] Erro ao criar dados iniciais:', error);
      throw error;
    }
  };

  // Função para carregar dados do usuário
  const loadUserData = async (firebaseUser) => {
    try {
      console.log(`[Auth] Carregando dados para usuário: ${firebaseUser.uid}`);

      // Busca dados principais
      const userRef = ref(db, `usuarios/${firebaseUser.uid}`);
      const userSnapshot = await get(userRef);

      if (!userSnapshot.exists()) {
        console.log('[Auth] Criando dados iniciais para novo usuário');
        const initialData = await createInitialUserData(firebaseUser);
        return {
          uid: firebaseUser.uid,
          ...initialData
        };
      }

      const userData = userSnapshot.val();
      console.log('[Auth] Dados do usuário:', userData);

      // Busca dados adicionais se for aluno
      let alunoData = {};
      if (userData.perfil === 'aluno') {
        const alunoRef = ref(db, `alunos/${firebaseUser.uid}`);
        const alunoSnapshot = await get(alunoRef);
        if (alunoSnapshot.exists()) {
          alunoData = alunoSnapshot.val();
          if (!alunoData.foto && firebaseUser.photoURL) {
            alunoData.foto = firebaseUser.photoURL;
          }
          console.log('[Auth] Dados de aluno:', alunoData);
        }
      }

      return {
        uid: firebaseUser.uid,
        email: userData.email || firebaseUser.email,
        nome: userData.nome || firebaseUser.displayName,
        perfil: userData.perfil || 'aluno',
        ...alunoData
      };

    } catch (error) {
      console.error('[Auth] Erro ao carregar dados:', error);
      setError(error);
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        perfil: 'aluno',
        foto: firebaseUser.photoURL,
        nome: firebaseUser.displayName || 'Usuário'
      };
    }
  };

  // Monitora estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError(null);

      try {
        if (firebaseUser) {
          console.log('[Auth] Usuário autenticado:', firebaseUser.uid);
          const userData = await loadUserData(firebaseUser);
          setUser(userData);
        } else {
          console.log('[Auth] Nenhum usuário autenticado');
          setUser(null);
        }
      } catch (err) {
        console.error('[Auth] Erro no listener de autenticação:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Atualiza dados do usuário
  const refreshUser = async () => {
    if (!auth.currentUser) return false;

    try {
      setLoading(true);
      const updatedData = await loadUserData(auth.currentUser);
      setUser(updatedData);
      return true;
    } catch (error) {
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('[Auth] Erro no logout:', error);
      setError(error);
    }
  };

  // Valor do contexto
  const value = {
    user,
    loading,
    error,
    logout,
    refreshUser,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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