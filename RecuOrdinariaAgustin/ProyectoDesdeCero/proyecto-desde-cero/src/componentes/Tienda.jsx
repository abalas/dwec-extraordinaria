import { useState, useEffect } from 'react';

export default function Tienda() {
  const [juegos, setJuegos] = useState([]);

  // Cargar los videojuegos desde el json-server al entrar
  useEffect(() => {
    fetch("http://localhost:3000/productos")
      .then(res => res.json())
      .then(data => setJuegos(data));
  }, []);

  // Función para añadir al carrito (POST)
  const añadirAlCarrito = (juego) => {
    fetch("http://localhost:3000/carrito", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productoId: juego.id,
        nombre: juego.nombre,
        precio: juego.precio,
        cantidad: 1
      })
    })
    .then(res => res.json())
    .then(() => alert(`¡${juego.nombre} añadido al carrito!`));
  };

  return (
    <div>
      <h2>Catálogo de Videojuegos</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        {juegos.map(juego => (
          <div key={juego.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <h3>{juego.nombre}</h3>
            <p>Precio: {juego.precio}€</p>
            <button onClick={() => añadirAlCarrito(juego)}>Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
}