import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditarPersona.css';


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
      const res = await fetch(`http://localhost:3001/api/personas/${id}`);
      if (!res.ok) throw new Error("Error al cargar datos");

      const data = await res.json();
      
      // Filtramos "Situacion" para que no se incluya en el estado
      const { Situacion, ...filteredData } = data; // <-- Excluimos Situacion
      
      const normalizedData: PersonaData = { ...initialData };

      Object.keys(initialData).forEach((key) => {
        const field = key as keyof PersonaData;
        if (filteredData[field] !== undefined && filteredData[field] !== null) {
          if (/^Fecha/.test(key) && filteredData[field]) {
            const dateValue = new Date(filteredData[field] as string);
            normalizedData[field] = !isNaN(dateValue.getTime())
              ? dateValue.toISOString().split('T')[0]
              : (filteredData[field] as string);
          } else if (
            ['EdadMigracion', 'NumeroMigraciones', 'Estatura', 'Peso', 'MesesEmbarazo'].includes(key)
          ) {
            normalizedData[field] = filteredData[field]?.toString() || '';
          } else {
            normalizedData[field] = filteredData[field] as string;
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

  const numericKeys: (keyof PersonaData)[] = [
    'EdadMigracion',
    'NumeroMigraciones',
    'Estatura',
    'Peso',
    'MesesEmbarazo'
  ];

  const payload = { ...formData, Situacion: 'En Movilidad' } as any;
  numericKeys.forEach((k) => {
    payload[k] = payload[k] === '' ? null : Number(payload[k]);
  });
  
  const dateKeys = Object.keys(formData)
    .filter(k => /^Fecha/.test(k)) as (keyof PersonaData)[];

  dateKeys.forEach(k => {
    if (payload[k] === '') payload[k] = null;
  });

  try {
    

    const res = await fetch(`http://localhost:3001/api/personas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar');
    }

    // Aquí asumimos que la API devuelve el objeto persona actualizado
    const updatedPersona = await res.json();
    
    // Redirigir usando el idPersona de la respuesta
    navigate(`/encuentro/${updatedPersona.idPersona || id}`);
    
  } catch (err: any) {
    alert(err.message);
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
