// IniciarEncuentros.tsx
import { useEffect } from 'react';
import { useEncuentro } from '../vistas/EncuentroContext';
import { useAuth } from '../AuthContext';

const IniciarEncuentro = () => {
  const { iniciarEncuentro } = useEncuentro();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const iniciar = async () => {
      if (isAuthenticated && user) {
        try {
          await iniciarEncuentro("Encuentro iniciado automáticamente al autenticar");
        } catch (error) {
          console.error('Error al iniciar encuentro:', error);
        }
      }
    };
    
    iniciar();
  }, [isAuthenticated, user, iniciarEncuentro]);

  return null;
};

export default IniciarEncuentro;