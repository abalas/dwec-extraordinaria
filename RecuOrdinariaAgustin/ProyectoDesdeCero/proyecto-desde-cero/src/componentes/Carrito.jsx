import { useState, useEffect } from 'react';

export default function Carrito() {
  const [elementosCarrito, setElementosCarrito] = useState([]);

  // 1. Cargar el carrito al entrar a la página (GET)
  useEffect(() => {
    fetch("http://localhost:3000/carrito")
      .then(res => res.json())
      .then(data => setElementosCarrito(data));
  }, []);

  // 2. Modificar unidades (PATCH)
  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return; // Evita cantidades negativas

    fetch(`http://localhost:3000/carrito/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad: nuevaCantidad })
    })
    .then(res => res.json())
    .then(itemActualizado => {
      // Actualizamos el estado de React para que se refleje en la pantalla inmediatamente
      setElementosCarrito(elementosCarrito.map(item => 
        item.id === id ? itemActualizado : item
      ));
    });
  };

  // 3. Eliminar producto del carrito (DELETE)
  const eliminarDelCarrito = (id) => {
    fetch(`http://localhost:3000/carrito/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      // Filtramos el estado para quitar el objeto borrado
      setElementosCarrito(elementosCarrito.filter(item => item.id !== id));
    });
  };

  return (
    <div className="carrito-container">
      <h2>Tu Cesta de Videojuegos</h2>
      {elementosCarrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        elementosCarrito.map(item => (
          <div key={item.id} className="item-carrito">
            <h3>{item.nombre}</h3>
            <p>Precio unitario: {item.precio}€</p>
            
            {/* Controles de cantidad */}
            <div className="controles">
              <button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>-</button>
              <span>{item.cantidad}</span>
              <button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</button>
            </div>

            <p>Subtotal: {item.precio * item.cantidad}€</p>
            
            {/* Botón eliminar */}
            <button className="btn-eliminar" onClick={() => eliminarDelCarrito(item.id)}>
              Eliminar por completo
            </button>
          </div>
        ))
      )}
    </div>
  );
}