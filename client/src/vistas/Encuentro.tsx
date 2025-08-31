import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Encuentros.css";
import { API_URL } from "../config";



interface PuntoGeografico {
  latitud: string;
  longitud: string;
  descripcion?: string;
}

interface EncuentroData {
  idPersona: number;
  idEntrevistador: number;
  observaciones: string;
  puntoGeografico: PuntoGeografico;
}

const Encuentro: React.FC = () => {
  const { idPersona } = useParams<{ idPersona: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // Asumiendo que tu AuthContext proporciona el usuario autenticado

  const [encuentro, setEncuentro] = useState<EncuentroData>({
    idPersona: idPersona ? parseInt(idPersona) : 0,
    idEntrevistador: user?.id ? Number(user.id) : 1, // Usar el ID del usuario autenticado
    observaciones: "",
    puntoGeografico: {
      latitud: "",
      longitud: "",
      descripcion: "Ubicación automática del entrevistador",
    },
  });

  // Obtener la ubicación automáticamente al cargar el componente
  useEffect(() => {
    const obtenerUbicacion = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setEncuentro((prev) => ({
              ...prev,
              puntoGeografico: {
                ...prev.puntoGeografico,
                latitud: position.coords.latitude.toString(),
                longitud: position.coords.longitude.toString(), // Nota: en realidad esto es longitud
              },
            }));
          },
          (error) => {
            console.error("Error obteniendo ubicación:", error);
            alert("No se pudo obtener la ubicación automática. Por favor ingrésala manualmente.");
          }
        );
      } else {
        alert("Tu navegador no soporta geolocalización. Por favor ingresa la ubicación manualmente.");
      }
    };

    obtenerUbicacion();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("puntoGeografico_")) {
      const field = name.replace("puntoGeografico_", "");
      setEncuentro((prev) => ({
        ...prev,
        puntoGeografico: {
          ...prev.puntoGeografico,
          [field]: value,
        },
      }));
    } else {
      setEncuentro((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validación rápida de latitud y longitud
  const lat = parseFloat(encuentro.puntoGeografico.latitud);
  const alt = parseFloat(encuentro.puntoGeografico.longitud);

  if (isNaN(lat) || isNaN(alt)) {
    alert("Por favor introduce valores numéricos válidos para latitud y longitud.");
    return;
  }

  try {
    // 1. Insertar el punto geográfico
    const puntoResponse = await fetch(`${API_URL}/api/personas/puntos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitud: lat,  // Usamos el valor validado
        longitud: alt,   // Usamos el valor validado
        descripcion: encuentro.puntoGeografico.descripcion || "",
      }),
    });

    if (!puntoResponse.ok) {
      const errorData = await puntoResponse.json();
      throw new Error(errorData.message || "Error al registrar punto geográfico");
    }

    const puntoData = await puntoResponse.json();
    const idPunto = puntoData.idPunto;

    if (!idPunto) {
      throw new Error("No se recibió un ID de punto válido del servidor");
    }

    // 2. Insertar el encuentro con el idPunto obtenido
    const encuentroResponse = await fetch(
     `${API_URL}/api/personas/encuentros`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPersona: encuentro.idPersona,
          idEntrevistador: encuentro.idEntrevistador,
          idPunto: idPunto,
          observaciones: encuentro.observaciones,
          fecha: new Date().toISOString(),
        }),
      }
    );

    if (!encuentroResponse.ok) {
      const errorData = await encuentroResponse.json();
      throw new Error(errorData.message || "Error al registrar encuentro");
    }

    alert("Encuentro registrado exitosamente");
    navigate(`/`);
  } catch (error) {
    console.error("Error:", error);
    alert(error instanceof Error ? error.message : "Error desconocido al registrar el encuentro");
  }
};
  return (
    <div className="encuentro-container space-y-4">
      <h2 className="text-2xl font-semibold">Registro de Encuentro</h2>
      <p className="text-sm text-gray-600">ID de la persona: {idPersona}</p>

      {/* Mensaje de ayuda para latitud y longitud */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
        Introduce Latitud y Altitud en formato<strong> decimal</strong> con punto como separador
        (por ejemplo <em>40.7127753</em>). Usa valores positivos para el hemisferio norte/este y negativos para sur/oeste.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-medium">Datos del Punto Geográfico</h3>

        <div className="flex flex-col gap-1">
          <label htmlFor="latitud" className="font-medium">
            Latitud:
          </label>
          <input
            id="latitud"
            type="number"
            name="puntoGeografico_latitud"
            value={encuentro.puntoGeografico.latitud}
            onChange={handleChange}
            required
            step="any"
            placeholder="Ej: 40.7127753"
            className="input"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="longitud" className="font-medium">
            Altitud:
          </label>
          <input
            id="longitud"
            type="number"
            name="puntoGeografico_longitud"
            value={encuentro.puntoGeografico.longitud}
            onChange={handleChange}
            required
            step="any"
            placeholder="Ej: 35.6895"
            className="input"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="descripcion" className="font-medium">
            Descripción (opcional):
          </label>
          <textarea
            id="descripcion"
            name="puntoGeografico_descripcion"
            value={encuentro.puntoGeografico.descripcion || ""}
            onChange={handleChange}
            rows={3}
            className="textarea"
          />
        </div>

        <h3 className="text-xl font-medium">Datos del Encuentro</h3>

        <div className="flex flex-col gap-1">
          <label htmlFor="entrevistador" className="font-medium">
            ID Entrevistador:
          </label>
          <input
            id="entrevistador"
            type="number"
            name="idEntrevistador"
            value={encuentro.idEntrevistador}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="observaciones" className="font-medium">
            Observaciones:
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={encuentro.observaciones}
            onChange={handleChange}
            rows={4}
            required
            className="textarea"
          />
        </div>

        <button type="submit" className="btn-primary w-full md:w-auto">
          Registrar Encuentro
        </button>
      </form>
    </div>
  );
};

export default Encuentro;
