import React from 'react';
import '../estilos/Autor.css';

const Autor = () => {
  // Datos del autor
  const datosAutor = {
    nombre: "Agustín Aguilera",
    titulo: "Desarrollador Full Stack & Arquitecto de Software",
    descripcion: "Apasionado por crear soluciones digitales innovadoras que combinan funcionalidad, estética y performance. Con más de 8 años de experiencia en el desarrollo de aplicaciones web y móviles.",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    estudios: [
      {
        titulo: "Ingeniería en Sistemas Computacionales",
        institucion: "Universidad Tecnológica Nacional",
        año: "2014-2018",
        destacado: true
      },
      {
        titulo: "Maestría en Inteligencia Artificial",
        institucion: "Universidad de Buenos Aires",
        año: "2019-2021",
        destacado: false
      },
      {
        titulo: "Certificación en Desarrollo React Avanzado",
        institucion: "Meta (Facebook Developer Circles)",
        año: "2022"
      }     
    ],
    aficiones: [
      {
        nombre: "Cocina Fusión",
        icono: "🍳",
        descripcion: "Experimentando con recetas que mezclan sabores tradicionales e innovadores."
      },
      {
        nombre: "Jardinería de Interior",
        icono: "🌿",
        descripcion: "Cultivando un pequeño oasis verde en mi departamento."
      },     
      {
        nombre: "Running Nocturno",
        icono: "🏃",
        descripcion: "Recorriendo la ciudad bajo las estrellas para despejar la mente."
      }
    ],
      contacto: {
      email: "aguilera.dev@example.com",
      linkedin: "linkedin.com/in/aguilera-agustin",
      github: "github.com/aguilera-agustin"     
    }
  };

  return (
    <div className="agustin-aguilera-container">
      {/* Header con imagen de fondo */}
      <header className="agustin-header">
        <div className="header-overlay">
          <div className="header-content">
            <div className="foto-container">
              <img 
                src={datosAutor.foto} 
                alt={datosAutor.nombre} 
                className="foto-perfil"
              />
              <div className="foto-decoracion"></div>
            </div>
            <h1 className="nombre-autor">{datosAutor.nombre}</h1>
            <h2 className="titulo-autor">{datosAutor.titulo}</h2>
            <p className="descripcion-autor">{datosAutor.descripcion}</p>
          </div>
        </div>
      </header>

      <main className="agustin-main">
        <div className="contenedor-principal">
          
          {/* Sección de Estudios */}
          <section className="seccion-estudios">
            <div className="seccion-header">
              <div className="seccion-icono">🎓</div>
              <h2>Estudios & Formación</h2>
              <p className="seccion-subtitulo">Mi trayectoria académica y profesional</p>
            </div>
            
            <div className="estudios-grid">
              {datosAutor.estudios.map((estudio, index) => (
                <div 
                  key={index} 
                  className={`estudio-card ${estudio.destacado ? 'destacado' : ''}`}
                >
                  {estudio.destacado && <div className="destacado-badge">⭐ Destacado</div>}
                  <div className="estudio-icono">📚</div>
                  <h3 className="estudio-titulo">{estudio.titulo}</h3>
                  <p className="estudio-institucion">{estudio.institucion}</p>
                  <div className="estudio-año">{estudio.año}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Sección de Aficiones */}
          <section className="seccion-aficiones">
            <div className="seccion-header">
              <div className="seccion-icono">❤️</div>
              <h2>Pasiones & Aficiones</h2>
              <p className="seccion-subtitulo">Lo que me inspira fuera del código</p>
            </div>
            
            <div className="aficiones-grid">
              {datosAutor.aficiones.map((aficion, index) => (
                <div key={index} className="aficion-card">
                  <div className="aficion-icono">{aficion.icono}</div>
                  <h3 className="aficion-nombre">{aficion.nombre}</h3>
                  <p className="aficion-descripcion">{aficion.descripcion}</p>
                </div>
              ))}
            </div>
          </section>

               {/* Sección de Contacto */}
          <footer className="seccion-contacto">
            <div className="contacto-contenido">
              <h3>¿Quieres conectar?</h3>
              <p>Siempre abierto a nuevos proyectos y colaboraciones interesantes</p>
              
              <div className="contacto-enlaces">
                <a href={`mailto:${datosAutor.contacto.email}`} className="contacto-link">
                  <span className="contacto-icono">✉️</span> {datosAutor.contacto.email}
                </a>
                <a href={`https://${datosAutor.contacto.linkedin}`} target="_blank" rel="noopener noreferrer" className="contacto-link">
                  <span className="contacto-icono">💼</span> LinkedIn
                </a>
                <a href={`https://${datosAutor.contacto.github}`} target="_blank" rel="noopener noreferrer" className="contacto-link">
                  <span className="contacto-icono">👨‍💻</span> GitHub
                </a>                
              </div>
              
              <div className="firma">
                <p>Desarrollado con ❤️ por {datosAutor.nombre}</p>
                <p className="fecha">© {new Date().getFullYear()} - Todos los derechos reservados</p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Autor;