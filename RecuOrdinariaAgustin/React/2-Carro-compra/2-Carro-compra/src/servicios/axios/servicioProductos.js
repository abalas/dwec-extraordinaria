
import http from "./http-axios.js";

class ServicioProductos{
  getAll() {
    return http.get("/productos");
  }
  get(id) {
    return http.get(`/productos/${id}`);
  }

}

export default new ServicioProductos();
