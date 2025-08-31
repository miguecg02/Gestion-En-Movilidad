import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../config";


interface PuntoGeografico {
  latitud: number;
  longitud: number;
  descripcion?: string;
}

interface EncuentroActivo {
  idEncuentro: number | null;
  idPunto: number | null;
  ubicacion: PuntoGeografico;
  fecha: string;
  observaciones: string;
}

interface EncuentroContextType {
  encuentroActivo: EncuentroActivo | null;
  iniciarEncuentro: (observaciones: string) => Promise<void>;
  finalizarEncuentro: () => void;
  estaEnEncuesta: boolean;
}

const EncuentroContext = createContext<EncuentroContextType | undefined>(undefined);

export const EncuentroProvider = ({ children }: { children: React.ReactNode }) => {
  const [encuentroActivo, setEncuentroActivo] = useState<EncuentroActivo | null>(null);

  // Finalizar encuentro al cerrar pestaña/navegador
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (encuentroActivo) {
        sessionStorage.removeItem('encuentroActivo');
        // Opcional: enviar solicitud al backend para marcar como finalizado
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [encuentroActivo]);


  const obtenerUbicacion = async (): Promise<PuntoGeografico> => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
            descripcion: 'Ubicación automática del entrevistador',
          });
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          // Si falla la geolocalización, usar valores por defecto en lugar de rechazar
          resolve({
            latitud: 0,
            longitud: 0,
            descripcion: 'Ubicación por defecto (geolocalización falló)',
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      // Si no hay soporte de geolocalización, usar valores por defecto
      resolve({
        latitud: 0,
        longitud: 0,
        descripcion: 'Ubicación por defecto (sin soporte de geolocalización)',
      });
    }
  });
};

  const iniciarEncuentro = async (observaciones: string) => {
  try {
    // 1. Obtener ubicación actual
    const ubicacion = await obtenerUbicacion();
    
    // 2. Registrar el punto geográfico en el backend
    const puntoResponse = await axios.post(`${API_URL}/api/personas/puntos`, {
      latitud: ubicacion.latitud,
      longitud: ubicacion.longitud,
      descripcion: ubicacion.descripcion,
    });

    const idPunto = puntoResponse.data.idPunto;

    // 3. Crear el encuentro activo en el estado
    const nuevoEncuentro: EncuentroActivo = {
      idEncuentro: null,
      idPunto, // Guardar el ID del punto
      ubicacion,
      fecha: new Date().toISOString(),
      observaciones,
    };

    setEncuentroActivo(nuevoEncuentro);
  } catch (error) {
    console.error('Error iniciando encuentro:', error);
    throw error;
  }
};
  const finalizarEncuentro = () => {
    setEncuentroActivo(null);
  };

  return (
    <EncuentroContext.Provider value={{
      encuentroActivo,
      iniciarEncuentro,
      finalizarEncuentro,
      estaEnEncuesta: !!encuentroActivo,
    }}>
      {children}
    </EncuentroContext.Provider>
  );
};

export const useEncuentro = () => {
  const context = useContext(EncuentroContext);
  if (!context) {
    throw new Error('useEncuentro debe usarse dentro de EncuentroProvider');
  }
  return context;
};