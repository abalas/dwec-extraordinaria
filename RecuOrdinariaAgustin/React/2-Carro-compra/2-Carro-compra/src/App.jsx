import { useState } from 'react'
import MenuSuperior from './componentes/menu'
import ListaImagenes from './componentes/cuerpo'
import Footer from './componentes/footer';
import { Route, Routes } from 'react-router-dom';
import Pagina404 from './Paginas/Pagina404';
import Autor from './Paginas/Autor';
import DetalleProducto from './componentes/DetalleProducto';
import DetalleCarrito from './componentes/DetalleCarrito';
import Administracion from './componentes/Administracion';
import Rebajas from './componentes/Rebajas';
import { AuthProvider } from './context/AuthContext';
import Login from './Paginas/Login'; // Nueva página de login
import ProtectedRoute from './componentes/ProtectedRoute'; // Componente para rutas protegidas
import UseStorageState from './servicios/storage/UseStorageState'

import { ToastContainer } from 'react-toastify'      // Ej.2
import 'react-toastify/dist/ReactToastify.css'        // Ej.2: estilos de los toasts

function App() {
  const [total, setTotal] = UseStorageState("total",8);
  //const [total2, setTotal2] = useState(5)


  const [productos, setProductos] = UseStorageState("productos",[]);

  return (
    <AuthProvider>
      <div className="App">
        {/* Ej.2: contenedor donde se dibujan las notificaciones toast */}
        <ToastContainer position="top-right" autoClose={3000} />
        <header className="App-header">
          <MenuSuperior
            total={total}
            productos={productos}
          />
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={<ListaImagenes total={total} setTotal={setTotal} productos={productos} setProductos={setProductos} />}
            />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route
              path="/detalle-carrito"
              element={
                <DetalleCarrito
                  productos={productos}
                  setProductos={setProductos}
                  total={total}
                  setTotal={setTotal}
                />
              }
            />
            {/* Ruta protegida para administración */}
            <Route 
              path="/admin" 
              element={
                //<ProtectedRoute>
                  <Administracion />
                //</ProtectedRoute>
              } 
            />
            <Route path="/autor" element={<Autor />} />
            <Route path="/rebajas" element={<Rebajas />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Pagina404 />} />
          </Routes>
        </main>
        <Footer total={total} productos={productos} setProductos={setProductos} />
      </div>
    </AuthProvider>
  );
}

export default App