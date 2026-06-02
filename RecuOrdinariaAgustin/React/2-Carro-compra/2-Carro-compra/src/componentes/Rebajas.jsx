import { useEffect, useState } from 'react';
import '../estilos/rebajas.css';
import servicioProductos from '../servicios/axios/servicioProductos';
import GestionProductos from '../Toolkit/GestionProductos';
import { Link } from 'react-router-dom';

// Componente ListaImagenes
const Rebajas = ({ total, setTotal, productos, setProductos }) => {

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
    <div className="rebajas-contenedor">
      {
        imageUrls.map((item, index) => {
          if (item.ocasion === true) {
            return (

              <div key={index} className="rebaja-tarjeta">
                {/* Imagen de fondo que ocupa toda la tarjeta */}
                <div className="rebaja-imagen-fondo">
                  <img
                    src={item.url}
                    alt={item.nombre}
                    className="rebaja-img-fondo"
                  />
                </div>

                {/* Contenedor centrado sobre la imagen */}
                <div className="rebaja-contenido-centrado">

                  {/* Nombre del rebaja */}
                  <div className="rebaja-nombre-centrado">
                    <h3 className="rebaja-titulo">{item.nombre}</h3>
                  </div>

                  {/* Precio del rebaja */}
                  <div className="rebaja-precio-centrado">
                    <p className="rebaja-precio">{item.precio} €</p>
                  </div>

                     {/* Precio del rebaja */}
                  <div className="rebaja-rebaja-centrado">
                    <p className="rebaja-rebaja">{item.porcentaje} %</p>
                  </div>


                  {/* Botón de añadir al carrito */}
                  <div className="rebaja-boton-centrado">
                    <button
                      className="rebaja-boton"
                      onClick={() => AnadirProducto(item.nombre, item.precio)}
                    >
                      Añadir al carrito
                    </button>
                  </div>

                  {/* Enlace a detalle del producto */}
                  <div className="rebaja-link-centrado">
                    <Link to={`/producto/${item.id}`} className="rebaja-link">
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

export default Rebajas;
