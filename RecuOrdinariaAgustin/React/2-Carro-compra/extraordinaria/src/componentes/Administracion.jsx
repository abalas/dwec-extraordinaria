import { useEffect, useState } from "react";
import servicioProductos from "../servicios/axios/servicioProductos";
import Swal from "sweetalert2";
import ProductoConsultar from "./crud-productos/ProductoConsultar";
import ProductoBorrar from "./crud-productos/ProductoBorrar";
import ProductoCrear from "./crud-productos/ProductoCrear";
import ProductoEditar from "./crud-productos/ProductoEditar";
import Modal from "./Modal";
import '../estilos/Administracion.css';

const Administracion = () => {
  // Variables de Videojuegos
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState({ "id": null, "url": null, "nombre": null, "precio": null });

const [modals, setModals] = useState({
  consultar: false,
  crear: false,
  editar: false,
});

  const gestionarModal = (tipoModal, estadoAbierto) => {
    //setModals((previoModals) => ({ ...previoModals, [tipoModal]: estadoAbierto }));

    setModals({
      ...modals,
      [tipoModal]: estadoAbierto,
    });


  };


  // ************************************************
  // Carga inicial de todos los videojuegos,
  // Gracias a UseEffect, se ejecuta una única vez
  // ************************************************
  useEffect(() => {
    servicioProductos.getAll()
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {

        Swal.fire({
          title: "¿Tienes Internet?",
          text: "No consigo descargar los videojuegos :(",
          icon: "question"
        });
      });
  }, []);

  // ************************************************
  // Manejadores de Eventos de : editar , crear y borrar
  // Gracias a UseEffect, se ejecuta una única vez
  // ************************************************
  const consultarProducto = (producto) => {


    setProductoSeleccionado(producto);
    gestionarModal("consultar", true)
  };


  const borrarProducto = (producto) => {

    ProductoBorrar(producto, productos, setProductos)
  }

  // Abre el modal de edición con el videojuego seleccionado
  const EditarProducto = (producto) => {

    setProductoSeleccionado(producto);
    gestionarModal("editar", true)
  }

// Añadir un videojuego nuevo a la lista
const crearProducto = (producto) => {
  // Generamos un id nuevo a partir del id más alto existente
  const nuevoId =
    productos.length > 0
      ? String(Math.max(...productos.map((p) => Number(p.id))) + 1)
      : "1";

  const productoConId = { id: nuevoId, ...producto };

  // Persistimos en json-server (POST). Solo si el servidor responde OK
  // actualizamos el estado local, así el cambio queda guardado de verdad.
  servicioProductos.create(productoConId)
    .then((response) => {
      setProductos([...productos, response.data]);

      gestionarModal("crear", false);
      Swal.fire({
        title: "Creado",
        text: "Videojuego añadido correctamente",
        icon: "success",
      });
    })
    .catch(() => {
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el videojuego (¿está el json-server levantado?)",
        icon: "error",
      });
    });
};

// Actualizar un videojuego existente (reemplazamos por id)
const editarProducto = (productoEditado) => {
  // Persistimos el cambio en json-server (PUT) y luego refrescamos el estado.
  servicioProductos.update(productoEditado.id, productoEditado)
    .then((response) => {
      setProductos(
        productos.map((p) => (p.id === productoEditado.id ? response.data : p))
      );

      gestionarModal("editar", false);
      Swal.fire({
        title: "Actualizado",
        text: "Videojuego actualizado correctamente",
        icon: "success",
      });
    })
    .catch(() => {
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el videojuego (¿está el json-server levantado?)",
        icon: "error",
      });
    });
};

  return (
    <>
        {/* Botón para abrir el formulario de alta */}
    <button onClick={() => gestionarModal("crear", true)}>
      Añadir videojuego
    </button>

      <ul className="aficiones-list">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <li key={producto.id} className="aficion-item">
              <div>
                <strong>{producto.nombre}</strong>
                <strong>{producto.categoria}</strong>
                <strong>{producto.precio} €</strong>
              </div>
              <div>
                <button onClick={() => consultarProducto(producto)}>Consulta</button>
                <button onClick={() => borrarProducto(producto)}>Borrar</button>
                <button onClick={() => EditarProducto(producto)}>Editar</button>
              </div>
            </li>
          ))
        ) : (
          <p>No se encontraron videojuegos.</p>
        )}
      </ul>

    <Modal isOpen={modals.consultar} onClose={() => gestionarModal("consultar", false)}>
      <ProductoConsultar producto={productoSeleccionado} />
    </Modal>

    {/* Modal con el formulario de alta */}
    <Modal isOpen={modals.crear} onClose={() => gestionarModal("crear", false)}>
      <ProductoCrear onCrear={crearProducto} />
    </Modal>

    {/* Modal con el formulario de edición */}
    <Modal isOpen={modals.editar} onClose={() => gestionarModal("editar", false)}>
      <ProductoEditar producto={productoSeleccionado} onEditar={editarProducto} />
    </Modal>

  </>
  );
};

export default Administracion;
