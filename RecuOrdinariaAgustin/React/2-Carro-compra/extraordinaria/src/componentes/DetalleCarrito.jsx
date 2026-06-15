import React, { useState, useEffect } from 'react';
import '../estilos/DetalleCarrito.css';
import { Link } from 'react-router-dom';
import GestionProductos from '../Toolkit/GestionProductos';
import servicioProductos from '../servicios/axios/servicioProductos';


const DetalleCarrito = ({ productos, total, setProductos, setTotal }) => {

  // Estado para agrupar productos y contar cantidades
  const [productosAgrupados, setProductosAgrupados] = useState([]);

  // Mapa nombre -> precio, necesario para recalcular totales del carrito
  const [precios, setPrecios] = useState({});

  // Cargamos el catálogo una vez para conocer el precio de cada videojuego
  useEffect(() => {
    servicioProductos.getAll()
      .then((response) => {
        const mapa = {};
        response.data.forEach((item) => {
          mapa[item.nombre] = item.precio;
        });
        setPrecios(mapa);
      })
      .catch((error) => {
        alert("Tienes internet, está levantado el JSON-server")
      });
  }, []);

  // Cada vez que cambia el carrito, reagrupamos por nombre contando unidades
  useEffect(() => {
    const mapa = {};
    productos.forEach((nombre) => {
      mapa[nombre] = (mapa[nombre] || 0) + 1;
    });
    const agrupados = Object.entries(mapa).map(([nombre, cantidad]) => ({ nombre, cantidad }));
    setProductosAgrupados(agrupados);
  }, [productos]);

  // Cantidad total de unidades en el carrito
  const totalUnidades = productos.length;

  // Total calculado automáticamente a partir de las unidades y sus precios
  const totalCalculado = productosAgrupados.reduce(
    (acc, item) => acc + (precios[item.nombre] || 0) * item.cantidad,
    0
  );

  // Función para eliminar un producto del carrito (todas sus unidades)
  const eliminarProducto = (nombre) => {
    const unidades = productos.filter((p) => p === nombre).length;
    GestionProductos.eliminar(setProductos, productos, nombre);
    setTotal(total - (precios[nombre] || 0) * unidades);
  };

  // Función para vaciar todo el carrito
  const vaciarCarrito = () => {

    GestionProductos.limpiarCarrito(setProductos, setTotal)
  };

  // Función para aumentar cantidad
  const aumentarCantidad = (nombre) => {

    GestionProductos.anadir(setProductos, productos, nombre)
    setTotal(total + (precios[nombre] || 0));
  };

  // Función para disminuir cantidad
  const disminuirCantidad = (nombre) => {

    GestionProductos.disminuir(setProductos, productos, nombre)
    setTotal(total - (precios[nombre] || 0));
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
            {productosAgrupados.map((producto, index) => (
              <div key={index} className="carrito-producto">
                <div className="carrito-producto-info">
                  <h3 className="carrito-producto-nombre">{producto.nombre}</h3>
                  <p className="carrito-producto-cantidad">
                    {(precios[producto.nombre] || 0).toFixed(2)} € / ud · Subtotal: {((precios[producto.nombre] || 0) * producto.cantidad).toFixed(2)} €
                  </p>
                </div>

                <div className="carrito-producto-controls">
                  <button
                    className="carrito-control-btn"
                    onClick={() => disminuirCantidad(producto.nombre)}
                  >
                    -
                  </button>
                  <span className="carrito-cantidad"> {producto.cantidad} </span>
                  <button
                    className="carrito-control-btn"
                    onClick={() => aumentarCantidad(producto.nombre)}
                  >
                    +
                  </button>

                  <button
                    className="carrito-eliminar-btn"
                    onClick={() => eliminarProducto(producto.nombre)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-resumen">
            <div className="carrito-total">
              <h3>Artículos: {totalUnidades}</h3>
              <h3>Total: {totalCalculado.toFixed(2)} €</h3>
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
