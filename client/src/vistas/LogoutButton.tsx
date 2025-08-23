 
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import './LogoutButton.css'; 
const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;