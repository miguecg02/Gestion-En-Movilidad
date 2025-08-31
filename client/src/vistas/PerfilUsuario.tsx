import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PerfilUsuario.css';
import { API_URL } from "../config";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Entrevistador {
  idEntrevistador: number;
  email: string;
  nombre: string;
  telefono: string;
  organizacion: string;
  fecha_nacimiento: string;
}

interface Location {
  lat: number;
  lng: number;
  accuracy: number;
}

const PerfilUsuario = () => {
  const { user, logout } = useAuth();
  const [entrevistador, setEntrevistador] = useState<Entrevistador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Entrevistador>>({});
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    const fetchEntrevistador = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/personas/entrevistadores/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        
        const datosEntrevistador = {
          idEntrevistador: response.data.idEntrevistador,
          email: response.data.email,
          nombre: response.data.nombre || '',
          telefono: response.data.telefono || '',
          organizacion: response.data.organizacion || '',
          fecha_nacimiento: response.data.fecha_nacimiento || null
        };
        
        setEntrevistador(datosEntrevistador);
        setFormData(datosEntrevistador);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('Error detallado:', err.response?.data || err.message);
        } else {
          console.error('Error detallado:', (err as Error).message);
        }
        setError('Error al cargar los datos del usuario. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchEntrevistador();
    }
  }, [user]);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          setLocationError('No se pudo obtener la ubicación: ' + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('La geolocalización no es compatible con este navegador.');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
       `${API_URL}/api/personas/entrevistadores/${user?.id}`, formData, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });
      setEntrevistador(formData as Entrevistador);
      setEditMode(false);
      alert('Perfil actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar los datos');
      console.error(err);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Cargando información del usuario...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p className="error-message">{error}</p>
      <button onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  );

  return (
    <div className="perfil-usuario-container">
      <h2>Perfil de Usuario</h2>
      
      {!entrevistador ? (
        <p className="no-data">No se encontraron datos del usuario</p>
      ) : editMode ? (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              required
              disabled // El email no debería ser editable normalmente
            />
          </div>
          
          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Organización:</label>
            <input
              type="text"
              name="organizacion"
              value={formData.organizacion || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Fecha de nacimiento:</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento?.toString().substring(0, 10) || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => setEditMode(false)} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              Guardar cambios
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <p><strong>Nombre:</strong> {entrevistador.nombre}</p>
          <p><strong>Email:</strong> {entrevistador.email}</p>
          <p><strong>Teléfono:</strong> {entrevistador.telefono || 'N/A'}</p>
          <p><strong>Organización:</strong> {entrevistador.organizacion || 'N/A'}</p>
          <p><strong>Fecha de nacimiento:</strong> {entrevistador.fecha_nacimiento?.toString().substring(0, 10) || 'N/A'}</p>
          
          {/* Mapa de ubicación actual */}
          <div className="location-section">
            <h3>Ubicación Actual</h3>
            {locationError && <p className="error-message">{locationError}</p>}
            {location ? (
              <div className="map-container">
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={13}
                  style={{ height: '300px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[location.lat, location.lng]}>
                    <Popup>
                      Su ubicación actual <br />
                      Precisión: {location.accuracy.toFixed(2)} metros
                    </Popup>
                  </Marker>
                </MapContainer>
                <p className="location-coordinates">
                  Coordenadas: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
            ) : !locationError && (
              <p>Obteniendo ubicación...</p>
            )}
          </div>
          
          <div className="profile-actions">
            {(user?.rol === 'Coordinador' || user?.rol === 'Registrador') && (
              <button 
                onClick={() => setEditMode(true)}
                className="edit-btn"
              >
                Editar Perfil
              </button>
            )}
            <button onClick={logout} className="logout-btn">
              Cerrar sesión
            </button>
          </div>
        </div>  
      )}
    </div>
  );
};

export default PerfilUsuario;