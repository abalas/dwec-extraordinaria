
class GestionProductos{

  // Elimina TODAS las unidades de un producto (por nombre) del carrito
  eliminar(setProductos, productos, nombre){

    setProductos(productos.filter((p) => p !== nombre));
  }

  // Añade UNA unidad del producto al carrito
  anadir(setProductos,productos,nombre){

    setProductos([...productos, nombre]);
  }

  // Quita UNA sola unidad del producto (deja el resto de unidades intactas)
  disminuir(setProductos, productos, nombre){

    const indice = productos.indexOf(nombre);
    if (indice === -1) return;
    const copia = [...productos];
    copia.splice(indice, 1);
    setProductos(copia);
  }

  limpiarCarrito(setProductos,setTotal){
    setProductos([]);
    setTotal(0);
  }

}

export default new GestionProductos();
