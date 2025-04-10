import './styles/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Home from './pages/Home';
import EscolherTipo from './pages/EscolherTipo';
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import Esportes from "./pages/Esportes";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/escolher-tipo" element={<EscolherTipo />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/esportes" element={<Esportes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
