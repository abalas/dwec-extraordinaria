import React, { useState, useEffect } from 'react';
import '../estilos/DetalleCarrito.css';
import { Link } from 'react-router-dom';
import GestionProductos from '../Toolkit/GestionProductos';


const DetalleCarrito = ({ productos, total, setProductos, setTotal }) => {  
 
  // Estado para agrupar productos y contar cantidades
  const [productosAgrupados, setProductosAgrupados] = useState([]);

  // Función para eliminar un producto del carrito
  const eliminarProducto = (nombre) => {
    alert("Pendiente de implementar...")
  };

  // Función para vaciar todo el carrito
  const vaciarCarrito = () => {

    GestionProductos.limpiarCarrito(setProductos, setTotal)   
  };

  // Función para aumentar cantidad
  const aumentarCantidad = (nombre) => {
    
    GestionProductos.anadir(setProductos,productos,nombre)
    //setProductos([...productos, nombre]);
  };

  // Función para disminuir cantidad
  const disminuirCantidad = (nombre) => {
    alert("Pendiente de implementar...")

  };

  return (
    <div className="carrito-contenedor">
      <h1 className="carrito-titulo">Tu Carrito de Compras</h1>
      
      {productos.length === 0 ? (
        <div className="carrito-vacio">
          <p className="carrito-vacio-texto">Tu carrito está vacío</p>
          <Link to="/" className="carrito-vacio-boton">
            Seguir comprando
          </Link>
        </div>
      ) : (
        <>
          <div className="carrito-productos-detalle">
            {productos.map((producto, index) => (
              <div key={index} className="carrito-producto">
                <div className="carrito-producto-info">
                  <h3 className="carrito-producto-nombre">{producto}</h3>
                  <p className="carrito-producto-cantidad">
                    Cantidad: 1
                  </p>
                </div>
                
                <div className="carrito-producto-controls">
                  <button 
                    className="carrito-control-btn"
                    onClick={() => disminuirCantidad(producto)}
                  >
                    -
                  </button>
                  <span className="carrito-cantidad"> 1 </span>
                  <button 
                    className="carrito-control-btn"
                    onClick={() => aumentarCantidad(producto)}
                  >
                    +
                  </button>
                  
                  <button 
                    className="carrito-eliminar-btn"
                    onClick={() => eliminarProducto(producto)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-resumen">
            <div className="carrito-total">
              <h3>Total: {total.toFixed(2)} €</h3>
            </div>
            
            <div className="carrito-acciones">
              <button 
                className="carrito-vaciar-btn"
                onClick={vaciarCarrito}
              >
                Vaciar Carrito
              </button>
              
              <button className="carrito-pagar-btn">
                Proceder al Pago
              </button>
            </div>

            <Link to="/" className="carrito-seguir-comprando">
              ← Seguir comprando
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default DetalleCarrito;