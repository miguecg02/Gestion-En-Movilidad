// AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { API_URL } from "./config";
import axios from "axios";
interface UserData {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}




interface AuthContextType {
  token: string | null;
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("token"));
  const [user, setUser] = useState<UserData | null>(() => {
    const userData = sessionStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const isAuthenticated = Boolean(token);

  useEffect(() => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    sessionStorage.setItem("token", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    sessionStorage.removeItem("token");
  }
}, [token]);

 interface UserData {
  id: number;
  nombre: string;
  email: string;
  rol: string; 
}

const login = async (email: string, password: string) => {
  try {
    // Usar variable de entorno para la URL base
     const baseUrl = window.location.hostname.includes('localhost') 
      ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001')
      : 'https://gestion-en-movilidad-backend.vercel.app';

    const response = await axios.post(`${API_URL}/api/login`, { email, password });
    
    const { token: authToken, userId, nombre, rol } = response.data;
    
    setToken(authToken);
    setUser({
      id: userId,
      nombre,
      email,
      rol
    });

    return rol;
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.response) {
      throw new Error(error.response.data.error || "Error de autenticación");
    } else {
      throw new Error("Error de conexión con el servidor");
    }
  }
};

// En AuthContext.tsx
const logout = () => {
  setToken(null);
  setUser(null);
  // Limpiar sessionStorage
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  // Eliminar el header de axios
  delete axios.defaults.headers.common["Authorization"];
};

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
