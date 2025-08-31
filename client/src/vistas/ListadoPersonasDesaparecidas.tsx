import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './ListadoPersonas.css';
import { API_URL } from "../config";

interface PersonaDesaparecida {
  idPersona: number;
  Nombre: string;
  PrimerApellido: string;
  Situacion: string;
  FechaUltimaComunicacion: string;
  Nacionalidad?: string;
  PaisDestino?: string;
  idEntrevistador: number;
  Imagen?: string;
}

interface Nacionalidad {
  id: number;
  nacionalidad: string;
}


const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};


const ListadoPersonasDesaparecidas = () => {
  const { user } = useAuth();
  const [personas, setPersonas] = useState<PersonaDesaparecida[]>([]);
  const [nacionalidades, setNacionalidades] = useState<Nacionalidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    nombre: '',
    apellido: '',
    nacionalidad: '',
    paisDestino: ''
  });
  const navigate = useNavigate();
 const debouncedFiltros = useDebounce(filtros, 500);



  useEffect(() => {
    const cargarNacionalidades = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/personas/naciones/listado`);
        setNacionalidades(response.data);
      } catch (err) {
        console.error('Error al cargar nacionalidades:', err);
      }
    };

    cargarNacionalidades();
  }, []);

  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        setLoading(true);
        const params: any = {
         Nombre: debouncedFiltros.nombre,
          PrimerApellido: debouncedFiltros.apellido,
          Situacion: 'Desaparecida',
          Nacionalidad: debouncedFiltros.nacionalidad,
          PaisDestino: debouncedFiltros.paisDestino
        };
        console.log('Parámetros enviados:', params); // ← Agrega esto

        if (user?.rol === 'Registrador') {
          params.idEntrevistador = user.id;
        }

        const response = await axios.get(`${API_URL}/api/personas`, { params });
        setPersonas(response.data);
        setError('');
      } catch (err) {
        setError('Error al cargar las personas desaparecidas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarPersonas();
  }, [debouncedFiltros, user]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };
  const handleEditar = (persona: PersonaDesaparecida) => {
  if (user?.rol !== 'Coordinador') {
    alert('Solo los coordinadores pueden editar registros');
    return;
  }
  navigate(`/editar/${persona.idPersona}`);
};


const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

  const handleVisualizar = (persona: PersonaDesaparecida) => {
    navigate(`/verDesaparecida/${persona.idPersona}`);
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="listado-container">
      <h2>Listado de Personas Desaparecidas</h2>
      
      <div className="filtros-container">
        <div className="filtros-row">
          <div className="filtro-item">
            <label>Nombre:</label>
            <input 
              type="text" 
              name="nombre"
              value={filtros.nombre} 
              onChange={handleFiltroChange}
              placeholder="Filtrar por nombre"
            />
          </div>
          
          <div className="filtro-item">
            <label>Primer Apellido:</label>
            <input 
              type="text" 
              name="apellido"
              value={filtros.apellido} 
              onChange={handleFiltroChange}
              placeholder="Filtrar por apellido"
            />
          </div>
          
          <div className="filtro-item">
            <label>Nacionalidad:</label>
            <select 
              name="nacionalidad"
              value={filtros.nacionalidad} 
              onChange={handleFiltroChange}
            >
              <option value="">Todas</option>
              {nacionalidades.map((nacionalidad) => (
                <option key={nacionalidad.id} value={nacionalidad.nacionalidad}>
                  {nacionalidad.nacionalidad}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="filtros-row">
          <div className="filtro-item">
            <label>País Destino:</label>
            <select 
              name="paisDestino"
              value={filtros.paisDestino} 
              onChange={handleFiltroChange}
            >
              <option value="">Todos</option>
              <option value="México">México</option>
              <option value="Estados Unidos">Estados Unidos</option>
            </select>
          </div>
          
          <div className="filtro-item">
            <button 
              className="btn-limpiar"
              onClick={() => setFiltros({
                nombre: '',
                apellido: '',
                nacionalidad: '',
                paisDestino: ''
              })}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      <table className="personas-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Primer Apellido</th>
            <th>Nacionalidad</th>
            <th>País Destino</th>
            <th>Última Comunicación</th>
            <th>Acciones</th>
            {user?.rol === 'Coordinador' && <th>Editar</th>} {/* Add this column */}
          </tr>
        </thead>
        <tbody>
  {personas.length === 0 ? (
    <tr>
      <td colSpan={user?.rol === 'Coordinador' ? 9 : 8} className="no-results"> {/* Adjust colSpan */}
        No se encontraron personas desaparecidas con los filtros aplicados
      </td>
    </tr>
  ) : (
    personas.map((persona) => (
      <tr key={persona.idPersona}>
        <td>
          {persona.Imagen ? (
            <img 
              src={persona.Imagen} 
              alt={`${persona.Nombre} ${persona.PrimerApellido}`}
              className="persona-imagen"
            />
          ) : (
            <div className="imagen-placeholder">Sin imagen</div>
          )}
        </td>
        <td>{persona.idPersona}</td>
        <td>{persona.Nombre}</td>
        <td>{persona.PrimerApellido}</td>
        <td>{persona.Nacionalidad || 'N/A'}</td>
        <td>{persona.PaisDestino || 'N/A'}</td>
        <td>{formatDate(persona.FechaUltimaComunicacion) || 'N/A'}</td>
        <td>
          <button 
            className="btn-ver"
            onClick={() => handleVisualizar(persona)}
          >
            Visualizar
          </button>
        </td>
      {user && user.rol === 'Coordinador' && (
        <td>
          <button 
            className="btn-editar"
            onClick={() => handleEditar(persona)}
          >
            Editar
          </button>
        </td>
      )}
      </tr>
    ))
  )}
</tbody>
      </table>
    </div>
  );
};

export default ListadoPersonasDesaparecidas;