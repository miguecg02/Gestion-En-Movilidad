import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import './NotificacionesDropdown.css';
import { API_URL } from "../config";


interface Notificacion {
  idNotificacion: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  fecha_creacion: string;
}

const NotificacionesDropdown = () => {
  const { token, user } = useAuth();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const cargarNotificaciones = useCallback(async () => {
  if (!isMounted.current || !token || !user || user.rol !== 'Coordinador') {
    return;
  }

  setLoading(true);
  setError(null);
  
  try {
    // URL CORREGIDA (sin /personas extra)
    const response = await axios.get(API_URL +'api/notificaciones', {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000
    });

    if (isMounted.current && response.data) {
      setNotificaciones(response.data);
    }
  } catch (err) {
    // Manejo de errores mejorado
    if (isMounted.current) {
      let errorMsg = 'Error al cargar notificaciones';
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          errorMsg = 'No tienes permiso para ver notificaciones';
        } else {
          errorMsg = err.response?.data?.error || err.message;
        }
      }
      
      setError(errorMsg);
    }
  } finally {
    if (isMounted.current) {
      setLoading(false);
    }
  }
}, [token, user]);

  useEffect(() => {
    isMounted.current = true;
    const timer = setTimeout(() => {
      cargarNotificaciones();
    }, 500); // Pequeño delay para evitar race conditions

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, [cargarNotificaciones]);

  useEffect(() => {
    const handler = () => {
      if (isMounted.current) {
        cargarNotificaciones();
      }
    };

    window.addEventListener('reloadNotifications', handler);
    return () => window.removeEventListener('reloadNotifications', handler);
  }, [cargarNotificaciones]);

  const marcarComoLeida = async (idNotificacion: number) => {
    try {
      await axios.patch(
         API_URL +`/api/notificaciones/${idNotificacion}/leida`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotificaciones(prev => prev.map(n => 
        n.idNotificacion === idNotificacion ? { ...n, leida: true } : n
      ));
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;
  const esCoordinador = user?.rol=== 'Coordinador';

  return (
    <div className="dropdown-notificaciones">
      <button 
        onClick={() => {
          setMostrarDropdown(!mostrarDropdown);
          if (!mostrarDropdown) cargarNotificaciones();
        }}
        className="boton-notificaciones"
        aria-label="Notificaciones"
        disabled={!esCoordinador}
      >
        <i className="icono-campana" />
        {esCoordinador && notificacionesNoLeidas > 0 && (
          <span className="contador-notificaciones">{notificacionesNoLeidas}</span>
        )}
      </button>
      
      {mostrarDropdown && (
        <div className="dropdown-contenido">
          <h4>Notificaciones</h4>
          
          {!esCoordinador ? (
            <div className="notificacion-vacia">Solo coordinadores pueden ver notificaciones</div>
          ) : error ? (
            <div className="notificacion-error">
              {error}
              <button onClick={cargarNotificaciones}>Reintentar</button>
            </div>
          ) : loading ? (
            <div className="cargando-notificaciones">Cargando...</div>
          ) : notificaciones.length === 0 ? (
            <div className="notificacion-vacia">No hay notificaciones nuevas</div>
          ) : (
            <div className="lista-notificaciones">
              {notificaciones.map(notificacion => (
                <div 
                  key={notificacion.idNotificacion} 
                  className={`notificacion-item ${!notificacion.leida ? 'no-leida' : ''}`}
                  onClick={() => marcarComoLeida(notificacion.idNotificacion)}
                >
                  <div className="notificacion-cabecera">
                    <span className="notificacion-titulo">{notificacion.titulo}</span>
                    {!notificacion.leida && <span className="badge-nueva">Nueva</span>}
                  </div>
                  <p className="notificacion-mensaje">{notificacion.mensaje}</p>
                  <small className="notificacion-fecha">
                    {new Date(notificacion.fecha_creacion).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificacionesDropdown;