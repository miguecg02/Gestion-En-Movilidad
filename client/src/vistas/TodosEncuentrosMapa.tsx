import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const API_BASE_URL = 'http://localhost:3001/api';

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

const TodosEncuentrosMapa = () => {
  const { nombre, apellido } = useParams();
  const navigate = useNavigate();
  const [encuentros, setEncuentros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchEncuentros = async () => {
    try {
      if (!nombre || !apellido) {
        setError('Nombre y apellido son requeridos');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/personas/encuentros-por-nombre?nombre=${encodeURIComponent(nombre)}&apellido=${encodeURIComponent(apellido)}`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Filtrar encuentros con coordenadas válidas
      const encuentrosValidos = data.filter((encuentro: any) => 
        encuentro.latitud && encuentro.longitud &&
        !isNaN(parseFloat(encuentro.latitud)) && 
        !isNaN(parseFloat(encuentro.longitud))
      );
      
      setEncuentros(encuentrosValidos);
      
    } catch (error) {
      console.error('Error al obtener encuentros:', error);
      setError('No se pudieron cargar los encuentros');
    } finally {
      setLoading(false);
    }
  };

  fetchEncuentros();
}, [nombre, apellido]);

  if (loading) {
    return <div className="loading">Cargando encuentros...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <button onClick={() => navigate(-1)}>Volver</button>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (encuentros.length === 0) {
    return (
      <div className="no-data-container">
        <button onClick={() => navigate(-1)}>Volver</button>
        <h2>Encuentros de {nombre} {apellido}</h2>
        <p>No se encontraron encuentros con coordenadas válidas</p>
      </div>
    );
  }

  // Calcular centro del mapa basado en los encuentros
  const centerLat = encuentros.reduce((sum, e) => sum + parseFloat(e.latitud), 0) / encuentros.length;
  const centerLng = encuentros.reduce((sum, e) => sum + parseFloat(e.longitud), 0) / encuentros.length;

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ 
        padding: '10px', 
        background: '#fff', 
        zIndex: 1000, 
        position: 'absolute',
        top: '10px',
        left: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: '10px' }}>
          ← Volver
        </button>
        <span style={{ fontWeight: 'bold' }}>
          Encuentros de {nombre} {apellido}
        </span>
      </div>
      
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {encuentros.map((encuentro, index) => (
          <Marker 
            key={index}
            position={[parseFloat(encuentro.latitud), parseFloat(encuentro.longitud)]}
            icon={customIcon}
          >
            <Popup>
              <div>
                <strong>{encuentro.Nombre} {encuentro.PrimerApellido}</strong>
                <p><strong>Lugar:</strong> {encuentro.lugar}</p>
                <p><strong>Fecha:</strong> {new Date(encuentro.Fecha).toLocaleDateString()}</p>
                <p><strong>Observaciones:</strong> {encuentro.Observaciones}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TodosEncuentrosMapa;