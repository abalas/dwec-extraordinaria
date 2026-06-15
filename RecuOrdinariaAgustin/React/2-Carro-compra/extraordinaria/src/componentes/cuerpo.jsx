import { useEffect, useState } from 'react';
import '../estilos/cuerpo.css';
import servicioProductos from '../servicios/axios/servicioProductos';
import GestionProductos from '../Toolkit/GestionProductos';
import { Link } from 'react-router-dom';

// Componente ListaImagenes
const ListaProductos = ({ total, setTotal, productos, setProductos }) => {

  // Variables de Estado  
  const [imageUrls, setImageUrls] = useState([])

  // Cada vez que renderizo el componente, hace esta petición AXIOS
  // Para mostrar los productos actualizados
  useEffect(() => {
    servicioProductos.getAll()
      .then((response) => {
        setImageUrls(response.data);


      })
      .catch((error) => {

        alert("Tienes internet, está levantado el JSON-server")
      });
  }, []);


  // Función para añadir productos al carrito
  const AnadirProducto = (nombre, precio) => {

    GestionProductos.anadir(setProductos, productos, nombre)
    setTotal(total + precio);

  };

  return (
    <div className="productos-contenedor">
      {
        imageUrls.map((item, index) => {
          if (item.ocasion === false) {
            return (

              <div key={index} className="producto-tarjeta">
                {/* Imagen de fondo que ocupa toda la tarjeta */}
                <div className="producto-imagen-fondo">
                  <img
                    src={item.url}
                    alt={item.nombre}
                    className="producto-img-fondo"
                  />
                </div>

                {/* Contenedor centrado sobre la imagen */}
                <div className="producto-contenido-centrado">

                  {/* Nombre del producto */}
                  <div className="producto-nombre-centrado">
                    <h3 className="producto-titulo">{item.nombre}</h3>
                  </div>

                  {/* Precio del producto */}
                  <div className="producto-precio-centrado">
                    <p className="producto-precio">{item.precio} €</p>
                  </div>

                  {/* Botón de añadir al carrito */}
                  <div className="producto-boton-centrado">
                    <button
                      className="producto-boton"
                      onClick={() => AnadirProducto(item.nombre, item.precio)}
                    >
                      Añadir al carrito
                    </button>
                  </div>

                  {/* Enlace a detalle del producto */}
                  <div className="producto-link-centrado">
                    <Link to={`/producto/${item.id}`} className="producto-link">
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            )
          } // fin del IF
        }
        )
      }
    </div>
  );
};

export default ListaProductos;
