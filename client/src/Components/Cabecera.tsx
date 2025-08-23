import React from 'react';
import { useAuth } from '../AuthContext';
import './Cabecera.css';
import logo from '../assets/images.jpeg';
import { Link } from 'react-router-dom';
import NotificacionesDropdown from './NotificacionesDropdown'; // Importar el componente

const Cabecera = () => {
  const { user } = useAuth();

  return (
    <header className="Cabecera">
      <img src={logo} alt="Logo de Mi Aplicación" className="Cabecera-logo" />
      
      <nav className="Cabecera-nav">
        <ul className="Cabecera-ul">
          <li className="Cabecera-li"><Link to="/" className="Cabecera-a">Inicio</Link></li>
          <li className="Cabecera-li"><Link to="/Usuario" className="Cabecera-a">Usuario</Link></li>
          
          {/* Mostrar notificaciones solo para roles autorizados */}
          {user && ["Administrador", "Coordinador", "Entrevistador"].includes(user.rol) && (
            <li className="Cabecera-li">
              <NotificacionesDropdown />
            </li>
          )}
          
         
        </ul>
      </nav>
    </header>
  );
};

export default Cabecera;