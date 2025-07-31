import './Components/Cabecera.css';
import FormularioEnMovilidad from './vistas/Registro_movilidad';
import { BrowserRouter, Route, Routes, Link, useNavigate } from 'react-router-dom';
import "./App.css";
import EditarPersona from './vistas/EditarPersona';
import EditarPersonaEnMovilidad from './vistas/EditarPersonaEnMovilidad'; // Importar el componente
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import Login from './vistas/Login';
import FormularioDesaparecida from "./vistas/Registro_desaparecidas";
import logo from './assets/images.jpeg'; 
import Encuentro from './vistas/Encuentro';
import { EncuentroProvider } from './vistas/EncuentroContext';
import IniciarEncuentro from './Components/IniciarEncuentros';
import PerfilUsuario from './vistas/PerfilUsuario';
import ListadoPersonasMovilidad from './vistas/ListadoPersonasMovilidad';
 import VerPersonaEnMovilidad from './vistas/VerPersonaEnMovilidad';

// Componente ButtonGroup (extraído del JSX original)
function ButtonGroup() {
  const navigate = useNavigate();

  return (
    <div className="ButtonGroup">
      <button className="App-button" onClick={() => navigate('/Registro_desaparecidas')}>
        Añadir persona desaparecida
      </button>
      <button className="App-button" onClick={() => navigate('/Registro_movilidad')}>
        Añadir persona en movilidad
      </button>
      {/* Nuevo botón para visualizar personas en movilidad */}
      <button 
        className="App-button" 
        onClick={() => navigate('/visualizar-movilidad')}
      >
        Visualizar personas 
      </button>
    </div>
  );
}
// Componente Cabecera
function Cabecera() {
  return (
    <header className="Cabecera">
      <img src={logo} alt="Logo de Mi Aplicación" className="Cabecera-logo" />
      {/* Navegación */}

      <nav className="Cabecera-nav">
        <ul className="Cabecera-ul">
          <li className="Cabecera-li"><Link to="/" className="Cabecera-a">Inicio</Link></li>
          <li className="Cabecera-li"><Link to="/Usuario" className="Cabecera-a">Usuario</Link></li>
          <li className="Cabecera-li"><Link to="/Contacto" className="Cabecera-a">Contacto</Link></li>
          <li className="Cabecera-li"><Link to="/Acerca" className="Cabecera-a">Acerca de</Link></li>
        </ul>
      </nav>
    </header>
  );
}


function App() {
  return (
    <AuthProvider>
      <EncuentroProvider>
      <BrowserRouter>
        <Cabecera />
        <main className="App-body">
          <IniciarEncuentro />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
           
            {/* Rutas protegidas */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<ButtonGroup />} />
              <Route path="/Inicio" element={<ButtonGroup />} />
              <Route path="/Registro_desaparecidas" element={<FormularioDesaparecida />} />
              <Route path="/Registro_movilidad" element={<FormularioEnMovilidad />} />
               <Route path="/Usuario" element={<PerfilUsuario />} /> 
              <Route path="/editar/:id" element={<EditarPersona />} />
              <Route path="/editarEnMovilidad/:id" element={<EditarPersonaEnMovilidad />} />
              <Route path="/encuentro/:idPersona" element={<Encuentro />} />
              <Route path="/Contacto" element={<h2>Contacto</h2>} />
                <Route path="/verEnMovilidad/:id" element={<VerPersonaEnMovilidad />} />
              <Route path="/Acerca" element={<h2>Acerca de</h2>} />
              <Route path="/visualizar-movilidad" element={<ListadoPersonasMovilidad />} />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
      </EncuentroProvider>
    </AuthProvider>
  );
}

export default App;
