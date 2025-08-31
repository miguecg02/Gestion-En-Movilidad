import React, { useState, useMemo, useCallback, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './FormularioEnMovilidad.css';
import { useEffect } from 'react';
import { useEncuentro } from './EncuentroContext';
import { useAuth } from '../AuthContext';
import { API_URL } from "../config";

type FormData = {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Estado: string;
  Imagen: string;
  MensajeFamiliares: string;
  Necesidades: string;
  DescripcionFisica: string;
  TrabajadorHogar: string;
  TrabajadorCampo: string;
  SituacionCalle: string;
  LocalidadOrigen: string;
  PaisDestino: string;
  EstadoDestino: string;
  LocalidadDestino: string;
  PuntoEntradaMex: string;
  PuntoEntradaUSA: string;
  Nacionalidad: string;
  FechaNacimiento: Date | null;                 
  EstadoCivil: string;
  ViajaConIdentificacion: string;
  Identificacion: string;
  UltimoDomicilio: string;
  IdiomaMaterno: string;
  HablaEspanol: string;
  OtrosIdiomas: string;
  OtrosIdiomasCual: string;
  Profesion: string;
  EdadMigracion: number;
  AnoComienzoMigracion: string;          
  Motivo: string;
  NumeroMigraciones: number;        
  ConfirmacionEntradaPunto: string;
  Sexo: string;
  Genero: string;
  OtroSexoLibre: string;
  InformacionUsadaPara: string;
  InformacionPublica: string;
  Institucion: string;
  Cargo: string;
  PersonaUltimaComunicacion: string;
  DeportadaAnteriormente: string;
  PaisDeportacion: string;
  FechaUltimaDeportacion: Date  | null;          
  Encarcelado: string;
  UbicacionCarcel: string;
  FechaDetencion: Date  | null;                  
  IdentificacionDetencionEEUU: string;
  PapelesFalsos: string;
  PapelesFalsosCual: string;
  AcompañantesViaje: string;
  ConocidosEnExtranjero: string;
  Estatura: number;
  Peso: number;
  Complexion: string;
  ColorPiel: string;
  VelloFacial: string;
  VelloFacialCual: string;
  Lentes: string;
  Cabello: string;
  Embarazada: string;
  MesesEmbarazo: number;
  NumeroCelular: string;
  SeñalesParticulares: string;
  Lesiones: string;
  TipoDientes: string;
  EstadoSalud: string;
  DescripcionPrendas: string;
  RedesSociales: string;
};

const etiquetas: Record<keyof FormData, string> = {
  Nombre: 'Nombre',
  PrimerApellido: 'Primer Apellido',
  SegundoApellido: 'Segundo Apellido',
  Estado: 'Estado',
  Imagen: 'Imagen',
  MensajeFamiliares: 'Mensaje a familiares',
  Necesidades: 'Necesidades',
  DescripcionFisica: 'Descripción física',
  TrabajadorHogar: '¿Trabajaba en el hogar?',
  TrabajadorCampo: '¿Trabajaba en el campo?',
  SituacionCalle: '¿Vivía en situación de calle?',
  LocalidadOrigen: 'Localidad de origen',
  PaisDestino: 'País de destino',
  EstadoDestino: 'Estado de destino',
  LocalidadDestino: 'Localidad / municipio / condado de destino',
  PuntoEntradaMex: 'Punto de entrada a México',
  PuntoEntradaUSA: 'Punto de entrada a EE. UU.',
  Nacionalidad: 'Nacionalidad',
  FechaNacimiento: 'Fecha de nacimiento',
  EstadoCivil: 'Estado civil',
  ViajaConIdentificacion: '¿Viaja con identificación?',
  Identificacion: 'Tipo de identificación',
  UltimoDomicilio: 'Último domicilio',
  IdiomaMaterno: 'Idioma materno',
  HablaEspanol: '¿Habla español?',
  OtrosIdiomas: '¿Habla otros idiomas?',
  OtrosIdiomasCual: '¿Cuáles otros idiomas?',
  Profesion: 'Profesión',
  EdadMigracion: 'Edad al migrar',
  AnoComienzoMigracion: 'Año de inicio de migración',
  Motivo: 'Motivo de migración',
  NumeroMigraciones: 'Número de migraciones',
  ConfirmacionEntradaPunto: 'Confirmación del punto de entrada',
  Sexo: 'Sexo',
  Genero: 'Género',
  OtroSexoLibre: 'Otro sexo (especifique)',
  InformacionUsadaPara: 'Información usada para',
  InformacionPublica: '¿Información será pública?',
  Institucion: 'Institución',
  Cargo: 'Cargo',
  PersonaUltimaComunicacion: 'Persona de la última comunicación',
  DeportadaAnteriormente: '¿Fue deportado(a) anteriormente?',
  PaisDeportacion: 'País de deportación',
  FechaUltimaDeportacion: 'Fecha de última deportación',
  Encarcelado: '¿Ha estado encarcelado(a)?',
  UbicacionCarcel: 'Ubicación de la cárcel',
  FechaDetencion: 'Fecha de detención',
  IdentificacionDetencionEEUU: 'ID de detención en EE. UU.',
  PapelesFalsos: '¿Usó papeles falsos?',
  PapelesFalsosCual: '¿Qué papeles falsos?',
  AcompañantesViaje: 'Acompañantes en el viaje',
  ConocidosEnExtranjero: 'Conocidos en el extranjero',
  Estatura: 'Estatura (cm)',
  Peso: 'Peso (kg)',
  Complexion: 'Complexión',
  ColorPiel: 'Color de piel',
  VelloFacial: '¿Tiene vello facial?',
  VelloFacialCual: 'Tipo de vello facial',
  Lentes: '¿Usa lentes?',
  Cabello: 'Cabello',
  Embarazada: '¿Está embarazada?',
  MesesEmbarazo: 'Meses de embarazo',
  NumeroCelular: 'Número de celular',
  SeñalesParticulares: 'Señales particulares',
  Lesiones: 'Lesiones',
  TipoDientes: 'Tipo de dientes',
  EstadoSalud: 'Estado de salud',
  DescripcionPrendas: 'Descripción de prendas',
  RedesSociales: 'Redes sociales'
};

const initialFormData: FormData = {
  Nombre: '',
  PrimerApellido: '',
  SegundoApellido: '',
  Estado: '',
  Imagen: '',
  MensajeFamiliares: '',
  Necesidades: '',
  DescripcionFisica: '',
  TrabajadorHogar: '',
  TrabajadorCampo: '',
  SituacionCalle: '',
  LocalidadOrigen: '',
  PaisDestino: '',
  EstadoDestino: '',
  LocalidadDestino: '',
  PuntoEntradaMex: '',
  PuntoEntradaUSA: '',
  Nacionalidad: '',
  FechaNacimiento: null,
  EstadoCivil: '',
  ViajaConIdentificacion: '',
  Identificacion: '',
  UltimoDomicilio: '',
  IdiomaMaterno: '',
  HablaEspanol: '',
  OtrosIdiomas: '',
  OtrosIdiomasCual: '',
  Profesion: '',
  EdadMigracion: 0,
  AnoComienzoMigracion: '',
  Motivo: '',
  NumeroMigraciones: 0,
  ConfirmacionEntradaPunto: '',
  Sexo: '',
  Genero: '',
  OtroSexoLibre: '',
  InformacionUsadaPara: '',
  InformacionPublica: '',
  Institucion: '',
  Cargo: '',
  PersonaUltimaComunicacion: '',
  DeportadaAnteriormente: '',
  PaisDeportacion: '',
  FechaUltimaDeportacion: null,
  Encarcelado: '',
  UbicacionCarcel: '',
  FechaDetencion: null,
  IdentificacionDetencionEEUU: '',
  PapelesFalsos: '',
  PapelesFalsosCual: '',
  AcompañantesViaje: '',
  ConocidosEnExtranjero: '',
  Estatura: 0,
  Peso: 0,
  Complexion: '',
  ColorPiel: '',
  VelloFacial: '',
  VelloFacialCual: '',
  Lentes: '',
  Cabello: '',
  Embarazada: '',
  MesesEmbarazo: 0,
  NumeroCelular: '',
  SeñalesParticulares: '',
  Lesiones: '',
  TipoDientes: '',
  EstadoSalud: '',
  DescripcionPrendas: '',
  RedesSociales: ''
};



// Componentes reutilizables (TextField, RadioGroup, etc.)
interface TextFieldProps {
  name: keyof FormData;
  formData: FormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  type?: string;
  rows?: number;
  disabled?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({ 
  name, 
  formData, 
  handleChange, 
  type = 'text', 
  rows = 1,
  disabled = false
}) => {
  const isTextarea = rows > 1;
  const isFileInput = type === 'file';
  
  if (isFileInput) {
    return (
      <div className="form-field">
        <label htmlFor={name}>{etiquetas[name]}</label>
        <input 
          id={name}
          name={name}
          type="file"
          accept="image/*"
          onChange={async (e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result) {
                  handleChange({
                    target: {
                      name,
                      value: event.target.result as string
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              };
              reader.readAsDataURL(file);
            }
          }}
          disabled={disabled}
        />
        {formData[name] && (
          <div className="image-preview">
            <img src={formData[name] as string} alt="Preview" />
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="form-field">
      <label htmlFor={name}>{etiquetas[name]}</label>
      {isTextarea ? (
        <textarea 
          id={name} 
          name={name} 
          rows={rows} 
          value={formData[name] as string} 
          onChange={handleChange}
          disabled={disabled}
        />
      ) : (
        <input 
          id={name} 
          name={name} 
          type={type} 
          value={formData[name] as any} 
          onChange={handleChange}
          disabled={disabled}
        />
      )}
    </div>
  );
};

interface RadioGroupProps {
  name: keyof FormData;
  formData: FormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  options?: string[];
}

const RadioGroup: React.FC<RadioGroupProps> = ({ 
  name, 
  formData, 
  handleChange, 
  options = ['Sí', 'No'] 
}) => {
  return (
    <div className="form-field radio-group">
      <label>{etiquetas[name]}</label>
      <div className="radio-options">
        {options.map(opt => (
          <label key={opt} className="radio-option">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={formData[name] === opt}
              onChange={handleChange}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

interface SelectFieldProps {
  name: keyof FormData;
  formData: FormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  fetchOptions?: () => Promise<{ value: string; label: string }[]>;
}

const SelectField: React.FC<SelectFieldProps> = ({ 
  name, 
  formData, 
  handleChange, 
  options = [], 
  disabled = false,
  fetchOptions
}) => {
  const [loadedOptions, setLoadedOptions] = useState<{ value: string; label: string }[]>(options);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fetchOptions) {
      setIsLoading(true);
      fetchOptions()
        .then(data => {
          setLoadedOptions(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [fetchOptions]);

  return (
    <div className="form-field">
      <label htmlFor={name}>{etiquetas[name]}</label>
      <select 
        id={name} 
        name={name} 
        value={formData[name] as string} 
        onChange={handleChange}
        disabled={disabled || isLoading}
      >
        <option value="">Seleccione...</option>
        {isLoading ? (
          <option value="" disabled>Cargando...</option>
        ) : (
          loadedOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))
        )}
      </select>
    </div>
  );
};

interface DateFieldProps {
  name: keyof FormData;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  disabled?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({ name, formData, setFormData, disabled = false }) => {
  const dateValue = formData[name] instanceof Date ? 
    (formData[name] as Date).toISOString().slice(0, 10) : 
    '';

  return (
    <div className="form-field">
      <label htmlFor={name}>{etiquetas[name]}</label>
      <input
        type="date"
        id={name}
        name={name}
        value={dateValue}
        onChange={e => {
          const value = e.target.value;
          setFormData(prev => ({
            ...prev,
            [name]: value ? new Date(value) : null
          }));
        }}
        disabled={disabled}
      />
    </div>
  );
};


type GrupoData = {
  NombreGrupo: string;
  FechaCreacion: Date;
  NombreEncargado: string;
  LugarCreacion: string;
};
// Componente principal
const FormularioEnMovilidad: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [expanded, setExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { encuentroActivo } = useEncuentro();
  const { user } = useAuth();
   const [mostrarFormGrupo, setMostrarFormGrupo] = useState(false);
  const [grupoActivo, setGrupoActivo] = useState<GrupoData | null>(null);
  const [idGrupoActual, setIdGrupoActual] = useState<number | null>(null);
  const [modoGrupo, setModoGrupo] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Verificar encuentro activo
  useEffect(() => {
    if (!encuentroActivo) {
      setError('Debes iniciar un encuentro antes de registrar personas');
    } else {
      setError(null);
    }
  }, [encuentroActivo]);

  // Iniciar la cámara
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (err) {
    console.error("Error al acceder a la cámara", err);
    setError("No se pudo acceder a la cámara. Asegúrese de permitir el acceso.");
  }
};

// Detener la cámara
const stopCamera = () => {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }
};

// Capturar imagen
const captureImage = () => {
  if (videoRef.current) {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      setFormData(prev => ({ ...prev, Imagen: imageData }));
      setShowCamera(false);
    }
  }
};

useEffect(() => {
  if (showCamera) {
    startCamera();
  } else {
    stopCamera();
  }
  
  return () => {
    stopCamera();
  };
}, [showCamera]);

  // Fetch funciones
  const fetchNacionalidades = async () => {
    try {
      const response = await fetch(`${API_URL}/api/personas/naciones/listado`);
      const data = await response.json();
      return data.map((nacion: any) => ({
        value: nacion.idNacionalidad,
        label: nacion.nacionalidad
      }));
    } catch (error) {
      console.error('Error al cargar nacionalidades:', error);
      return [];
    }
  };

  const fetchEstados = useCallback(async (): Promise<{value:string;label:string;}[]> => {
    if (formData.PaisDestino === 'México') {
      const res = await fetch(`${API_URL}/api/personas/entidades/listado?idNacionalidad=1`);
      const data: { nombre: string }[] = await res.json();
      return data.map(e => ({ value: e.nombre, label: e.nombre }));
    }
    if (formData.PaisDestino === 'Estados Unidos') {
      const res = await fetch(`${API_URL}/api/personas/entidades/listado?idNacionalidad=2`);
      const data: { nombre: string }[] = await res.json();
      return data.map(e => ({ value: e.nombre, label: e.nombre }));
    }
    return [];
  }, [formData.PaisDestino]);

  const fetchLocalidades = useCallback(async (): Promise<{value:string;label:string;}[]> => {
    if (formData.PaisDestino === 'México') {
      const res = await fetch(`${API_URL}/api/personas/municipios/listado?idNacionalidad=1`);
      const data: { nombre: string }[] = await res.json();
      return data.map(e => ({ value: e.nombre, label: e.nombre }));
    }
    if (formData.PaisDestino === 'Estados Unidos') {
      const res = await fetch(`${API_URL}/api/personas/municipios/listado?idNacionalidad=2`);
      const data: { nombre: string }[] = await res.json();
      return data.map(e => ({ value: e.nombre, label: e.nombre }));
    }
    return [];
  }, [formData.PaisDestino]);

  const crearGrupo = async () => {
    if (!grupoActivo || !grupoActivo.NombreGrupo) {
      setError('Debe ingresar un nombre para el grupo');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/personas/grupos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grupoActivo)
      });

      if (!res.ok) throw new Error('Error al crear grupo');

      const data = await res.json();
      setIdGrupoActual(data.idGrupo);
      setModoGrupo(true);
      setMostrarFormGrupo(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  // Función para finalizar grupo
  const finalizarGrupo = () => {
    setIdGrupoActual(null);
    setModoGrupo(false);
    setGrupoActivo(null);
  };

  // Manejar cambios
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericFields: (keyof FormData)[] = ['EdadMigracion', 'NumeroMigraciones', 'Estatura', 'Peso', 'MesesEmbarazo'];

    if (numericFields.includes(name as keyof FormData)) {
      if (value === '' || /^\d+$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value === '' ? 0 : Number(value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Enviar formulario

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  // Validaciones básicas
  if (!formData.Nombre || !formData.PrimerApellido) {
    alert('Por favor, complete nombre y primer apellido.');
    return;
  }

  // Verificar encuentro activo y usuario
  if (!encuentroActivo || !user || !encuentroActivo.idPunto) {
    setError('Debes iniciar un encuentro antes de registrar personas');
    setIsSubmitting(false);
    return;
  }

  try {
    // 1. Registrar persona
    const personaRes = await fetch(`${API_URL}/api/personas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...formData, 
        Situacion: 'En Movilidad',
        idEntrevistador: user.id,
        idGrupo: idGrupoActual
      })
    });

    if (!personaRes.ok) {
      const errorData = await personaRes.json();
      throw new Error(errorData.error || 'Error al registrar persona');
    }

    const nuevaPersona = await personaRes.json();

    // 2. Registrar encuentro usando el punto geográfico del contexto
    const encuentroRes = await fetch(`${API_URL}/api/personas/encuentros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idPersona: nuevaPersona.idPersona,
        idEntrevistador: user.id,
        idPunto: encuentroActivo.idPunto, // Usar ID del punto del contexto
        observaciones: `Registro inicial - ${encuentroActivo.observaciones}`,
        fecha: new Date().toISOString()
      })
    });

    if (!encuentroRes.ok) {
      throw new Error('Error al registrar el encuentro asociado');
    }

    // Éxito - limpiar formulario
    setFormData(initialFormData);
    
    // Manejo de modo grupo
    if (modoGrupo) {
      alert('Persona agregada al grupo exitosamente');
    } else {
      alert('Persona registrada con éxito');
    }
    
  } catch (err) {
    console.error('Error en el registro:', err);
    setError(err instanceof Error ? err.message : 'Error desconocido');
  } finally {
    setIsSubmitting(false);
  }
};
   const renderFormGrupo = () => (
    <div className="grupo-form">
      <h3>Crear Nuevo Grupo</h3>
      
      <div className="form-field">
        <label>Nombre del Grupo</label>
        <input 
          type="text"
          value={grupoActivo?.NombreGrupo || ''}
          onChange={(e) => setGrupoActivo(prev => ({
            ...prev || {
              FechaCreacion: new Date(),
              NombreEncargado: '',
              LugarCreacion: ''
            },
            NombreGrupo: e.target.value
          }))}
        />
      </div>

      <div className="form-field">
        <label>Nombre del Encargado</label>
        <input 
          type="text"
          value={grupoActivo?.NombreEncargado || ''}
          onChange={(e) => setGrupoActivo(prev => ({
            ...prev || {
              FechaCreacion: new Date(),
              NombreGrupo: '',
              LugarCreacion: ''
            },
            NombreEncargado: e.target.value
          }))}
        />
      </div>

      <div className="form-field">
        <label>Lugar de Creación</label>
        <input 
          type="text"
          value={grupoActivo?.LugarCreacion || ''}
          onChange={(e) => setGrupoActivo(prev => ({
            ...prev || {
              FechaCreacion: new Date(),
              NombreGrupo: '',
              NombreEncargado: ''
            },
            LugarCreacion: e.target.value
          }))}
        />
      </div>

      <div className="form-buttons">
        <button 
          type="button" 
          onClick={crearGrupo}
          disabled={!grupoActivo?.NombreGrupo}
        >
          Crear Grupo
        </button>
        <button 
          type="button" 
          onClick={() => setMostrarFormGrupo(false)}
        >
          Cancelar
        </button>
      </div>
    </div>
  );


  // Campos básicos
  const basicFields: (keyof FormData)[] = [
    'Nombre', 'PrimerApellido', 'SegundoApellido', 'Nacionalidad', 
    'Imagen', 'PaisDestino', 'EstadoDestino'
  ];

  // Campos avanzados
  const advancedFields = useMemo(
    () => Object.keys(initialFormData).filter(
      key => !basicFields.includes(key as keyof FormData)
    ) as (keyof FormData)[],
    [basicFields]
  );

  // Render
  return (
    <div className="form-container">
      <h2 className="form-title">Añadir persona en movilidad</h2>
      
      {encuentroActivo && (
        <div className="encuentro-info">
          <h3>Encuentro Activo</h3>
          <p><strong>Ubicación:</strong> {encuentroActivo.ubicacion.latitud}, {encuentroActivo.ubicacion.longitud}</p>
          <p><strong>Observaciones:</strong> {encuentroActivo.observaciones}</p>
          <p><strong>Fecha:</strong> {new Date(encuentroActivo.fecha).toLocaleString()}</p>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}

      <div className="group-controls">
        {!modoGrupo && (
          <button 
            type="button"
            onClick={() => setMostrarFormGrupo(true)}
            disabled={mostrarFormGrupo || !encuentroActivo}
          >
            Añadir Grupo
          </button>
        )}
        
        {modoGrupo && (
          <div className="active-group">
            <span>Grupo activo: {grupoActivo?.NombreGrupo}</span>
            <button 
              type="button"
              onClick={finalizarGrupo}
            >
              Finalizar Grupo
            </button>
          </div>
        )}
      </div>

      {mostrarFormGrupo && renderFormGrupo()}

      <form onSubmit={handleSubmit} className="main-form">
        {/* Campos básicos */}
        <div className="basic-fields">
          {basicFields.map(field => {
            if (field === 'Nacionalidad') {
              return (
                <SelectField
                  key={field}
                  name={field}
                  formData={formData}
                  handleChange={handleChange}
                  fetchOptions={fetchNacionalidades}
                />
              );
            }
            
            if (field === 'PaisDestino') {
              return (
                <SelectField
                  key={field}
                  name={field}
                  formData={formData}
                  handleChange={handleChange}
                  options={[
                    { value: 'México', label: 'México' },
                    { value: 'Estados Unidos', label: 'Estados Unidos' },
                    { value: 'Otro', label: 'Otro' }
                  ]}
                />
              );
            }
            
            if (field === 'EstadoDestino') {
              return (
                <SelectField
                  key={field}
                  name={field}
                  formData={formData}
                  handleChange={handleChange}
                  fetchOptions={fetchEstados}
                  disabled={!['México', 'Estados Unidos'].includes(formData.PaisDestino)}
                />
              );
            }

              if (field === 'Imagen') {
              return (
                <div className="form-field" key={field}>
                  <label htmlFor={field}>{etiquetas[field]}</label>
                  <div className="image-upload-controls">
                    <input 
                      type="file"
                      id={field}
                      name={field}
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              handleChange({
                                target: {
                                  name: field,
                                  value: event.target.result as string
                                }
                              } as React.ChangeEvent<HTMLInputElement>);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowCamera(true)}
                      className="camera-button"
                    >
                      Tomar foto
                    </button>
                    {formData[field] && (
                      <div className="image-preview">
                        <img src={formData[field] as string} alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            
            return (
              <TextField
                key={field}
                name={field}
                formData={formData}
                handleChange={handleChange}
                type="text"
              />
            );
          })}
        </div>

        {/* Botón para expandir */}
        <button 
          type="button" 
          onClick={() => setExpanded(!expanded)}
          className="toggle-button"
          disabled={isSubmitting}
        >
          {expanded ? '▲ Ocultar campos' : '▼ Mostrar más campos'}
        </button>

        {/* Campos avanzados */}
        {expanded && (
          <div className="advanced-fields">
            {advancedFields.map(field => {
              // Manejar campos especiales
               if (field === 'LocalidadDestino') {
                  // Si el país destino es Estados Unidos, mostrar campo de texto libre
                  if (formData.PaisDestino === 'Estados Unidos') {
                    return (
                      <TextField
                        key={field}
                        name={field}
                        formData={formData}
                        handleChange={handleChange}
                        type="text"
                      />
                    );
                  } else {
                    // Para otros países, mantener el SelectField
                    return (
                      <SelectField
                        key={field}
                        name={field}
                        formData={formData}
                        handleChange={handleChange}
                        fetchOptions={fetchLocalidades}
                        disabled={!['México', 'Estados Unidos'].includes(formData.PaisDestino)}
                      />
                    );
                  }
                }
              
              if (['FechaNacimiento', 'FechaUltimaDeportacion', 'FechaDetencion'].includes(field)) {
                return (
                  <DateField 
                    key={field}
                    name={field as any}
                    formData={formData}
                    setFormData={setFormData}
                  />
                );
              }
              
              // Radio groups
              const radioFields = [
                'ViajaConIdentificacion', 'DeportadaAnteriormente', 
                'Encarcelado', 'Embarazada', 'HablaEspanol'
              ];
              
              if (radioFields.includes(field)) {
                return (
                  <RadioGroup 
                    key={field}
                    name={field as any}
                    formData={formData}
                    handleChange={handleChange}
                  />
                );
              }
              
              // Campos normales
              return (
                <TextField
                  key={field}
                  name={field}
                  formData={formData}
                  handleChange={handleChange}
                  type={['EdadMigracion', 'NumeroMigraciones', 'Estatura', 'Peso', 'MesesEmbarazo'].includes(field) ? 'number' : 'text'}
                  rows={['MensajeFamiliares', 'Necesidades', 'DescripcionFisica'].includes(field) ? 4 : 1}
                />
              );
            })}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting || !encuentroActivo}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span> Registrando...
            </>
          ) : (
            'Registrar Persona'
          )}
        </button>
      </form>

      {showCamera && (
        <div className="camera-modal">
          <video ref={videoRef} autoPlay playsInline />
          <div className="camera-controls">
            <button type="button" onClick={captureImage}>Capturar</button>
            <button type="button" onClick={() => setShowCamera(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormularioEnMovilidad;