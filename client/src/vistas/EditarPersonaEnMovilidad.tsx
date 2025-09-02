import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditarPersona.css';
import { API_URL } from "../config";
import { useAuth } from '@/AuthContext';


interface PersonaData {
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
  FechaNacimiento: string;
  EstadoCivil: string;
  ViajaConIdentificacion: string;
  Identificacion: string;
  UltimoDomicilio: string;
  IdiomaMaterno: string;
  HablaEspanol: string;
  OtrosIdiomas: string;
  OtrosIdiomasCual: string;
  Profesion: string;
  EdadMigracion: string;
  AnoComienzoMigracion: string;
  Motivo: string;
  NumeroMigraciones: string;
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
  FechaUltimaDeportacion: string;
  Encarcelado: string;
  UbicacionCarcel: string;
  FechaDetencion: string;
  IdentificacionDetencionEEUU: string;
  PapelesFalsos: string;
  PapelesFalsosCual: string;
  AcompañantesViaje: string;
  ConocidosEnExtranjero: string;
  Estatura: string;
  Peso: string;
  Complexion: string;
  ColorPiel: string;
  VelloFacial: string;
  VelloFacialCual: string;
  Lentes: string;
  Cabello: string;
  Embarazada: string;
  MesesEmbarazo: string;
  NumeroCelular: string;
  SeñalesParticulares: string;
  Lesiones: string;
  TipoDientes: string;
  EstadoSalud: string;
  DescripcionPrendas: string;
  RedesSociales: string;
}

// Estado inicial con strings vacíos
const initialData: PersonaData = {
  Nombre: "",
  PrimerApellido: "",
  SegundoApellido: "",
  Estado: "",
  Imagen: "",
  MensajeFamiliares: "",
  Necesidades: "",
  DescripcionFisica: "",
  TrabajadorHogar: "",
  TrabajadorCampo: "",
  SituacionCalle: "",
  LocalidadOrigen: "",
  PaisDestino: "",
  EstadoDestino: "",
  LocalidadDestino: "",
  PuntoEntradaMex: "",
  PuntoEntradaUSA: "",
  Nacionalidad: "",
  FechaNacimiento: "",
  EstadoCivil: "",
  ViajaConIdentificacion: "",
  Identificacion: "",
  UltimoDomicilio: "",
  IdiomaMaterno: "",
  HablaEspanol: "",
  OtrosIdiomas: "",
  OtrosIdiomasCual: "",
  Profesion: "",
  EdadMigracion: "",
  AnoComienzoMigracion: "",
  Motivo: "",
  NumeroMigraciones: "",
  ConfirmacionEntradaPunto: "",
  Sexo: "",
  Genero: "",
  OtroSexoLibre: "",
  InformacionUsadaPara: "",
  InformacionPublica: "",
  Institucion: "",
  Cargo: "",
  PersonaUltimaComunicacion: "",
  DeportadaAnteriormente: "",
  PaisDeportacion: "",
  FechaUltimaDeportacion: "",
  Encarcelado: "",
  UbicacionCarcel: "",
  FechaDetencion: "",
  IdentificacionDetencionEEUU: "",
  PapelesFalsos: "",
  PapelesFalsosCual: "",
  AcompañantesViaje: "",
  ConocidosEnExtranjero: "",
  Estatura: "",
  Peso: "",
  Complexion: "",
  ColorPiel: "",
  VelloFacial: "",
  VelloFacialCual: "",
  Lentes: "",
  Cabello: "",
  Embarazada: "",
  MesesEmbarazo: "",
  NumeroCelular: "",
  SeñalesParticulares: "",
  Lesiones: "",
  TipoDientes: "",
  EstadoSalud: "",
  DescripcionPrendas: "",
  RedesSociales: "",
  
};


const etiquetas: Record<keyof PersonaData, string> = {
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

const EditarPersona: React.FC = () => {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId?.replace(/^:/, "");
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState<PersonaData>(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- obtener datos ---------------------------------------------------------
  useEffect(() => {
  if (!id) return;

  (async () => {
    try {
      const res = await fetch(`${API_URL}/api/personas/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
      if (!res.ok) throw new Error("Error al cargar datos");

      const data = await res.json();
      
      // Normalize all fields including dates and numbers
      const normalizedData: PersonaData = { ...initialData };
      
      Object.keys(initialData).forEach((key) => {
        const field = key as keyof PersonaData;
        if (data[field] !== undefined && data[field] !== null) {
          // Handle date fields
          if (/^Fecha/.test(key) && data[field]) {
            const dateValue = new Date(data[field] as string);
            normalizedData[field] = !isNaN(dateValue.getTime())
              ? dateValue.toISOString().split('T')[0]
              : (data[field] as string);
          } 
          // Handle numeric fields
          else if (['EdadMigracion', 'NumeroMigraciones', 'Estatura', 'Peso', 'MesesEmbarazo'].includes(key)) {
            normalizedData[field] = data[field]?.toString() || '';
          }
          // Handle boolean fields
          else if (typeof data[field] === 'boolean') {
            normalizedData[field] = data[field] ? 'Sí' : 'No';
          }
          // All other fields
          else {
            normalizedData[field] = data[field] as string;
          }
        }
      });

      setFormData(normalizedData);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      alert("No se pudo cargar la información de la persona.");
    } finally {
      setLoading(false);
    }
  })();
}, [id]);

  // --- handlers --------------------------------------------------------------
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!id) return;

  setSaving(true);

  try {
    // Prepare payload with proper data types
    const payload: any = { ...formData, Situacion: 'En Movilidad' };

    // Convert numeric fields
    const numericKeys = ['EdadMigracion', 'NumeroMigraciones', 'Estatura', 'Peso', 'MesesEmbarazo'];
    numericKeys.forEach((k) => {
      const key = k as keyof PersonaData;
      payload[key] = formData[key] === '' ? null : Number(formData[key]);
    });

    // Convert date fields
    const dateKeys = Object.keys(formData).filter(k => /^Fecha/.test(k)) as (keyof PersonaData)[];
    dateKeys.forEach(k => {
      payload[k] = formData[k] === '' ? null : new Date(formData[k] as string).toISOString();
    });

    // Convert boolean fields
    const booleanFields = ['ViajaConIdentificacion', 'HablaEspanol', 'OtrosIdiomas', 'DeportadaAnteriormente', 
                          'Encarcelado', 'PapelesFalsos', 'VelloFacial', 'Lentes', 'Embarazada'];
    booleanFields.forEach((field) => {
      const key = field as keyof PersonaData;
      if (formData[key] === 'Sí') payload[key] = true;
      else if (formData[key] === 'No') payload[key] = false;
      else payload[key] = null;
    });

    const res = await fetch(`${API_URL}/api/personas/${id}`, {
      method: 'PUT',
     headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al actualizar');
    }

    alert('Actualización exitosa');
    navigate('/visualizar-movilidad'); // Redirect to movilidad list
  } catch (err: any) {
    console.error('Error updating:', err);
    alert(err.message || 'Error al actualizar los datos');
  } finally {
    setSaving(false);
  }
};

  // --- UI helpers ------------------------------------------------------------
const renderField = (name: keyof PersonaData) => {
  const value = formData[name] ?? '';
  
  if (name === 'Imagen') {
    return (
      <div key={name} className="field">
        <label htmlFor={name}>{etiquetas[name]}</label>
        {formData.Imagen && (
          <div style={{ marginBottom: 10 }}>
            <img
              src={formData.Imagen}
              alt="Imagen actual"
              style={{ maxWidth: 200, maxHeight: 200 }}
            />
          </div>
        )}
        <input
          id={name}
          name={name}
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target?.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
              const result = (ev.target as FileReader | null)?.result;
              if (typeof result === 'string') {
                setFormData(prev => ({ ...prev, Imagen: result }));
              }
            };
            reader.onerror = () => {
              console.error('Error al leer el archivo');
            };
            reader.readAsDataURL(file);
          }}
        />
      </div>
    );
  }

  // Campos de selección
  if (name === 'Nacionalidad') {
    return (
      <div key={name} className="field">
        <label htmlFor={name}>{etiquetas[name]}</label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="Mexicana">Mexicana</option>
          <option value="Estadounidense">Estadounidense</option>
          <option value="Guatemalteca">Guatemalteca</option>
          <option value="Hondureña">Hondureña</option>
          <option value="Salvadoreña">Salvadoreña</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
    );
  }

  if (name === 'PaisDestino') {
    return (
      <div key={name} className="field">
        <label htmlFor={name}>{etiquetas[name]}</label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="México">México</option>
          <option value="Estados Unidos">Estados Unidos</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
    );
  }

  if (name === 'EstadoDestino') {
    return (
      <div key={name} className="field">
        <label htmlFor={name}>{etiquetas[name]}</label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="Aguascalientes">Aguascalientes</option>
          <option value="Baja California">Baja California</option>
          <option value="Baja California Sur">Baja California Sur</option>
          <option value="Campeche">Campeche</option>
          <option value="Chiapas">Chiapas</option>
          <option value="Chihuahua">Chihuahua</option>
          <option value="Ciudad de México">Ciudad de México</option>
          <option value="Coahuila">Coahuila</option>
          <option value="Colima">Colima</option>
          <option value="Durango">Durango</option>
          <option value="Estado de México">Estado de México</option>
          <option value="Guanajuato">Guanajuato</option>
          <option value="Guerrero">Guerrero</option>
          <option value="Hidalgo">Hidalgo</option>
          <option value="Jalisco">Jalisco</option>
          <option value="Michoacán">Michoacán</option>
          <option value="Morelos">Morelos</option>
          <option value="Nayarit">Nayarit</option>
          <option value="Nuevo León">Nuevo León</option>
          <option value="Oaxaca">Oaxaca</option>
          <option value="Puebla">Puebla</option>
          <option value="Querétaro">Querétaro</option>
          <option value="Quintana Roo">Quintana Roo</option>
          <option value="San Luis Potosí">San Luis Potosí</option>
          <option value="Sinaloa">Sinaloa</option>
          <option value="Sonora">Sonora</option>
          <option value="Tabasco">Tabasco</option>
          <option value="Tamaulipas">Tamaulipas</option>
          <option value="Tlaxcala">Tlaxcala</option>
          <option value="Veracruz">Veracruz</option>
          <option value="Yucatán">Yucatán</option>
          <option value="Zacatecas">Zacatecas</option>
          <option value="Alabama">Alabama</option>
          <option value="Alaska">Alaska</option>
          <option value="Arizona">Arizona</option>
          <option value="Arkansas">Arkansas</option>
          <option value="California">California</option>
          <option value="Colorado">Colorado</option>
          <option value="Connecticut">Connecticut</option>
          <option value="Delaware">Delaware</option>
          <option value="Florida">Florida</option>
          <option value="Georgia">Georgia</option>
          <option value="Hawaii">Hawaii</option>
          <option value="Idaho">Idaho</option>
          <option value="Illinois">Illinois</option>
          <option value="Indiana">Indiana</option>
          <option value="Iowa">Iowa</option>
          <option value="Kansas">Kansas</option>
          <option value="Kentucky">Kentucky</option>
          <option value="Louisiana">Louisiana</option>
          <option value="Maine">Maine</option>
          <option value="Maryland">Maryland</option>
          <option value="Massachusetts">Massachusetts</option>
          <option value="Michigan">Michigan</option>
          <option value="Minnesota">Minnesota</option>
          <option value="Mississippi">Mississippi</option>
          <option value="Missouri">Missouri</option>
          <option value="Montana">Montana</option>
          <option value="Nebraska">Nebraska</option>
          <option value="Nevada">Nevada</option>
          <option value="New Hampshire">New Hampshire</option>
          <option value="New Jersey">New Jersey</option>
          <option value="New Mexico">New Mexico</option>
          <option value="New York">New York</option>
          <option value="North Carolina">North Carolina</option>
          <option value="North Dakota">North Dakota</option>
          <option value="Ohio">Ohio</option>
          <option value="Oklahoma">Oklahoma</option>
          <option value="Oregon">Oregon</option>
          <option value="Pennsylvania">Pennsylvania</option>
          <option value="Rhode Island">Rhode Island</option>
          <option value="South Carolina">South Carolina</option>
          <option value="South Dakota">South Dakota</option>
          <option value="Tennessee">Tennessee</option>
          <option value="Texas">Texas</option>
          <option value="Utah">Utah</option>
          <option value="Vermont">Vermont</option>
          <option value="Virginia">Virginia</option>
          <option value="Washington">Washington</option>
          <option value="West Virginia">West Virginia</option>
          <option value="Wisconsin">Wisconsin</option>
          <option value="Wyoming">Wyoming</option>
        </select>
      </div>
    );
  }

  if (name === 'PuntoEntradaMex') {
    return (
      <div key={name} className="field">
        <label htmlFor={name}>{etiquetas[name]}</label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="Tapachula">Tapachula</option>
          <option value="Ciudad Hidalgo">Ciudad Hidalgo</option>
          <option value="No sabe">No sabe</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
    );
  }

  if (name === 'PuntoEntradaUSA') {
    return (
      <div key={name} className="field">
        <label htmlFor={name}>{etiquetas[name]}</label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="Nogales">Nogales</option>
          <option value="El Paso">El Paso</option>
          <option value="No sabe">No sabe</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
    );
  }

  if (name === 'EstadoCivil') {
    return (
      <div key={name} className="field">
        <label htmlFor={name}>{etiquetas[name]}</label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="Soltero/a">Soltero/a</option>
          <option value="Casado/a">Casado/a</option>
          <option value="Divorciado/a">Divorciado/a</option>
          <option value="Viudo/a">Viudo/a</option>
          <option value="Unión libre">Unión libre</option>
        </select>
      </div>
    );
  }

  if (name === 'ViajaConIdentificacion') {
    return (
      <div key={name} className="field">
        <label>{etiquetas[name]}</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={name}
              value="Sí"
              checked={value === 'Sí'}
              onChange={handleChange}
            /> Sí
          </label>
          <label>
            <input
              type="radio"
              name={name}
              value="No"
              checked={value === 'No'}
              onChange={handleChange}
            /> No
          </label>
        </div>
      </div>
    );
  }

  if (name === 'HablaEspanol') {
    return (
      <div key={name} className="field">
        <label>{etiquetas[name]}</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={name}
              value="Sí"
              checked={value === 'Sí'}
              onChange={handleChange}
            /> Sí
          </label>
          <label>
            <input
              type="radio"
              name={name}
              value="No"
              checked={value === 'No'}
              onChange={handleChange}
            /> No
          </label>
        </div>
      </div>
    );
  }

  if (name === 'OtrosIdiomas') {
    return (
      <div key={name} className="field">
        <label>{etiquetas[name]}</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={name}
              value="Sí"
              checked={value === 'Sí'}
              onChange={handleChange}
            /> Sí
          </label>
          <label>
            <input
              type="radio"
              name={name}
              value="No"
              checked={value === 'No'}
              onChange={handleChange}
            /> No
          </label>
        </div>
      </div>
    );
  }

  if (name === 'Sexo') {
    return (
      <div key={name} className="field">
        <label>{etiquetas[name]}</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={name}
              value="Hombre"
              checked={value === 'Hombre'}
              onChange={handleChange}
            /> Hombre
          </label>
          <label>
            <input
              type="radio"
              name={name}
              value="Mujer"
              checked={value === 'Mujer'}
              onChange={handleChange}
            /> Mujer
          </label>
          <label>
            <input
              type="radio"
              name={name}
              value="Otro"
              checked={value === 'Otro'}
              onChange={handleChange}
            /> Otro
          </label>
        </div>
      </div>
    );
  }

  if (name === 'Genero') {
    return (
      <div key={name} className="field">
        <label>{etiquetas[name]}</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={name}
              value="Masculino"
              checked={value === 'Masculino'}
              onChange={handleChange}
            /> Masculino
          </label>
          <label>
            <input
              type="radio"
              name={name}
              value="Femenino"
              checked={value === 'Femenino'}
              onChange={handleChange}
            /> Femenino
          </label>
          <label>
            <input
              type="radio"
              name={name}
              value="No binario"
              checked={value === 'No binario'}
              onChange={handleChange}
            /> No binario
          </label>
        </div>
      </div>
    );
  }

  // Textareas largos
  const longTextFields: (keyof PersonaData)[] = [
    'MensajeFamiliares',
    'DescripcionFisica',
    'Necesidades'
  ];
  if (longTextFields.includes(name)) {
    return (
      <div key={name} className="field">
        <label htmlFor={name}>{etiquetas[name]}</label>
        <textarea id={name} name={name} value={value} onChange={handleChange} rows={4} />
      </div>
    );
  }

  // Campos numéricos
  const numericFields: (keyof PersonaData)[] = [
    'EdadMigracion',
    'NumeroMigraciones',
    'Estatura',
    'Peso',
    'MesesEmbarazo'
  ];

  // Campos de fecha
  const isDate = /^Fecha/.test(name);

  // Campos normales
  return (
    <div key={name} className="field">
      <label htmlFor={name}>{etiquetas[name]}</label>
      <input
        id={name}
        name={name}
        type={isDate ? 'date' : numericFields.includes(name) ? 'number' : 'text'}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};


 if (loading) return <p>Cargando información…</p>;

// Campos a excluir del formulario
const excludeFields: (keyof PersonaData)[] = [];

return (
  <div className="EditarPersona">
    <h2>Editar persona en movilidad</h2>
    <form onSubmit={handleSubmit}>
      {Object.keys(formData).map((key) => {
        const name = key as keyof PersonaData;
        if (excludeFields.includes(name)) return null;
        return renderField(name);
      })}

      <button type="submit" disabled={saving}>
        {saving ? 'Actualizando…' : 'Actualizar'}
      </button>
    </form>
  </div>
);
};

export default EditarPersona;
