// AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
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
    if (token && user) {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token, user]);

  const login = async (email: string, password: string) => {
  try {
    const response = await axios.post("http://localhost:3001/api/login", { email, password });
    const { token: authToken, userId, nombre, rol } = response.data; // Asegurar que se recibe el rol

    setToken(authToken);
    setUser({
      id: userId,
      nombre,
      email,
      rol // Guardar el rol en el estado
    });
  }  catch (error: any) {
    // ... manejo de errores ...
  }
};

  const logout = () => {
    
    setToken(null);
    setUser(null);
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
