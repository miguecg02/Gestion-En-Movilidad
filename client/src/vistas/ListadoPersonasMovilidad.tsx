import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './ListadoPersonasMovilidad.css'; 

interface PersonaEnMovilidad {
  idPersona: number;
  Nombre: string;
  PrimerApellido: string;
  Situacion: string;
  FechaUltimaComunicacion: string;
  Nacionalidad?: string;
  PaisDestino?: string;
  idEntrevistador: number;
  Imagen?: string; // Propiedad añadida para la URL de la imagen
}

const ListadoPersonasMovilidad = () => {
  const { user } = useAuth();
  const [personas, setPersonas] = useState<PersonaEnMovilidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    nombre: '',
    apellido: '',
    situacion: '',
    nacionalidad: '',
    paisDestino: ''
  });
  const navigate = useNavigate();

  const handleVisualizar = (persona: PersonaEnMovilidad) => {
    navigate(`/verEnMovilidad/${persona.idPersona}`);
  };

  const handleEditar = (persona: PersonaEnMovilidad) => {
    if (user?.rol !== 'Coordinador') {
      alert('Solo los coordinadores pueden editar registros');
      return;
    }
    navigate(`/editarEnMovilidad/${persona.idPersona}`);
  };

  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        setLoading(true);
        const params: any = {
          Nombre: filtros.nombre,
          PrimerApellido: filtros.apellido,
          Situacion: filtros.situacion,
          Nacionalidad: filtros.nacionalidad,
          PaisDestino: filtros.paisDestino
        };

        if (user?.rol === 'Registrador') {
          params.idEntrevistador = user.id;
        }

        const response = await axios.get('http://localhost:3001/api/personas', {
          params
        });
        
        setPersonas(response.data);
        setError('');
      } catch (err) {
        setError('Error al cargar las personas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarPersonas();
  }, [filtros, user]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="listado-container">
      <h2>Listado de Personas en Movilidad</h2>
      
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
            <input 
              type="text" 
              name="nacionalidad"
              value={filtros.nacionalidad} 
              onChange={handleFiltroChange}
              placeholder="Filtrar por nacionalidad"
            />
          </div>
        </div>
        
        <div className="filtros-row">
          <div className="filtro-item">
            <label>Situación:</label>
            <select 
              name="situacion"
              value={filtros.situacion} 
              onChange={handleFiltroChange}
            >
              <option value="">Todas</option>
              <option value="En Movilidad">En Movilidad</option>
              <option value="Desaparecido">Desaparecido</option>
            </select>
          </div>
          
          <div className="filtro-item">
            <label>País Destino:</label>
            <input 
              type="text" 
              name="paisDestino"
              value={filtros.paisDestino} 
              onChange={handleFiltroChange}
              placeholder="Filtrar por país destino"
            />
          </div>
          
          <div className="filtro-item">
            <button 
              className="btn-limpiar"
              onClick={() => setFiltros({
                nombre: '',
                apellido: '',
                situacion: '',
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
            <th>Situación</th>
            <th>Última Comunicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.length === 0 ? (
            <tr>
              <td colSpan={9} className="no-results">
                No se encontraron personas con los filtros aplicados
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
                <td className={`situacion-${persona.Situacion.toLowerCase().replace(' ', '-')}`}>
                  {persona.Situacion}
                </td>
                <td>{persona.FechaUltimaComunicacion || 'N/A'}</td>
                <td>
                  <button 
                    className="btn-ver"
                    onClick={() => handleVisualizar(persona)}
                  >
                    Visualizar
                  </button>

                  {user?.rol === 'Coordinador' && (
                    <button 
                      className="btn-editar"
                      onClick={() => handleEditar(persona)}
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListadoPersonasMovilidad;