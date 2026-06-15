import { useEffect, useState } from 'react';
import '../estilos/DetalleProducto.css';
import { useParams } from 'react-router-dom';
import servicioProductos from '../servicios/axios/servicioProductos';

const DetalleProducto = ({}) => {  

  const idProducto = useParams().id  
  console.log(idProducto)  
// Variables de Estado  
const [producto, setProducto] = useState( { "id":null,"url": null, "nombre": null, "precio": null })

// Cada vez que renderizo el componente, hace esta petición AXIOS
// Para mostrar los productos actualizados
useEffect(() => {  
    servicioProductos.get(idProducto)
      .then((response) => {
        setProducto(response.data);

        console.log(response.data)
      })
      .catch((error) => {       
          alert("Tienes internet, está levantado el JSON-server")
      });
  }, []);
 
  return (
    <main className="main-container">
      <div className="producto-card">
        {/* Imagen del producto */}
        <div className="producto-imagen-container">
          <img 
            src={`.${producto.url}`} 
            alt={producto.nombre}
            className="producto-imagen"
          />
        </div>

        {/* Información del producto */}
        <div className="producto-contenido">
          <span className="producto-id">REF: {producto.id} · {producto.categoria}</span>
          <h2 className="producto-nombre">{producto.nombre}</h2>

          <div className="producto-precio-container">
            <span className="precio-simbolo">€</span>
            <span className="precio-valor">{producto.precio}</span>
          </div>

          <div className="producto-descripcion">
            <p>{producto.descripcion}</p>
          </div>

          <button className="btn-comprar">
            Añadir al carrito
            <span className="btn-icon">🛒</span>
          </button>
        </div>
      </div>
    </main>
  );

};

export default DetalleProducto ;
