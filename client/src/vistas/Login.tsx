import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
     console.log("API_URL desde env:", import.meta.env.VITE_API_URL);
    e.preventDefault();
    
    setError(null);

    try {
      await login(email, password);
      
      navigate('/');
    } catch (err) {
      
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Correo electrónico</label><br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Contraseña</label><br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Reservar espacio para mensajes de error para evitar que el botón cambie de posición */}
        <div style={{ height: '1.25rem', marginBottom: '1rem', color: 'red' }}>
          {error}
        </div>

        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Entrar</button>
      </form>
    </div>
  );
};

export default Login;
