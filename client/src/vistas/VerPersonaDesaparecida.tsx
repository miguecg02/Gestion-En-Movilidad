// VerPersonaDesaparecida.tsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './VerPersonaEnMovilidad.css';
const API_URL = import.meta.env.VITE_API_URL;

// Configurar ícono personalizado para Leaflet
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

// Interfaces para tipos de datos
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

const VerPersonaDesaparecida = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [coordenadas, setCoordenadas] = useState<[number, number] | null>(null);
  const [encuentros, setEncuentros] = useState<any[]>([]);
  const [grupoInfo, setGrupoInfo] = useState<GrupoInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Obtener datos de la persona
        const response = await fetch(`${API_URL}/api/personas/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Persona no encontrada');
          }
          throw new Error('Error al obtener datos de la persona');
        }
        
        const personaData = await response.json();
        setPersona(personaData);
        
        // Obtener información del grupo si existe
        if (personaData.idGrupo) {
          const grupoResponse = await fetch(
           `${API_URL}/api/personas/grupo/${personaData.idGrupo}`
          );
          
          if (grupoResponse.ok) {
            const grupoData = await grupoResponse.json();
            setGrupoInfo(grupoData);
          }
        }
        
        // Obtener encuentros por nombre y apellido
        const encuentrosResponse = await fetch(
          `${API_URL}/api/personas/encuentros-por-nombre?nombre=${encodeURIComponent(personaData.Nombre)}&apellido=${encodeURIComponent(personaData.PrimerApellido)}`
        );
        
        if (encuentrosResponse.ok) {
          const encuentrosData = await encuentrosResponse.json();
          setEncuentros(encuentrosData);
        }
        
        // Geocodificación para obtener coordenadas de pérdida de contacto
        if (personaData.PaisPerdidaContacto || personaData.EstadoPerdidaContacto || personaData.LocalidadPerdidaContacto) {
          await obtenerCoordenadas(personaData);
        }
        
      } catch (err: any) {
        console.error('Error al obtener datos:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const obtenerCoordenadas = async (personaData: any) => {
    try {
      // Construir dirección para geocodificación
      const direccion = [
        personaData.LocalidadPerdidaContacto,
        personaData.EstadoPerdidaContacto,
        personaData.PaisPerdidaContacto
      ].filter(Boolean).join(', ');

      if (!direccion) return;

      // Usar Nominatim para geocodificación
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setCoordenadas([parseFloat(lat), parseFloat(lon)]);
        }
      }
    } catch (error) {
      console.error('Error en geocodificación:', error);
    }
  };

  // Procesar coordenadas de encuentros
  const coordenadasEncuentros = useMemo(() => {
    return encuentros
      .filter(e => e.latitud && e.longitud)
      .map(e => {
        const lat = parseFloat(e.latitud);
        const lng = parseFloat(e.longitud);
        return !isNaN(lat) && !isNaN(lng) ? [lat, lng] : null;
      })
      .filter(coord => coord !== null) as [number, number][];
  }, [encuentros]);

  const formatLabel = (key: string) => {
    return fieldLabels[key] || key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

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
        <h1>Detalle de Persona Desaparecida</h1>
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
            <span className={`status-badge desaparecida`}>
              {persona.Situacion}
            </span>
          </div>
        </div>
        
        <div className="info-grid">
          {Object.entries(persona)
            .filter(([key, value]) => 
              !['Imagen', 'idPersona', 'idEntrevistador', 'idGrupo', 'grupoInfo'].includes(key) &&
              value !== null && value !== undefined && value !== '' && value !== 'N/A' && value !== 0
            )
            .map(([key, value]) => {
              // Formatear fechas
              if (typeof value === 'string' && value.includes('-') && key.toLowerCase().includes('fecha')) {
                value = formatDate(value);
              }
              
              // Convertir booleanos a texto
              if (typeof value === 'boolean') {
                value = value ? 'Sí' : 'No';
              }
              
              return (
                <div className="info-item" key={key}>
                  <span className="info-label">{formatLabel(key)}:</span>
                  <span className="info-value">{String(value)}</span>
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
                    onClick={() => navigate(`/verDesaparecida/${integrante.idPersona}`)}
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

      {/* Mapa de ubicación de pérdida de contacto y encuentros */}
      <div className="map-section">
        <div className="section-header">
          <h2>Ubicación de Pérdida de Contacto y Encuentros Relacionados</h2>
          <div className="stats-badge">
            {encuentros.length} encuentro{encuentros.length !== 1 ? 's' : ''} relacionado{encuentros.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {!coordenadas && coordenadasEncuentros.length === 0 ? (
          <div className="no-data-message">
            <div className="map-placeholder">🗺️</div>
            <p>No se encontraron datos de ubicación para esta persona</p>
          </div>
        ) : (
          <div className="map-container">
            <MapContainer 
              center={coordenadas || (coordenadasEncuentros.length > 0 ? coordenadasEncuentros[0] : [0, 0])} 
              zoom={12} 
              style={{ height: '500px', width: '100%' }}
              whenReady={() => setTimeout(() => setMapReady(true), 100)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Marcador de ubicación de pérdida de contacto */}
              {coordenadas && (
                <Marker position={coordenadas} icon={customIcon}>
                  <Popup>
                    <div className="popup-content">
                      <strong>Ubicación de pérdida de contacto</strong>
                      <p>{persona.LocalidadPerdidaContacto || 'Ubicación desconocida'}</p>
                      <p>Fecha: {formatDate(persona.FechaUltimaComunicacion)}</p>
                    </div>
                  </Popup>
                </Marker>
              )}
              
              {/* Marcadores de encuentros */}
              {coordenadasEncuentros.map((coord, index) => {
                const encuentro = encuentros[index];
                return (
                  <Marker 
                    key={index} 
                    position={coord}
                    icon={customIcon}
                  >
                    <Popup>
                      <div className="popup-content">
                        <strong>Encuentro registrado</strong>
                        <p><strong>Lugar:</strong> {encuentro.lugar || 'Ubicación desconocida'}</p>
                        <p><strong>Fecha:</strong> {formatDate(encuentro.Fecha)}</p>
                        <p><strong>Observaciones:</strong> {encuentro.Observaciones}</p>
                        <p><strong>Situación:</strong> {encuentro.Situacion || 'En Movilidad'}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
            
            <div className="location-info">
              <h3>Información de ubicación</h3>
              <p><strong>País:</strong> {persona.PaisPerdidaContacto || 'N/A'}</p>
              <p><strong>Estado:</strong> {persona.EstadoPerdidaContacto || 'N/A'}</p>
              <p><strong>Localidad:</strong> {persona.LocalidadPerdidaContacto || 'N/A'}</p>
              <p><strong>Fecha última comunicación:</strong> {formatDate(persona.FechaUltimaComunicacion)}</p>
              
              <div className="encuentros-info">
                <h4>Encuentros Relacionados</h4>
                <p>Se han encontrado {encuentros.length} encuentros registrados para personas con el mismo nombre y apellido.</p>
                {encuentros.length > 0 && (
                  <button 
                    onClick={() => navigate(`/todos-encuentros/${persona.Nombre}/${persona.PrimerApellido}`)}
                    className="btn-ver-todos"
                  >
                    Ver todos los encuentros en detalle
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerPersonaDesaparecida;