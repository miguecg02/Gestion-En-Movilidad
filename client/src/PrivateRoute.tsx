import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useRef } from "react";

const PrivateRoute = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);

useEffect(() => {
  const currentPath = location.pathname + location.search;
  
  if (isAuthenticated && user?.rol === "Coordinador" && currentPath !== lastPathRef.current) {
    lastPathRef.current = currentPath;
    const event = new Event('reloadNotifications');
    window.dispatchEvent(event);
    
    // Agregar recarga periódica cada 2 minutos
    const interval = setInterval(() => {
      window.dispatchEvent(new Event('reloadNotifications'));
    }, 120000);
    
    return () => clearInterval(interval);
  }
}, [isAuthenticated, user, location]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;