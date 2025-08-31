
import React, { useState, useMemo, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './FormularioDesaparecida.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_URL } from "../config";

// Tipos e interfaces
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
  RelatoDesaparicion: string;
  PaisPerdidaContacto: string;
  EstadoPerdidaContacto: string;
  LocalidadPerdidaContacto: string;
  FechaUltimaComunicacion: Date  | null;        
  ConfirmacionEntradaPunto: string;
  Sexo: string;
  Genero: string;
  OtroSexoLibre: string;
  HayDenuncia: string;
  HayDenunciaCual: string;
  HayReporte: string;
  HayReporteCual: string;
  AvancesDenuncia: string;
  AvancesDenunciaCual: string;
  LugaresBusqueda: string;
  NombreQuienBusca: string;
  ApellidoPaternoQuienBusca: string;
  ApellidoMaternoQuienBusca: string;
  ParentescoQuienBusca: string;
  DireccionQuienBusca: string;
  TelefonoQuienBusca: string;
  CorreoElectronicoQuienBusca: string;
  MensajeQuienBusca: string;
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
  RelatoDesaparicion: 'Relato sobre la desaparición',
  PaisPerdidaContacto: 'País donde se perdió contacto',
  EstadoPerdidaContacto: 'Estado donde se perdió contacto',
  LocalidadPerdidaContacto: 'Localidad donde se perdió contacto',
  FechaUltimaComunicacion: 'Fecha de última comunicación',
  ConfirmacionEntradaPunto: 'Confirmación del punto de entrada',
  Sexo: 'Sexo',
  Genero: 'Género',
  OtroSexoLibre: 'Otro sexo (especifique)',
  HayDenuncia: '¿Existe denuncia?',
  HayDenunciaCual: '¿De qué tipo de denuncia?',
  HayReporte: '¿Existe reporte?',
  HayReporteCual: '¿De qué tipo de reporte?',
  AvancesDenuncia: '¿Hay avances en la denuncia?',
  AvancesDenunciaCual: 'Detalles de avances en la denuncia',
  LugaresBusqueda: 'Lugares de búsqueda',
  NombreQuienBusca: 'Nombre de quien busca',
  ApellidoPaternoQuienBusca: 'Apellido paterno de quien busca',
  ApellidoMaternoQuienBusca: 'Apellido materno de quien busca',
  ParentescoQuienBusca: 'Parentesco de quien busca',
  DireccionQuienBusca: 'Dirección de quien busca',
  TelefonoQuienBusca: 'Teléfono de quien busca',
  CorreoElectronicoQuienBusca: 'Correo electrónico de quien busca',
  MensajeQuienBusca: 'Mensaje de quien busca',
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
  RelatoDesaparicion: '',
  PaisPerdidaContacto: '',
  EstadoPerdidaContacto: '',
  LocalidadPerdidaContacto: '',
  FechaUltimaComunicacion: null,
  ConfirmacionEntradaPunto: '',
  Sexo: '',
  Genero: '',
  OtroSexoLibre: '',
  HayDenuncia: '',
  HayDenunciaCual: '',
  HayReporte: '',
  HayReporteCual: '',
  AvancesDenuncia: '',
  AvancesDenunciaCual: '',
  LugaresBusqueda: '',
  NombreQuienBusca: '',
  ApellidoPaternoQuienBusca: '',
  ApellidoMaternoQuienBusca: '',
  ParentescoQuienBusca: '',
  DireccionQuienBusca: '',
  TelefonoQuienBusca: '',
  CorreoElectronicoQuienBusca: '',
  MensajeQuienBusca: '',
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


// Componentes reutilizables
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
  
 // En tu componente TextField para la imagen
if (isFileInput) {
  return (
    <div>
      <label htmlFor={name}>{etiquetas[name]}</label>
      <input 
        id={name}
        name={name}
        type="file"
        accept="image/*"
        onChange={async (e) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Reducir tamaño si es mayor a 1MB
            if (file.size > 1024 * 1024) {
              const compressedFile = await compressImage(file);
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
              reader.readAsDataURL(compressedFile);
            } else {
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
          }
        }}
        disabled={disabled}
      />
      {formData[name] && (
        <div className="image-preview">
          <img src={formData[name] as string} alt="Preview" style={{maxWidth: '200px', maxHeight: '200px'}} />
        </div>
      )}
    </div>
  );
}

// Función para comprimir imágenes
async function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
  return (
    <div>
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
    <div>
      <label>{etiquetas[name]}</label>
      <div className="radio-group">
        {options.map(opt => (
          <label key={opt}>
            <input
              type="radio"
              name={name}
              value={opt}
              checked={formData[name] === opt}
              onChange={handleChange}
            /> {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

interface ConditionalFieldProps {
  name: keyof FormData;
  condition: boolean;
  formData: FormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  type?: string;
  rows?: number;
}

const ConditionalField: React.FC<ConditionalFieldProps> = ({ 
  name, 
  condition, 
  formData, 
  handleChange, 
  type = 'text',
  rows = 1
}) => {
  if (!condition) return null;
  
  return (
    <TextField 
      name={name} 
      formData={formData} 
      handleChange={handleChange} 
      type={type}
      rows={rows}
    />
  );
};

interface SelectFieldProps {
  name: keyof FormData;
  formData: FormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  options?: { value: string; label: string; group?: string }[];
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
  const [loadedOptions, setLoadedOptions] = useState<{ value: string; label: string; group?: string }[]>(options);
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

  const groupedOptions = loadedOptions.reduce((acc, option) => {
    const group = option.group || '';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, { value: string; label: string; group?: string }[]>);

  return (
    <div>
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
          Object.entries(groupedOptions).map(([group, groupOptions]) => (
            group ? (
              <optgroup key={group} label={group}>
                {groupOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </optgroup>
            ) : (
              groupOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))
            )
          ))
       ) }
      </select>
    </div>
  );
};

interface DateFieldProps {
  name: keyof FormData;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const DateField: React.FC<DateFieldProps> = ({ name, formData, setFormData }) => {
  const dateValue = formData[name] instanceof Date ? 
    (formData[name] as Date).toISOString().slice(0, 10) : 
    '';

  return (
    <div>
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
      />
    </div>
  );
};

// Componente principal
const FormularioDesaparecida: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const navigate = useNavigate();
  const { user } = useAuth();

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
    // llama a tu API de entidades
    const res = await fetch(`${API_URL}/api/personas/entidades/listado?idNacionalidad=1`);
    const data: { nombre: string }[] = await res.json();
    return data.map(e => ({ value: e.nombre, label: e.nombre }));
  }
  if (formData.PaisDestino === 'Estados Unidos') {
    const res = await fetch(`${API_URL}/api/personas/entidades/listado?idNacionalidad=2`);
    const data: { nombre: string }[] = await res.json();
    return data.map(e => ({ value: e.nombre, label: e.nombre }));
  }
  return []; // puede devolver vacíos si es “Otro” o “No sabe”
}, [formData.PaisDestino]);

  useEffect(() => {
    setFormData(prev => {
      const updates: Partial<FormData> = {};

      if (prev.PaisDestino === 'Estados Unidos' && prev.PuntoEntradaMex) {
        updates.PuntoEntradaMex = '';
      }
      if (prev.PaisDestino === 'México' && prev.PuntoEntradaUSA) {
        updates.PuntoEntradaUSA = '';
      }

      return Object.keys(updates).length ? { ...prev, ...updates } : prev;
    });
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

const fetchLocalidadesPerdidaContacto = useCallback(async (): Promise<{value:string;label:string;}[]> => {
  if (formData.PaisPerdidaContacto === 'México' && formData.EstadoPerdidaContacto) {
    const res = await fetch(`${API_URL}/api/personas/municipios/listado?idNacionalidad=1&entidad=${encodeURIComponent(formData.EstadoPerdidaContacto)}`);
    const data: { nombre: string }[] = await res.json();
    return data.map(e => ({ value: e.nombre, label: e.nombre }));
  }
  return []; // Return empty array for non-Mexico countries
}, [formData.PaisPerdidaContacto, formData.EstadoPerdidaContacto]);


  useEffect(() => {
    setFormData(prev => {
      const updates: Partial<FormData> = {};

      if (prev.PaisPerdidaContacto === 'Estados Unidos' && prev.PuntoEntradaMex) {
        updates.PuntoEntradaMex = '';
      }
      if (prev.PaisPerdidaContacto === 'México' && prev.PuntoEntradaUSA) {
        updates.PuntoEntradaUSA = '';
      }

      return Object.keys(updates).length ? { ...prev, ...updates } : prev;
    });
  }, [formData.PaisPerdidaContacto]);



  const fetchEstadosPerdidaContacto = useCallback(async (): Promise<{value:string;label:string;}[]> => {
  if (formData.PaisPerdidaContacto === 'México') {
    // llama a tu API de entidades
    const res = await fetch(`${API_URL}/api/personas/entidades/listado?idNacionalidad=1`);
    const data: { nombre: string }[] = await res.json();
    return data.map(e => ({ value: e.nombre, label: e.nombre }));
  }
  if (formData.PaisPerdidaContacto === 'Estados Unidos') {
    const res = await fetch(`${API_URL}/api/personas/entidades/listado?idNacionalidad=2`);
    const data: { nombre: string }[] = await res.json();
    return data.map(e => ({ value: e.nombre, label: e.nombre }));
  }
    
  return []; // puede devolver vacíos si es “Otro” o “No sabe”
}, [formData.PaisPerdidaContacto]);


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

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!formData.Nombre || !formData.PrimerApellido) {
    alert('Por favor, complete nombre y primer apellido.');
    return;
  }

  try {
    // Primero verifica si ya existe
    const resCheck = await fetch(`${API_URL}/api/personas?Nombre=${encodeURIComponent(formData.Nombre)}&PrimerApellido=${encodeURIComponent(formData.PrimerApellido)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const personas: any[] = await resCheck.json();

    const duplicado = personas.find(p =>
      p.Nombre?.toLowerCase().trim() === formData.Nombre.toLowerCase().trim() &&
      p.PrimerApellido?.toLowerCase().trim() === formData.PrimerApellido.toLowerCase().trim()
    );

    if (duplicado) {
    if (duplicado.Situacion === 'En Movilidad') {
      // Only redirect if user is a coordinator
      if (user?.rol === 'Coordinador') {
        navigate(`/editar/${duplicado.idPersona}`);
        return;
      }
      // For non-coordinators, continue with the registration
    } else {
      alert("Ya existe un registro con ese nombre y primer apellido.");
      return;
    }
  }

    // Crear nueva persona
    const dataToSend = { ...formData, Situacion: 'Desaparecida' };
    const res = await fetch(`${API_URL}/api/personas`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });

    if (res.ok) {
      setFormData(initialFormData);
      alert('Formulario enviado con éxito');
    } else {
     const error = await res.json();
    if (res.status === 413) {
      alert('La imagen es demasiado grande. Por favor, seleccione una imagen más pequeña.');
    } else {
      alert('Error: ' + error.error);
    }
    return;
    }

    
  }  catch (err) {
  if (err instanceof Error) {
    if (err.message.includes('PayloadTooLargeError')) {
      alert('La imagen es demasiado grande. Por favor, seleccione una imagen más pequeña.');
    } else {
      alert('Error de conexión con el servidor: ' + err.message);
    }
  } else {
    alert('Error desconocido');
  }
}
};

  // Campos genéricos antes de los select y radios
  const camposAntes = useMemo(
    () => Object.keys(initialFormData).filter(
      key => ![
        'OtrosIdiomasCual','OtroSexoLibre','Encarcelado','Nacionalidad','OtrosIdiomas','TrabajadorHogar','TrabajadorCampo',
        'SituacionCalle','HablaEspanol','Estado','Sexo','Peso','Estatura',
        'Genero','PaisDestino','EstadoDestino','LocalidadDestino',
        'LocalidadOrigen','PuntoEntradaMex','PuntoEntradaUSA','PaisPerdidaContacto',
        'EstadoPerdidaContacto','LocalidadPerdidaContacto'
      ].includes(key)
    ) as (keyof FormData)[],
    []
  );

  return (
    <div className="FormularioDesaparecida">
      <h2>Añadir persona desaparecida</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos básicos */}
        {camposAntes.map(field => {
          const isTextarea = ['MensajeFamiliares','Necesidades','DescripcionFisica','RelatoDesaparicion','LugaresBusqueda','MensajeQuienBusca','SeñalesParticulares','Lesiones','DescripcionPrendas'].includes(field);
          const type = ['EdadMigracion','NumeroMigraciones','Estatura','Peso','MesesEmbarazo'].includes(field)
            ? 'number'
            : field.toLowerCase().includes('fecha')
            ? 'date'
            : field === 'Imagen'
            ? 'file'
            : 'text';
          
          return (
            <TextField
              key={field}
              name={field}
              formData={formData}
              handleChange={handleChange}
              type={type}
              rows={isTextarea ? 4 : 1}
            />
          );
        })}

        <TextField
        name="LocalidadOrigen"
        formData={formData}
        handleChange={handleChange}
        type="text"
      />

        <SelectField
        name="Nacionalidad"
        formData={formData}
        handleChange={handleChange}
        fetchOptions={fetchNacionalidades}
      />

        {/* Campos especiales */}
        <SelectField
          name="PaisDestino"
          formData={formData}
          handleChange={handleChange}
          options={[
            { value: '', label: 'Seleccione...' },
            { value: 'México', label: 'México' },
            { value: 'Estados Unidos', label: 'Estados Unidos' },
            { value: 'Otro', label: 'Otro' },
            { value: 'No sabe', label: 'No sabe' }
          ]}
        />

        <SelectField
          name="EstadoDestino"
          formData={formData}
          handleChange={handleChange}
          fetchOptions={fetchEstados}
          disabled={!['México', 'Estados Unidos'].includes(formData.PaisDestino)}
        />


       {formData.PaisDestino === 'México' ? (
        <SelectField
          name="LocalidadDestino"
          formData={formData}
          handleChange={handleChange}
          fetchOptions={fetchLocalidades}
          disabled={!formData.PaisDestino}
        />
      ) : (
        <TextField
          name="LocalidadDestino"
          formData={formData}
          handleChange={handleChange}
          type="text"
        />
      )}

        <SelectField
          name="PuntoEntradaMex"
          formData={formData}
          handleChange={handleChange}
          options={[
            { value: '', label: 'Seleccione...' },
            { value: 'Tapachula', label: 'Tapachula' },
            { value: 'Ciudad Hidalgo', label: 'Ciudad Hidalgo' },
            { value: 'No sabe', label: 'No sabe' },
            { value: 'Otro', label: 'Otro' }
          ]}
          disabled={formData.PaisDestino === 'Estados Unidos'}
        />

        {formData.PaisDestino === 'Estados Unidos' && (
          <SelectField
            name="PuntoEntradaUSA"
            formData={formData}
            handleChange={handleChange}
            options={[
              { value: '', label: 'Seleccione...' },
              { value: 'Nogales', label: 'Nogales' },
              { value: 'El Paso', label: 'El Paso' },
              { value: 'No sabe', label: 'No sabe' },
              { value: 'Otro', label: 'Otro' }
            ]}
          />
        )}

        {/* Radio groups */}
        <RadioGroup name="ViajaConIdentificacion" formData={formData} handleChange={handleChange} />
        <RadioGroup name="ConfirmacionEntradaPunto" formData={formData} handleChange={handleChange} />
        <RadioGroup name="HayDenuncia" formData={formData} handleChange={handleChange} />
        <RadioGroup name="HayReporte" formData={formData} handleChange={handleChange} />
        <RadioGroup name="AvancesDenuncia" formData={formData} handleChange={handleChange} />
        <RadioGroup name="DeportadaAnteriormente" formData={formData} handleChange={handleChange} />
        <RadioGroup name="Encarcelado" formData={formData} handleChange={handleChange} />
        <RadioGroup name="PapelesFalsos" formData={formData} handleChange={handleChange} />
        <RadioGroup name="AcompañantesViaje" formData={formData} handleChange={handleChange} />
        <RadioGroup name="ConocidosEnExtranjero" formData={formData} handleChange={handleChange} />
        <RadioGroup name="VelloFacial" formData={formData} handleChange={handleChange} />
        <RadioGroup name="Lentes" formData={formData} handleChange={handleChange} />
        <RadioGroup name="Embarazada" formData={formData} handleChange={handleChange} />
        <RadioGroup name="InformacionPublica" formData={formData} handleChange={handleChange} />

        {/* Radio groups con opciones personalizadas */}
        <RadioGroup 
          name="TrabajadorHogar" 
          formData={formData} 
          handleChange={handleChange} 
          options={['Sí', 'No', 'No sabe']} 
        />
        <RadioGroup 
          name="TrabajadorCampo" 
          formData={formData} 
          handleChange={handleChange} 
          options={['Sí', 'No', 'No sabe']} 
        />
        <RadioGroup 
          name="SituacionCalle" 
          formData={formData} 
          handleChange={handleChange} 
          options={['Sí', 'No', 'No sabe']} 
        />
        <RadioGroup 
          name="HablaEspanol" 
          formData={formData} 
          handleChange={handleChange} 
          options={['Sí', 'No']} 
        />
        <RadioGroup 
          name="OtrosIdiomas" 
          formData={formData} 
          handleChange={handleChange} 
        />

        <ConditionalField 
          name="OtrosIdiomasCual" 
          condition={formData.OtrosIdiomas === 'Sí'}
          formData={formData}
          handleChange={handleChange}
        />

       
        
        {/* Sexo y género */}
        <div>
          <label>{etiquetas.Sexo}</label>
          <div className="radio-group">
            {['Hombre', 'Mujer', 'Otro'].map(opt => (
              <label key={opt}>
                <input 
                  type="radio" 
                  name="Sexo" 
                  value={opt} 
                  checked={formData.Sexo === opt} 
                  onChange={handleChange} 
                /> {opt}
              </label>
            ))}
          </div>
          {formData.Sexo === 'Otro' && (
            <TextField 
              name="OtroSexoLibre" 
              formData={formData} 
              handleChange={handleChange} 
            />
          )}
        </div>

        <RadioGroup 
          name="Genero" 
          formData={formData} 
          handleChange={handleChange} 
          options={['Masculino', 'Femenino', 'No binario']} 
        />

        {/* Campos condicionales */}
        <ConditionalField 
          name="HayDenunciaCual" 
          condition={formData.HayDenuncia === 'Sí'}
          formData={formData}
          handleChange={handleChange}
        />
        <ConditionalField 
          name="HayReporteCual" 
          condition={formData.HayReporte === 'Sí'}
          formData={formData}
          handleChange={handleChange}
        />
        <ConditionalField 
          name="AvancesDenunciaCual" 
          condition={formData.AvancesDenuncia === 'Sí'}
          formData={formData}
          handleChange={handleChange}
        />
        <ConditionalField 
          name="OtrosIdiomasCual" 
          condition={formData.OtrosIdiomas === 'Sí'}
          formData={formData}
          handleChange={handleChange}
        />
        <ConditionalField 
          name="VelloFacialCual" 
          condition={formData.VelloFacial === 'Sí'}
          formData={formData}
          handleChange={handleChange}
        />
        <ConditionalField 
          name="PapelesFalsosCual" 
          condition={formData.PapelesFalsos === 'Sí'}
          formData={formData}
          handleChange={handleChange}
        />
        <ConditionalField 
          name="MesesEmbarazo" 
          condition={formData.Embarazada === 'Sí'}
          formData={formData}
          handleChange={handleChange}
          type="number"
        />

        {/* Campos de fecha */}
        <DateField 
          name="FechaNacimiento" 
          formData={formData} 
          setFormData={setFormData} 
        />
        <DateField 
          name="FechaUltimaComunicacion" 
          formData={formData} 
          setFormData={setFormData} 
        />
        <DateField 
          name="FechaUltimaDeportacion" 
          formData={formData} 
          setFormData={setFormData} 
        />
        <DateField 
          name="FechaDetencion" 
          formData={formData} 
          setFormData={setFormData} 
        />

        {/* Campos de país/estado/localidad pérdida contacto */}
        <SelectField
          name="PaisPerdidaContacto"
          formData={formData}
          handleChange={handleChange}
          options={[
            { value: 'México', label: 'México' },
            { value: 'Estados Unidos', label: 'Estados Unidos' },
            { value: 'Otro', label: 'Otro' },
            { value: 'No sabe', label: 'No sabe' }
          ]}
        />

        <SelectField
          name="EstadoPerdidaContacto"
          formData={formData}
          handleChange={handleChange}
          fetchOptions={fetchEstadosPerdidaContacto}
          disabled={!['México', 'Estados Unidos'].includes(formData.PaisPerdidaContacto)}
        />

        
          {formData.PaisPerdidaContacto === 'Estados Unidos' ? (
        <TextField
          name="LocalidadPerdidaContacto"
          formData={formData}
          handleChange={handleChange}
          type="text"
        />
      ) : (
        <SelectField
          name="LocalidadPerdidaContacto"
          formData={formData}
          handleChange={handleChange}
          fetchOptions={fetchLocalidadesPerdidaContacto}
          disabled={!['México', 'Estados Unidos'].includes(formData.PaisPerdidaContacto)}
        />
      )}

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default FormularioDesaparecida;
