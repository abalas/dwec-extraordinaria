import React from 'react';
import '../estilos/Autor.css';

const Autor = () => {
  return (
    <div className="autor-container">
      <div className="autor-card">

        {/* Cabecera */}
        <header className="autor-header">
          <h1 className="autor-nombre">Andrei Balas</h1>
          <p className="autor-rol">Desarrollador Web · Estudiante de DAW</p>
        </header>

        {/* Formación */}
        <section className="autor-seccion">
          <h2>🎓 Formación</h2>
          <p>
            Estudiante en el Ciclo Formativo de Grado Superior en
            <strong> Desarrollo de Aplicaciones Web (DAW)</strong>.
          </p>
        </section>

        {/* Proyecto */}
        <section className="autor-seccion">
          <h2>🎮 Proyecto</h2>
          <p>
            <strong>GameVault</strong> es una tienda de videojuegos desarrollada en React,
            realizada en base al proyecto de React de <strong>Agustín Aguilera</strong>.
          </p>
          <p>
            Incluye catálogo de videojuegos, carrito de compra con gestión de unidades,
            un CRUD completo de productos en la zona de administración y un sistema de
            validación de formularios reutilizable.
          </p>
        </section>

        {/* Tecnologías */}
        <section className="autor-seccion">
          <h2>🛠️ Tecnologías</h2>
          <div className="autor-tecnologias">
            <span>React</span>
            <span>Vite</span>
            <span>React Router</span>
            <span>Axios</span>
            <span>SweetAlert2</span>
            <span>CSS</span>
          </div>
        </section>

        <footer className="autor-footer">
          <p>© {new Date().getFullYear()} Andrei Balas · GameVault</p>
        </footer>

      </div>
    </div>
  );
};

export default Autor;
