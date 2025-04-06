import './styles/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Home from './pages/Home';
import EscolherTipo from './pages/EscolherTipo';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/escolher-tipo" element={<EscolherTipo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
