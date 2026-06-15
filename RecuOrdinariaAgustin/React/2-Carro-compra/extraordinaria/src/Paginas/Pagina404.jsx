import React, { useEffect, useState } from 'react';
import '../estilos/Pagina404.css';

const Pagina404 = () => {
  const [contador, setContador] = useState(5);
  const [mensajeVisible, setMensajeVisible] = useState(true);  

  const mensajesDivertidos = [
    "¡Ups! Esta página se fue de paseo.",
    "Error 404: Página no encontrada.",
    "Alguien movió esta página sin permiso.",
    "404: La página que buscas está de vacaciones."
  ];

  return (
    <div className="pagina-404-simple">
      {/* Fondo simple */}
      <div className="fondo-estrellas">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="estrella"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="contenido-simple">
        {/* Número 404 con cara divertida */}
        <div className="numero-contenedor">
          <span className="numero-4">4</span>
          <div className="cara-404">
            <div className="ojos">
              <div className="ojo"></div>
              <div className="ojo"></div>
            </div>
            <div className="boca"></div>
          </div>
          <span className="numero-4">4</span>
        </div>

        {/* Mensaje principal */}
        <h1 className="titulo-simple">
          ¡Oh no! Página no encontrada
        </h1>
        
        <div className="mensaje-simple">
          <p>{mensajesDivertidos[Math.floor(Math.random() * mensajesDivertidos.length)]}</p>
        </div>

        {/* Contador regresivo */}
        <div className="contador-simple">
          <p>Volviendo al inicio en:</p>
          <div className="numero-contador">{contador}</div>
        </div>

        {/* Emoji flotante */}
        <div className="emoji-flotante">
          <div className="emoji">🚀</div>
          <div className="emoji">👽</div>
          <div className="emoji">🛸</div>
        </div>

        {/* Botones de acción */}
        <div className="botones-simples">
          <button 
            className="boton-volver"
            onClick={() => window.history.back()}
          >
            ← Volver atrás
          </button>
          
          <button 
            className="boton-inicio"
            onClick={() => window.location.href = '/'}
          >
            🏠 Ir al inicio
          </button>
        </div>

        {/* Mensaje final */}
        {mensajeVisible && (
          <div className="mensaje-final">
            <p>¡Vaya! ¿Sigues aquí? 😄</p>
          </div>
        )}

        {/* Pie de página simple */}
        <footer className="footer-simple">
          <p>¿Necesitas ayuda? Revisa la URL o usa los botones arriba</p>
        </footer>
      </div>
    </div>
  );
};

export default Pagina404;