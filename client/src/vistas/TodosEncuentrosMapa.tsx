// Update the component to handle disappearance location
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '@/AuthContext';

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

// Add a different icon for disappearance locations
const disappearanceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
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
  const [desaparecidos, setDesaparecidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!nombre || !apellido) {
          setError('Nombre y apellido son requeridos');
          setLoading(false);
          return;
        }

        // Fetch encounters
        const response = await fetch(
          `${API_BASE_URL}/personas/encuentros-por-nombre-completo?nombre=${encodeURIComponent(nombre)}&apellido=${encodeURIComponent(apellido)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
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
        
        // Extract unique disappeared persons with disappearance location
        const desaparecidosMap = new Map();
        data.forEach((item: any) => {
          if (item.Situacion === 'Desaparecida' && 
              (item.PaisPerdidaContacto || item.EstadoPerdidaContacto || item.LocalidadPerdidaContacto)) {
            const key = `${item.Nombre}-${item.PrimerApellido}`;
            if (!desaparecidosMap.has(key)) {
              desaparecidosMap.set(key, {
                Nombre: item.Nombre,
                PrimerApellido: item.PrimerApellido,
                PaisPerdidaContacto: item.PaisPerdidaContacto,
                EstadoPerdidaContacto: item.EstadoPerdidaContacto,
                LocalidadPerdidaContacto: item.LocalidadPerdidaContacto
              });
            }
          }
        });
        
        setDesaparecidos(Array.from(desaparecidosMap.values()));
        
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('No se pudieron cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nombre, apellido]);

  // Function to geocode a location (simplified version)
  const geocodeLocation = async (location: string) => {
    // In a real implementation, you would use a geocoding service here
    // This is a simplified version that returns mock coordinates
    return {
      lat: 19.4326 + (Math.random() * 0.1 - 0.05), // Mock coordinates around Mexico City
      lng: -99.1332 + (Math.random() * 0.1 - 0.05)
    };
  };

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

  // Calculate center based on encounters
  let centerLat = 19.4326; // Default to Mexico City
  let centerLng = -99.1332;
  
  if (encuentros.length > 0) {
    centerLat = encuentros.reduce((sum, e) => sum + parseFloat(e.latitud), 0) / encuentros.length;
    centerLng = encuentros.reduce((sum, e) => sum + parseFloat(e.longitud), 0) / encuentros.length;
  }

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
            key={`encuentro-${index}`}
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
        
        {/* Add markers for disappearance locations */}
        {desaparecidos.map((desaparecido, index) => (
          <Marker 
            key={`desaparecido-${index}`}
            position={[19.4326 + (index * 0.01), -99.1332 + (index * 0.01)]} // Mock positions
            icon={disappearanceIcon}
          >
            <Popup>
              <div>
                <strong>{desaparecido.Nombre} {desaparecido.PrimerApellido}</strong>
                <p><strong>Ubicación de desaparición:</strong></p>
                <p>{desaparecido.LocalidadPerdidaContacto}, {desaparecido.EstadoPerdidaContacto}, {desaparecido.PaisPerdidaContacto}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TodosEncuentrosMapa;