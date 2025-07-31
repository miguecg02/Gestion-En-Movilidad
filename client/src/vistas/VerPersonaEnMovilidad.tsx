import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Solución definitiva para íconos - Crear instancia personalizada
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// URL base de la API (ajustar según el entorno)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const VerPersonaEnMovilidad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<any>(null);
  const [encuentros, setEncuentros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // 1. Obtener datos de la persona
        const personaResponse = await fetch(`${API_BASE_URL}/personas/${id}`);
        
        if (!personaResponse.ok) {
          if (personaResponse.status === 404) {
            throw new Error('Persona no encontrada');
          }
          throw new Error('Error al obtener datos de la persona');
        }
        
        let personaData = await personaResponse.json();
        
        // Calcular edad a partir de FechaNacimiento si está disponible
        if (personaData.FechaNacimiento) {
          const birthDate = new Date(personaData.FechaNacimiento);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          personaData.Edad = age;
        }
        
        setPersona(personaData);
        
        // 2. Obtener encuentros asociados a la persona
        const encuentrosResponse = await fetch(`${API_BASE_URL}/personas/${id}/encuentros`);
        
        if (!encuentrosResponse.ok) {
          if (encuentrosResponse.status === 404) {
            setEncuentros([]);
            return;
          }
          throw new Error('Error al obtener encuentros');
        }
        
        const encuentrosData = await encuentrosResponse.json();
        setEncuentros(encuentrosData);
        
      } catch (err: any) {
        console.error('Error al obtener datos:', err);
        setError(err.message || 'Error al cargar los datos. Por favor, intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  

  // Procesamiento robusto de coordenadas
  const coordenadas = useMemo(() => {
    return encuentros
      .filter(e => e.latitud && e.longitud)
      .map(e => {
        const lat = parseFloat(e.latitud);
        const lng = parseFloat(e.longitud);
        return !isNaN(lat) && !isNaN(lng) ? [lat, lng] : null;
      })
      .filter(coord => coord !== null) as [number, number][];
  }, [encuentros]);

  const tieneRuta = coordenadas.length > 1;

  // Formateo seguro de fechas
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando información de la persona...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar los datos</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="not-found">
        <h3>Persona no encontrada</h3>
        <p>No se encontró información para el ID: {id}</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="ver-persona-container">
      <div className="header-section">
        <h1>Detalle de Persona en Movilidad</h1>
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Volver
        </button>
      </div>
      
      <div className="personal-info-card">
        <div className="profile-header">
          <div className="profile-icon">👤</div>
          <h2>{persona.Nombre} {persona.PrimerApellido}</h2>
          <span className={`status-badge ${persona.Situacion.toLowerCase().replace(' ', '-')}`}>
            {persona.Situacion}
          </span>
        </div>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Nacionalidad:</span>
            <span className="info-value">{persona.Nacionalidad || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Edad:</span>
            <span className="info-value">{persona.Edad || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Género:</span>
            <span className="info-value">{persona.Genero || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Origen:</span>
            <span className="info-value">{persona.Origen || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Destino:</span>
            <span className="info-value">{persona.Destino || 'N/A'}</span>
          </div>
        </div>

        <div className="profile-image-container">
          {persona.Imagen ? (
            <img 
              src={persona.Imagen}  
              alt={`Foto de ${persona.Nombre} ${persona.PrimerApellido}`}
              className="profile-image"
            />
          ) : (
            <div className="profile-icon">👤</div>
          )}
        </div>
      </div>

      <div className="route-section">
        <div className="section-header">
          <h2>Ruta de Movilidad</h2>
          <div className="stats-badge">
            {encuentros.length} encuentro{encuentros.length !== 1 ? 's' : ''} registrado{encuentros.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {coordenadas.length === 0 ? (
          <div className="no-data-message">
            <div className="map-placeholder">🗺️</div>
            <p>No se encontraron datos de ubicación para esta persona</p>
          </div>
        ) : (
          <div className="map-container">
            <MapContainer 
              center={coordenadas[0]} 
              zoom={tieneRuta ? 12 : 14} 
              style={{ height: '450px', width: '100%' }}
              whenReady={() => setTimeout(() => setMapReady(true), 100)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Línea de ruta */}
              {tieneRuta && (
                <Polyline 
                  positions={coordenadas} 
                  color="#3498db" 
                  weight={4}
                  opacity={0.7}
                />
              )}
              
              {/* Marcadores con ícono personalizado */}
              {coordenadas.map((coord, index) => (
                <Marker 
                  key={index} 
                  position={coord}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="popup-content">
                      <strong>Punto {index + 1}</strong>
                      <p>{encuentros[index]?.lugar || 'Ubicación desconocida'}</p>
                      <p>Fecha: {formatDate(encuentros[index]?.fecha)}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            {!mapReady && (
              <div className="map-loading-overlay">
                <div className="spinner"></div>
                <p>Cargando mapa...</p>
              </div>
            )}
            
            <div className="route-info">
              <div className="info-card">
                <h4>Resumen de Ruta</h4>
                <p><strong>Puntos mapeados:</strong> {coordenadas.length}</p>
                <p><strong>Primer encuentro:</strong> {formatDate(encuentros[0]?.fecha)}</p>
                <p><strong>Último encuentro:</strong> {formatDate(encuentros[encuentros.length - 1]?.fecha)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerPersonaEnMovilidad;