import React, { useEffect, useState } from 'react';
import noticiasData from '../data/noticiasData';
import productosLicor from '../data/productosLicor';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [indexNoticia, setIndexNoticia] = useState(0);
  const [modalNoticia, setModalNoticia] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [modalProducto, setModalProducto] = useState(null);
  const [resumen, setResumen] = useState({ totalVentas: 0, clientes: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndexNoticia(prev => (prev + 1) % noticiasData.length);
    }, 5000);

    const idsFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const favoritosCompletos = productosLicor.filter(p => idsFavoritos.includes(p.id));
    setFavoritos(favoritosCompletos);

    const historial = JSON.parse(localStorage.getItem("historialCompras")) || [];
    const totalVentas = historial.reduce((sum, h) => sum + h.total, 0);
    const clientesUnicos = new Set(historial.map(h => h.cliente?.correo || "cliente@anonimo.com"));

    setResumen({
      totalVentas,
      clientes: clientesUnicos.size,
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <section>
        <div
          className="noticia-banner"
          onClick={() => setModalNoticia(noticiasData[indexNoticia])}
        >
          <img
            src={noticiasData[indexNoticia].imagen}
            alt="Noticia"
            className="noticia-imagen"
          />
          <div className="noticia-titulo">
            {noticiasData[indexNoticia].titulo}
          </div>
        </div>
      </section>

      {modalNoticia && (
        <div className="modal-overlayN">
          <div className="modal-contentN">
            <button onClick={() => setModalNoticia(null)} className="btn-cerrar">❌</button>
            <h2>{modalNoticia.titulo}</h2>
            <img src={modalNoticia.imagen} alt="Noticia" className="modal-img" />
            <p>{modalNoticia.descripcion}</p>
          </div>
        </div>
      )}

      <section className="seccion-negocio">
        <div className="negocio-texto">
          <h2>Acerca del negocio</h2>
          <p>
            Drunken Dragon es un emprendimiento local dedicado a ofrecer las mejores bebidas alcohólicas, con un enfoque en la experiencia del cliente. Nos enorgullecemos de traer productos de alta calidad, promociones increíbles y atención personalizada.
          </p>
          <p>
            Nuestro objetivo es ser el referente en venta de licor en la región, fusionando tradición, innovación y buen servicio.
          </p>
        </div>
        <img
          src="/img/hero.png"
          alt="Drunken Dragon"
          className="negocio-imagen"
        />
      </section>

      <section className="seccion-favoritos">
        <h2>⭐ Productos favoritos</h2>
        {favoritos.length === 0 ? (
          <p>No hay productos favoritos guardados.</p>
        ) : (
          <div className="favoritos-carrusel">
            {favoritos.map((producto, i) => (
              <div
                key={i}
                className="favorito-card"
                onClick={() => setModalProducto(producto)}
              >
                <img
                  src={producto.imagen || "https://via.placeholder.com/150"}
                  alt={producto.nombre}
                  className="favorito-img"
                />
                <h4>{producto.nombre}</h4>
                <p>💲 {producto.precio}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {modalProducto && (
        <div className="modal-overlayN">
          <div className="modal-contentN">
            <button onClick={() => setModalProducto(null)} className="btn-cerrar">❌</button>
            <h2>{modalProducto.nombre}</h2>
            <img
              src={modalProducto.imagen || "https://via.placeholder.com/300"}
              alt={modalProducto.nombre}
              className="modal-img"
            />
            <p><strong>Precio:</strong> {modalProducto.precio}</p>
            <p><strong>Categoría:</strong> {modalProducto.categoria}</p>
            <p><strong>Descripción:</strong> {modalProducto.descripcion}</p>
          </div>
        </div>
      )}

      <section className="seccion-resumen">
        <div className="card-resumen">💰 Ventas totales: <strong>${resumen.totalVentas.toLocaleString()}</strong></div>
        <div className="card-resumen">👥 Clientes únicos: <strong>{resumen.clientes}</strong></div>
        <div className="card-resumen">⭐ Favoritos: <strong>{favoritos.length}</strong></div>
      </section>
    </div>
  );
}
