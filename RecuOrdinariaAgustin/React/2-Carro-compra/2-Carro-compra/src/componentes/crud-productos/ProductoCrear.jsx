import React, { useState } from 'react';
import Swal from 'sweetalert2';

// Ej.4: formulario para AÑADIR un producto nuevo.
// Recibe onCrear: una función del padre (Administracion) a la que le
// entregamos el producto ya validado.
const ProductoCrear = ({ onCrear }) => {

  // Estado del formulario: un objeto con los tres campos
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    url: "",
  });

  // Cada vez que el usuario escribe, actualizamos el campo correspondiente
  const gestionarCambio = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ej.4: TODOS los campos son obligatorios
    if (form.nombre.trim() === "" || form.precio.trim() === "" || form.url.trim() === "") {
      Swal.fire({
        title: "Faltan datos",
        text: "Todos los campos son obligatorios",
        icon: "warning",
      });
      return;
    }

    // Avisamos al padre con el producto listo (precio como número)
    onCrear({
      nombre: form.nombre,
      precio: Number(form.precio),
      url: form.url,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-crear">
      <h3>Añadir producto</h3>

      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={gestionarCambio}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="precio">Precio</label>
        <input
          id="precio"
          name="precio"
          type="number"
          value={form.precio}
          onChange={gestionarCambio}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">URL de la imagen</label>
        <input
          id="url"
          name="url"
          value={form.url}
          onChange={gestionarCambio}
          required
          placeholder="./imagenes/manzana.jpg"
        />
      </div>

      <button type="submit">Guardar</button>
    </form>
  );
};

export default ProductoCrear;