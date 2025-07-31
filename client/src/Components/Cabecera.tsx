import './Cabecera.css' ;
import logo from '../assets/images.jpeg'; 

const Cabecera = () => {
    return (
        <div className="Cabecera">
            <img src={logo} alt="Logo de Mi Aplicación" className="Cabecera-logo" />
        </div>
    );
};

export default Cabecera;