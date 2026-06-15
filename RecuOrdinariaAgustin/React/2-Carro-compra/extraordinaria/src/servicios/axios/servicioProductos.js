
import http from "./http-axios.js";

class ServicioProductos{
  getAll() {
    return http.get("/productos");
  }
  get(id) {
    return http.get(`/productos/${id}`);
  }

  // CRUD persistente contra json-server
  // Crear: POST /productos (el cuerpo incluye el producto, con su id)
  create(producto) {
    return http.post("/productos", producto);
  }
  // Actualizar: PUT /productos/:id (reemplaza el producto entero)
  update(id, producto) {
    return http.put(`/productos/${id}`, producto);
  }
  // Borrar: DELETE /productos/:id
  remove(id) {
    return http.delete(`/productos/${id}`);
  }

}

export default new ServicioProductos();
