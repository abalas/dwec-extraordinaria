import Swal from "sweetalert2";
import servicioProductos from "../../servicios/axios/servicioProductos";

// Elimina un videojuego de la lista tras confirmación del usuario.
const ProductoBorrar = (producto, productos, setProductos) => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {

            // Borrado persistente: primero en json-server (DELETE) y, si va bien,
            // quitamos el producto del estado por su id.
            servicioProductos.remove(producto.id)
                .then(() => {
                    setProductos(productos.filter((p) => p.id !== producto.id));

                    Swal.fire({
                        title: "Eliminado",
                        text: "El videojuego se ha eliminado correctamente",
                        icon: "success",
                    });
                })
                .catch(() => {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo eliminar el videojuego (¿está el json-server levantado?)",
                        icon: "error",
                    });
                });
        }
    });
};


export default ProductoBorrar;
