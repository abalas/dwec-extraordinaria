import React, { useState } from "react";
import "../estilos/menu.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const MenuSuperior = ({ total, productos }) => {
  const [carritoVisible, setCarritoVisible] = useState(false);
  const { user, signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
  };

  const toggleCarrito = () => {
    setCarritoVisible(!carritoVisible);
  };

  return (
    <div className="menu-superior">
      {/* Icono a la izquierda */}
      <nav>
      <ul>
        <li> <img
        src="/imagenes/supermercado.png"
        alt="Supermercado"
        className="icono-supermercado"
      /></li>
       <li className="auth-section">
        {user ? (
          <>
            <span>Bienvenido, {user.email}</span>
            <button onClick={handleLogout}>Cerrar Sesión</button>            
          </>
        ) : (
          <Link to="/login">Iniciar Sesión</Link>
        )}
      </li>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/detalle-carrito">Detalle</Link></li>
        <li><Link to="/autor">Autor</Link></li>
         {user ? (
        <li><Link to="/admin">Administracion</Link></li>
         ):
         <></>
         }
        <li><Link to="/rebajas">Rebajas</Link></li>
        <li className="carrito-texto">{productos.length} : {total}Є</li>
        <li><button className="toggle-carrito" onClick={toggleCarrito}>
        🛒
      </button></li>
      <li>
         {/* Carrito de productos */}
      {carritoVisible && (
        <div className="carrito-productos">
          <h4>Carrito</h4>
          { productos.length > 0 ? (
            <ul>
              { productos.map((producto, index) => (
                <li key={index}>{producto}</li>
              ))}
            </ul>
          ) : (
            <p>No hay productos en el carrito.</p>
          )}
        </div>
      )}
      </li>
      </ul>     
    </nav>
    </div>   
  );
};

export default MenuSuperior;
