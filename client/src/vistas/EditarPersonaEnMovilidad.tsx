import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditarPersona.css';
import { API_URL } from "../config";


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

const EditarPersona: React.FC = () => {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId?.replace(/^:/, "");
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PersonaData>(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- obtener datos ---------------------------------------------------------
  useEffect(() => {
  if (!id) return;

  (async () => {
    try {
      const res = await fetch(`${API_URL}/api/personas/${id}`);
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
      headers: { 'Content-Type': 'application/json' },
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
const renderInput = (name: keyof PersonaData, type: string = 'text') => {
  if (name === 'Imagen') {
    return (
      <div key={name} className="field">
        <label htmlFor={name}>{name}</label>

        {/* Vista previa de la imagen */}
        {formData.Imagen && (
          <div style={{ marginBottom: 10 }}>
            <img
              src={formData.Imagen}
              alt="Imagen actual"
              style={{ maxWidth: 200, maxHeight: 200 }}
            />
          </div>
        )}

        {/* Subir nueva imagen */}
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

  /* Campos “normales” */
  return (
    <div key={name}>
      <label htmlFor={name}>{name}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name] ?? ''}
        onChange={handleChange}
      />
    </div>
  );
};

  if (loading) return <p>Cargando información…</p>;
const excludeFields: (keyof PersonaData | 'Situacion')[] = ['Situacion']
  return (
    <div className="EditarPersona">
      <h2>Editar persona desaparecida</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, val]) => {
          if (excludeFields.includes(key as any)) return null;
          const name = key as keyof PersonaData;

          // Textareas largos
          const longTextFields: (keyof PersonaData)[] = [
            'MensajeFamiliares',
            'DescripcionFisica',
            'Necesidades'
          ];
          if (longTextFields.includes(name)) {
            return (
              <div key={name} className="field">
                <label htmlFor={name}>{name}</label>
                <textarea id={name} name={name} value={val ?? ''} onChange={handleChange} />
              </div>
            );
          }

          const numericFields: (keyof PersonaData)[] = [
            'EdadMigracion',
            'NumeroMigraciones',
            'Estatura',
            'Peso',
            'MesesEmbarazo'
          ];

          const isDate = /^Fecha/.test(name);

          return renderInput(name, isDate ? 'date' : numericFields.includes(name) ? 'number' : 'text');
        })}

        <button type="submit" disabled={saving}>
          {saving ? 'Actualizando…' : 'Actualizar'}
        </button>
      </form>
    </div>
  );
};

export default EditarPersona;
