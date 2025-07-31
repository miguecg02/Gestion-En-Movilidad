import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import './PerfilUsuario.css'; // Archivo CSS para estilos

interface Entrevistador {
  idEntrevistador: number;
  email: string; // Si no necesitas mostrar o editar la contraseña, puedes omitirla
  nombre: string;
  telefono: string;
  organizacion: string;
  fecha_nacimiento: string; // Asegúrate que coincida con el tipo de dato
}

const PerfilUsuario = () => {
  const { user, logout } = useAuth();
  const [entrevistador, setEntrevistador] = useState<Entrevistador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Entrevistador>>({});

  useEffect(() => {
   const fetchEntrevistador = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/api/personas/entrevistadores/${user?.id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    
    // Asegurar que los datos coincidan con la interfaz
    const datosEntrevistador = {
      idEntrevistador: response.data.idEntrevistador,
      email: response.data.email,
      nombre: response.data.nombre || '',
      telefono: response.data.telefono || '',
      organizacion: response.data.organizacion || '',
      fecha_nacimiento: response.data.fecha_nacimiento || null
    };
    
    setEntrevistador(datosEntrevistador);
    setFormData(datosEntrevistador);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Error detallado:', err.response?.data || err.message);
    } else {
      console.error('Error detallado:', (err as Error).message);
    }
    setError('Error al cargar los datos del usuario. Por favor intenta nuevamente.');
  } finally {
    setLoading(false);
  }
};

    if (user?.id) {
      fetchEntrevistador();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
  `http://localhost:3001/api/personas/entrevistadores/${user?.id}`, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      setEntrevistador(formData as Entrevistador);
      setEditMode(false);
    } catch (err) {
      setError('Error al actualizar los datos');
      console.error(err);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Cargando información del usuario...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p className="error-message">{error}</p>
      <button onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  );

  return (
    <div className="perfil-usuario-container">
      <h2>Perfil de Usuario</h2>
      
      {!entrevistador ? (
        <p className="no-data">No se encontraron datos del usuario</p>
      ) : editMode ? (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              required
              disabled // El email no debería ser editable normalmente
            />
          </div>
          
          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Organización:</label>
            <input
              type="text"
              name="organizacion"
              value={formData.organizacion || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Fecha de nacimiento:</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento?.toString().substring(0, 10) || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => setEditMode(false)} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              Guardar cambios
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <p><strong>Nombre:</strong> {entrevistador.nombre}</p>
          <p><strong>Email:</strong> {entrevistador.email}</p>
          <p><strong>Teléfono:</strong> {entrevistador.telefono || 'N/A'}</p>
          <p><strong>Organización:</strong> {entrevistador.organizacion || 'N/A'}</p>
          <p><strong>Fecha de nacimiento:</strong> {entrevistador.fecha_nacimiento?.toString().substring(0, 10) || 'N/A'}</p>
          
          <div className="profile-actions">
            {user?.rol === 'Coordinador' && (
              <button 
                onClick={() => setEditMode(true)}
                className="edit-btn"
              >
                Editar Perfil
              </button>
            )}
            <button onClick={logout} className="logout-btn">
              Cerrar sesión
            </button>
          </div>
        </div>  
      )}
    </div>
  );
};

export default PerfilUsuario;