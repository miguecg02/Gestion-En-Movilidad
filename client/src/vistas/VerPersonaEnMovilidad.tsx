import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../AuthContext';
import './VerPersonaEnMovilidad.css';

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

const fieldLabels: Record<string, string> = {
  Nombre: 'Nombre',
  PrimerApellido: 'Primer Apellido',
  SegundoApellido: 'Segundo Apellido',
  Estado: 'Estado',
  MensajeFamiliares: 'Mensaje a Familiares',
  Necesidades: 'Necesidades',
  DescripcionFisica: 'Descripción Física',
  TrabajadorHogar: 'Trabajador Hogar',
  TrabajadorCampo: 'Trabajador Campo',
  SituacionCalle: 'Situación Calle',
  LocalidadOrigen: 'Localidad Origen',
  PaisDestino: 'País Destino',
  EstadoDestino: 'Estado Destino',
  LocalidadDestino: 'Localidad Destino',
  PuntoEntradaMex: 'Punto Entrada México',
  PuntoEntradaUSA: 'Punto Entrada USA',
  Nacionalidad: 'Nacionalidad',
  FechaNacimiento: 'Fecha Nacimiento',
  EstadoCivil: 'Estado Civil',
  ViajaConIdentificacion: 'Viaja con Identificación',
  Identificacion: 'Identificación',
  UltimoDomicilio: 'Último Domicilio',
  IdiomaMaterno: 'Idioma Materno',
  HablaEspanol: 'Habla Español',
  OtrosIdiomas: 'Otros Idiomas',
  OtrosIdiomasCual: 'Otros Idiomas (Especifique)',
  Profesion: 'Profesión',
  EdadMigracion: 'Edad Migración',
  AnoComienzoMigracion: 'Año Comienzo Migración',
  Motivo: 'Motivo',
  NumeroMigraciones: 'Número Migraciones',
  RelatoDesaparicion: 'Relato Desaparición',
  PaisPerdidaContacto: 'País Pérdida Contacto',
  EstadoPerdidaContacto: 'Estado Pérdida Contacto',
  LocalidadPerdidaContacto: 'Localidad Pérdida Contacto',
  FechaUltimaComunicacion: 'Fecha Última Comunicación',
  ConfirmacionEntradaPunto: 'Confirmación Entrada Punto',
  Sexo: 'Sexo',
  Genero: 'Género',
  OtroSexoLibre: 'Otro Sexo (Libre)',
  HayDenuncia: 'Hay Denuncia',
  HayDenunciaCual: 'Denuncia (Especifique)',
  HayReporte: 'Hay Reporte',
  HayReporteCual: 'Reporte (Especifique)',
  AvancesDenuncia: 'Avances Denuncia',
  AvancesDenunciaCual: 'Avances Denuncia (Especifique)',
  LugaresBusqueda: 'Lugares Búsqueda',
  NombreQuienBusca: 'Nombre Quien Busca',
  ApellidoPaternoQuienBusca: 'Apellido Paterno Quien Busca',
  ApellidoMaternoQuienBusca: 'Apellido Materno Quien Busca',
  ParentescoQuienBusca: 'Parentesco Quien Busca',
  DireccionQuienBusca: 'Dirección Quien Busca',
  TelefonoQuienBusca: 'Teléfono Quien Busca',
  CorreoElectronicoQuienBusca: 'Email Quien Busca',
  MensajeQuienBusca: 'Mensaje Quien Busca',
  InformacionUsadaPara: 'Información Usada Para',
  InformacionPublica: 'Información Pública',
  Institucion: 'Institución',
  Cargo: 'Cargo',
  PersonaUltimaComunicacion: 'Persona Última Comunicación',
  DeportadaAnteriormente: 'Deportada Anteriormente',
  PaisDeportacion: 'País Deportación',
  FechaUltimaDeportacion: 'Fecha Última Deportación',
  Encarcelado: 'Encarcelado',
  UbicacionCarcel: 'Ubicación Cárcel',
  FechaDetencion: 'Fecha Detención',
  IdentificacionDetencionEEUU: 'Identificación Detención EEUU',
  PapelesFalsos: 'Papeles Falsos',
  PapelesFalsosCual: 'Papeles Falsos (Especifique)',
  AcompañantesViaje: 'Acompañantes Viaje',
  ConocidosEnExtranjero: 'Conocidos en Extranjero',
  Estatura: 'Estatura (cm)',
  Peso: 'Peso (kg)',
  Complexion: 'Complexión',
  ColorPiel: 'Color Piel',
  VelloFacial: 'Vello Facial',
  VelloFacialCual: 'Vello Facial (Especifique)',
  Lentes: 'Usa Lentes',
  Cabello: 'Cabello',
  Embarazada: 'Embarazada',
  MesesEmbarazo: 'Meses Embarazo',
  NumeroCelular: 'Número Celular',
  SeñalesParticulares: 'Señales Particulares',
  Lesiones: 'Lesiones',
  TipoDientes: 'Tipo Dientes',
  EstadoSalud: 'Estado Salud',
  DescripcionPrendas: 'Descripción Prendas',
  RedesSociales: 'Redes Sociales',
  Situacion: 'Situación',
  Edad: 'Edad',
};
// URL base de la API 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Definir interfaces para los tipos de datos
interface GrupoInfo {
  idGrupo: number;
  NombreGrupo: string;
  FechaCreacion: string;
  NombreEncargado: string;
  LugarCreacion: string;
  integrantes: Integrante[];
}

interface Integrante {
  idPersona: number;
  Nombre: string;
  PrimerApellido: string;
  Imagen: string | null;
}

// Función para formatear nombres de campos con espacios
const formatLabel = (key: string) => {
  return fieldLabels[key] || key
    .replace(/([A-Z])/g, ' $1') // Agrega espacio antes de mayúsculas
    .replace(/^./, str => str.toUpperCase()) // Primera letra mayúscula
    .trim();
};

const VerPersonaEnMovilidad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<any>(null);
  const [encuentros, setEncuentros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [grupoInfo, setGrupoInfo] = useState<GrupoInfo | null>(null);
  const { user } = useAuth(); // Obtener información del usuario

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
        } else {
          personaData.Edad = 'N/A';
        }
        
        setPersona(personaData);
        
        // 2. Obtener encuentros asociados a la persona
        const encuentrosResponse = await fetch(`${API_BASE_URL}/personas/${id}/encuentros`);
        
        if (!encuentrosResponse.ok) {
          if (encuentrosResponse.status === 404) {
            setEncuentros([]);
          } else {
            throw new Error('Error al obtener encuentros');
          }
        } else {
          const encuentrosData = await encuentrosResponse.json();
          setEncuentros(encuentrosData);
        }
        
        // 3. Obtener información del grupo si existe
        if (personaData.idGrupo) {
          const grupoResponse = await fetch(`${API_BASE_URL}/personas/grupo/${personaData.idGrupo}`);
          
          if (grupoResponse.ok) {
            const grupoData = await grupoResponse.json();
            setGrupoInfo(grupoData);
          }
        }
        
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
          
          <div>
            <h2>{persona.Nombre} {persona.PrimerApellido}</h2>
            <span className={`status-badge ${persona.Situacion.toLowerCase().replace(' ', '-')}`}>
              {persona.Situacion}
            </span>
          </div>
        </div>
        
        <div className="info-grid">
          {Object.entries(persona)
            .filter(([key]) => !['Imagen', 'idPersona', 'idEntrevistador', 'idGrupo', 'grupoInfo'].includes(key))
            .map(([key, value]) => {
              // Formatear fechas
              if (typeof value === 'string' && value.includes('-') && key.toLowerCase().includes('fecha')) {
                value = formatDate(value);
              }
              
              // Convertir booleanos a texto
              if (typeof value === 'boolean') {
                value = value ? 'Sí' : 'No';
              }
              
              // Manejar valores vacíos
              if (value === null || value === undefined || value === '' || value === 0) {
                value = 'N/A';
              }
              
              // Omitir campos con valor 'N/A'
              if (value === 'N/A') return null;
              
              return (
                <div className="info-item" key={key}>
                  <span className="info-label">{formatLabel(key) +":" + " " }</span>
                  <span className="info-value">{String(value) }</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Sección de información del grupo */}
      {grupoInfo && (
        <div className="grupo-section">
          <div className="section-header">
            <h2>Grupo: {grupoInfo.NombreGrupo}</h2>
            <div className="stats-badge">
              {grupoInfo.integrantes.length} miembro{grupoInfo.integrantes.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="grupo-details">
            <p><strong>Encargado:</strong> {grupoInfo.NombreEncargado || 'N/A'}</p>
            <p><strong>Lugar de creación:</strong> {grupoInfo.LugarCreacion || 'N/A'}</p>
            <p><strong>Fecha de creación:</strong> {formatDate(grupoInfo.FechaCreacion)}</p>
          </div>
          
          <h3>Integrantes del grupo:</h3>
          <div className="integrantes-grid">
            {grupoInfo.integrantes.map(integrante => (
              <div key={integrante.idPersona} className="integrante-card">
                {integrante.Imagen ? (
                  <img 
                    src={integrante.Imagen} 
                    alt={`${integrante.Nombre} ${integrante.PrimerApellido}`}
                    className="integrante-imagen"
                  />
                ) : (
                  <div className="integrante-icon">👤</div>
                )}
                <div className="integrante-info">
                  <h4>{integrante.Nombre} {integrante.PrimerApellido}</h4>
                  <button 
                    onClick={() => navigate(`/verEnMovilidad/${integrante.idPersona}`)}
                    className="btn-ver-integrante"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

        {/* Botón para ver todos los encuentros (solo coordinadores) */}
        {user?.rol === 'Coordinador' && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              onClick={() => navigate(`/todos-encuentros/${persona.Nombre}/${persona.PrimerApellido}`)}
              className="btn-ver-todos"
            >
              Ver todos los encuentros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerPersonaEnMovilidad;