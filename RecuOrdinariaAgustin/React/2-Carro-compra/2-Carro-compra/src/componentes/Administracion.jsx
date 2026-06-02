import { useEffect, useState } from "react";
import servicioProductos from "../servicios/axios/servicioProductos";
import Swal from "sweetalert2";
import ProductoConsultar from "./crud-productos/ProductoConsultar";
import ProductoBorrar from "./crud-productos/ProductoBorrar";
import ProductoCrear from "./crud-productos/ProductoCrear"; // Ej.4
import Modal from "./Modal";
import '../estilos/Administracion.css';

const Administracion = () => {
  // Variables de Aficiones
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState({ "id": null, "url": null, "nombre": null, "precio": null });

const [modals, setModals] = useState({
  consultar: false,
  crear: false, // Ej.4
});

  const gestionarModal = (tipoModal, estadoAbierto) => {
    //setModals((previoModals) => ({ ...previoModals, [tipoModal]: estadoAbierto }));

    setModals({
      ...modals,
      [tipoModal]: estadoAbierto,
    });


  };


  // ************************************************
  // Carga inicial de todas las aficiones, 
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
          text: "No consigo descargar las aficiones :(",
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

  const EditarProducto = (producto) => {

    alert("Pendiente de implementar ....")
  }
// Ej.4: añadir un producto nuevo a la lista
const crearProducto = (producto) => {
  // Generamos un id nuevo a partir del id más alto existente
  const nuevoId =
    productos.length > 0
      ? String(Math.max(...productos.map((p) => Number(p.id))) + 1)
      : "1";

  const productoConId = { id: nuevoId, ...producto };

  // Lo añadimos al estado (la lista se redibuja sola)
  setProductos([...productos, productoConId]);

  // Cerramos el modal y avisamos
  gestionarModal("crear", false);
  Swal.fire({
    title: "Creado",
    text: "Producto añadido correctamente",
    icon: "success",
  });
};

  return (
    <>
        {/* Ej.4: botón para abrir el formulario de alta */}
    <button onClick={() => gestionarModal("crear", true)}>
      Añadir producto
    </button>
    
      <ul className="aficiones-list">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <li key={producto.id} className="aficion-item">
              <div>
                <strong>{producto.nombre}</strong>
                <strong>{producto.precio}</strong>
              </div>
              <div>
                <button onClick={() => consultarProducto(producto)}>Consulta</button>
                <button onClick={() => borrarProducto(producto)}>Borrar</button>
                <button onClick={() => EditarProducto(producto)}>Editar</button> 
              </div>
            </li>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </ul>

    <Modal isOpen={modals.consultar} onClose={() => gestionarModal("consultar", false)}>
      <ProductoConsultar producto={productoSeleccionado} />
    </Modal>

    {/* Ej.4: modal con el formulario de alta */}
    <Modal isOpen={modals.crear} onClose={() => gestionarModal("crear", false)}>
      <ProductoCrear onCrear={crearProducto} />
    </Modal>

  </>
  );
};

export default Administracion;
