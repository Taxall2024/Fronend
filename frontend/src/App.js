import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from "./components/navigationBar.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './scss/style.css';

import ComercialNavbar from './components/comercial/navbarComercial.js'
import ConsultaCNPJ from './components/comercial/consultacnpj/consultacnpj.js'


import JCPPage from "./components/jcp/Jcppage.js";
import Header from "./components/curvedMenu/Header.js";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header /> {/* Curved menu */}

        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/operacao" element={<h1>Operação Page</h1>} />

          {/* Agrupando rotas de análise */}
          <Route path="/analise/*" element={<AnaliseRoutes />} />

          <Route path="/comercial/*" element={<ComercialRoutes/>} />

          <Route path="/about" element={<h1>Sobre Page</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

// Definindo as rotas de análise com a navbar de Análise
const AnaliseRoutes = () => {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="" element={<JCPPage />} />
        <Route path="jcp" element={<JCPPage />} />
      </Routes>
    </>
  );
}

export default App;

const ComercialRoutes= () => {
  return (
    <>
      <ComercialNavbar />
      <Routes>
        <Route path="" element={<ConsultaCNPJ />} />
        <Route path="/consultaCNPJ" element={<ConsultaCNPJ />} />
      </Routes>
    </>
  );
}

export { ComercialRoutes };


