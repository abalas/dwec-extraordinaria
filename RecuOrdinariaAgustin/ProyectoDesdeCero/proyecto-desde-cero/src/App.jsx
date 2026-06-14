import { useState } from 'react';
import Tienda from './componentes//Tienda';   // Importamos la tienda
import Carrito from './componentes/Carrito'; // Importamos el carrito

function App() {
  // Este estado decide qué pantalla se muestra ('tienda' o 'carrito')
  const [vista, setVista] = useState('tienda');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Barra de navegación superior */}
      <nav style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #eee' }}>
        <button 
          onClick={() => setVista('tienda')} 
          style={{ marginRight: '10px', fontWeight: vista === 'tienda' ? 'bold' : 'normal' }}
        >
          🎮 Ver Tienda
        </button>
        <button 
          onClick={() => setVista('carrito')}
          style={{ fontWeight: vista === 'carrito' ? 'bold' : 'normal' }}
        >
          🛒 Ver Carrito
        </button>
      </nav>

      {/* Renderizado condicional básico (Ideal para exámenes rápidos) */}
      <main>
        {vista === 'tienda' && <Tienda />}
        {vista === 'carrito' && <Carrito />}
      </main>
    </div>
  );
}

export default App;