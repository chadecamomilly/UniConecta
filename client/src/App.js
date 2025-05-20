import './styles/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';

import Cadastro from './views/pages/Cadastro';
import Login from './views/pages/Login';
import RecuperarSenha from './views/pages/RecuperarSenha';
import ConfirmarEmail from './views/pages/ConfirmarEmail';
import Home from './views/pages/Home';
import Perfil from './views/pages/Perfil';
import Configuracoes from './views/pages/Configuracoes';

import RotaProtegida from './views/components/Rota';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/confirmar-email" element={<ConfirmarEmail />} />

          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <RotaProtegida>
                <Home />
              </RotaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RotaProtegida>
                <Perfil />
              </RotaProtegida>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <RotaProtegida>
                <Configuracoes />
              </RotaProtegida>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
