import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import CrearDenuncia from './pages/CrearDenuncia';
import VerDenuncias from './pages/VerDenuncias';
import DetalleDenuncia from './pages/DetalleDenuncia';
import SeguimientoPersonal from './pages/SeguimientoPersonal';

// Importar estilos
import '../css/munidenuncia.css';
import '../css/crear_denuncia.css';
import '../css/ver_denuncias.css';
import '../css/detalle_denuncia.css';
import '../css/seguimiento_personal.css';
import '../css/pie_pagina.css';
import '../css/pagina_inicio.css'; // Al final para sobrescribir

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crear" element={<CrearDenuncia />} />
          <Route path="/denuncias" element={<VerDenuncias />} />
          <Route path="/detalle/:id" element={<DetalleDenuncia />} />
          <Route path="/seguimiento" element={<SeguimientoPersonal />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
