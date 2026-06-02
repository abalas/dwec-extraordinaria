import Swal from "sweetalert2";
import servicioProductos from "../../servicios/axios/servicioProductos";


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


           alert("has confirmado el borrar...")
        }
    });
};


export default ProductoBorrar;