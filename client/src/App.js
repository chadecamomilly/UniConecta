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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/confirmar-email" element={<ConfirmarEmail />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
