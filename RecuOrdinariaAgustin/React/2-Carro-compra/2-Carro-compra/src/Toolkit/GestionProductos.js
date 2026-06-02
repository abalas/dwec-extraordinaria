
class GestionProductos{
  
  eliminar(){

  }

  anadir(setProductos,productos,nombre){
    
    setProductos([...productos, nombre]);
  }
  
  limpiarCarrito(setProductos,setTotal){
    setProductos([]);
    setTotal(0);
  }

}

export default new GestionProductos();
