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
  RelatoDesaparicion: string;
  PaisPerdidaContacto: string;
  EstadoPerdidaContacto: string;
  LocalidadPerdidaContacto: string;
  FechaUltimaComunicacion: string;
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
  Situacion: string;
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
  RelatoDesaparicion: "",
  PaisPerdidaContacto: "",
  EstadoPerdidaContacto: "",
  LocalidadPerdidaContacto: "",
  FechaUltimaComunicacion: "",
  ConfirmacionEntradaPunto: "",
  Sexo: "",
  Genero: "",
  OtroSexoLibre: "",
  HayDenuncia: "",
  HayDenunciaCual: "",
  HayReporte: "",
  HayReporteCual: "",
  AvancesDenuncia: "",
  AvancesDenunciaCual: "",
  LugaresBusqueda: "",
  NombreQuienBusca: "",
  ApellidoPaternoQuienBusca: "",
  ApellidoMaternoQuienBusca: "",
  ParentescoQuienBusca: "",
  DireccionQuienBusca: "",
  TelefonoQuienBusca: "",
  CorreoElectronicoQuienBusca: "",
  MensajeQuienBusca: "",
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
  Situacion: ""
};


// ... (importaciones y definición de PersonaData e initialData permanecen igual)

const EditarPersona: React.FC = () => {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId?.replace(/^:/, ""); // sanea rutas tipo ":1"
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PersonaData>(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- obtener datos ---------------------------------------------------------
 useEffect(() => {
  if (!id) return;
  
  (async () => {
    try {
      const res = await fetch(API_URL +`/api/personas/${id}`);
      console.log('HTTP status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al cargar datos");
      }

      const data: PersonaData = await res.json();
      console.log('Datos recibidos:', data);

      // Normaliza los datos recibidos
      const normalizedData: PersonaData = { ...initialData };
      
      // Copia solo los campos que existen en ambos objetos
      Object.keys(initialData).forEach((key) => {
        const field = key as keyof PersonaData;
        if (data[field] !== undefined && data[field] !== null) {
          // Manejo especial para fechas
          if (/^Fecha/.test(key) && data[field]) {
            const dateValue = new Date(data[field] as string);
            if (!isNaN(dateValue.getTime())) {
              normalizedData[field] = dateValue.toISOString().split('T')[0];
            } else {
              normalizedData[field] = data[field] as string;
            }
          } 
          // Manejo especial para números
          else if (['EdadMigracion', 'NumeroMigraciones', 'Estatura', 'Peso', 'MesesEmbarazo'].includes(key)) {
            normalizedData[field] = data[field]?.toString() || '';
          }
          // Resto de campos
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

    // Prepara payload: convierte strings numéricas y vacíos → null
    const numericKeys = [
      'EdadMigracion',
      'NumeroMigraciones',
      'Estatura',
      'Peso',
      'MesesEmbarazo'
    ] as (keyof PersonaData)[];

    const payload = { ...formData, Situacion: 'Desaparecida' } as any;

    numericKeys.forEach((k) => {
      payload[k] = payload[k] === '' ? null : Number(payload[k]);
    });

    // 3. Fechas: "" → null
  const dateKeys = Object.keys(formData)
    .filter(k => /^Fecha/.test(k)) as (keyof PersonaData)[];

  dateKeys.forEach(k => {
    if (payload[k] === '') payload[k] = null;
  });

    try {
      const res = await fetch(API_URL +`/api/personas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al actualizar');
      }

      alert('Actualización exitosa');
      navigate('/');
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
            if (!file) return;              // 1️⃣: early‑return si no hay archivo

            const reader = new FileReader();
            reader.onload = ev => {
              const result = (ev.target as FileReader | null)?.result;
              if (typeof result === 'string') {    // 2️⃣: comprobación explícita
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

  return (
    <div className="EditarPersona">
      <h2>Editar persona desaparecida</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, val]) => {
          const name = key as keyof PersonaData;

          // Textareas largos
          const isTextarea = [
            'RelatoDesaparicion',
            'MensajeFamiliares',
            'DescripcionFisica',
            'Necesidades'
          ].includes(name);
          if (isTextarea)
            return (
              <div key={name} className="field">
                <label htmlFor={name}>{name}</label>
                <textarea id={name} name={name} value={val ?? ''} onChange={handleChange} />
              </div>
            );

          // Inputs numéricos
          const isNumber = [
            'EdadMigracion',
            'NumeroMigraciones',
            'Estatura',
            'Peso',
            'MesesEmbarazo'
          ].includes(name);

          // Inputs fecha
          const isDate = /^Fecha/.test(name);
          if (isDate)
            return renderInput(name, 'date');

          return renderInput(name, isNumber ? 'number' : 'text');
        })}

        <button type="submit" disabled={saving}>
          {saving ? 'Actualizando…' : 'Actualizar'}
        </button>
      </form>
    </div>
  );
};

export default EditarPersona;
