import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { validarFormulario, REGLAS_JUEGO } from '../../Toolkit/validaciones';

// Formulario para ACTUALIZAR un videojuego existente.
// Recibe:
//   - producto: el videojuego seleccionado (rellena el formulario)
//   - onEditar: función del padre (Administracion) que recibe el videojuego editado
const ProductoEditar = ({ producto, onEditar }) => {

  // Inicializamos el formulario con los datos del producto seleccionado
  const [form, setForm] = useState({
    nombre: producto?.nombre ?? "",
    precio: producto?.precio ?? "",
    url: producto?.url ?? "",
    categoria: producto?.categoria ?? "",
    descripcion: producto?.descripcion ?? "",
  });

  const [errores, setErrores] = useState({});

  const gestionarCambio = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Misma validación reutilizable que en Crear (solo depende de REGLAS_JUEGO)
    const { valido, errores } = validarFormulario(form, REGLAS_JUEGO);
    if (!valido) {
      setErrores(errores);
      Swal.fire({
        title: "Revisa el formulario",
        text: "Hay campos que no cumplen las reglas",
        icon: "warning",
      });
      return;
    }

    setErrores({});

    // Mantenemos el id original y devolvemos el resto de campos actualizados
    onEditar({
      ...producto,
      nombre: form.nombre,
      precio: Number(String(form.precio).replace(",", ".")),
      url: form.url,
      categoria: form.categoria,
      descripcion: form.descripcion,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-crear">
      <h3>Editar videojuego</h3>

      <div className="form-group">
        <label htmlFor="nombre-edit">Nombre</label>
        <input
          id="nombre-edit"
          name="nombre"
          value={form.nombre}
          onChange={gestionarCambio}
        />
        {errores.nombre && <p className="error-message">{errores.nombre}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="precio-edit">Precio</label>
        <input
          id="precio-edit"
          name="precio"
          type="text"
          value={form.precio}
          onChange={gestionarCambio}
        />
        {errores.precio && <p className="error-message">{errores.precio}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="categoria-edit">Categoría</label>
        <input
          id="categoria-edit"
          name="categoria"
          value={form.categoria}
          onChange={gestionarCambio}
          placeholder="RPG, Shooter, Aventura..."
        />
        {errores.categoria && <p className="error-message">{errores.categoria}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="url-edit">URL de la imagen</label>
        <input
          id="url-edit"
          name="url"
          value={form.url}
          onChange={gestionarCambio}
          placeholder="./imagenes/elden-ring.jpg"
        />
        {errores.url && <p className="error-message">{errores.url}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="descripcion-edit">Descripción</label>
        <textarea
          id="descripcion-edit"
          name="descripcion"
          value={form.descripcion}
          onChange={gestionarCambio}
          rows={3}
        />
        {errores.descripcion && <p className="error-message">{errores.descripcion}</p>}
      </div>

      <button type="submit">Actualizar</button>
    </form>
  );
};

export default ProductoEditar;
