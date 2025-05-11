import './styles/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import Cadastro from './views/pages/Cadastro';
import Login from './views/pages/Login';
import Home from './views/pages/Home';
import EscolherTipo from './views/pages/EscolherTipo';
import Perfil from "./views/pages/Perfil";
import Configuracoes from "./views/pages/Configuracoes";
import Esportes from "./views/pages/Esportes";
import NovaPublicacao from './views/pages/NovaPublicacao';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/escolher-tipo" element={<EscolherTipo />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/esportes" element={<Esportes />} />
          <Route path="/nova-publicacao" element={<NovaPublicacao />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
