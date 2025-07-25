import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import productosLicor from '../data/productosLicor';
import ModalProducto from '../components/ModalProducto';
import Carrito from '../components/Carrito';
import useCarrito from '../hooks/useCarrito';
import useFavoritos from '../hooks/useFavoritos';
import '../styles/Products.css';

const Products = () => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [vistaTarjetas, setVistaTarjetas] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);

  const { carrito, agregarProducto, eliminarProducto, vaciarCarrito } = useCarrito();
  const { favoritos, toggleFavorito, esFavorito } = useFavoritos();
  const productosPorPagina = 5;

  const categorias = ['Todos', ...new Set(productosLicor.map(p => p.categoria))];

  const filtrados = productosLicor.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'Todos' || p.categoria === categoriaFiltro;
    const esFav = !mostrarSoloFavoritos || favoritos.includes(p.id);
    return coincideNombre && coincideCategoria && esFav;
  });

  const totalPaginas = Math.ceil(filtrados.length / productosPorPagina);
  const productosPaginados = filtrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  const cambiarPagina = (dir) => {
    if (dir === 'prev' && paginaActual > 1) setPaginaActual(paginaActual - 1);
    if (dir === 'next' && paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  return (
    <div className="productos-container" style={{padding: '1rem'}} >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Productos</h1>
        <div className="boton-carrito-flotante">
          <button onClick={() => setMostrarCarrito(!mostrarCarrito)}className="carrito-btn">
            🛒
            {carrito.length > 0 && (
              <span className="carrito-badge">
                {carrito.reduce((acc, p) => acc + p.cantidad, 0)}
              </span>
            )}
          </button>
          <Carrito
            visible={mostrarCarrito}
            productos={carrito}
            eliminar={eliminarProducto}
            vaciar={vaciarCarrito}
          />
        </div>
      </div>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
          {categorias.map((cat) => <option key={cat}>{cat}</option>)}
        </select>
        <button onClick={() => setVistaTarjetas(!vistaTarjetas)}>
          Cambiar a vista {vistaTarjetas ? 'Tarjetas' : 'Tabla'}
        </button>
        <button onClick={() => setMostrarSoloFavoritos(!mostrarSoloFavoritos)}>
          {mostrarSoloFavoritos ? '🔍 Ver todos' : '⭐ Ver favoritos'}
        </button>
      </div>

      {vistaTarjetas ? (
        <table className="productos-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th>Agregar</th>
              <th>Detalles</th>
              <th>Favorito</th>
            </tr>
          </thead>
          <tbody>
            {productosPaginados.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${p.precio.toLocaleString()}</td>
                <td><img src={p.imagen} alt={p.nombre} height="40" /></td>
                <td><button onClick={() => agregarProducto(p)}>🛒</button></td>
                <td><button onClick={() => setProductoSeleccionado(p)}>👁‍🗨</button></td>
                <td><button onClick={() => toggleFavorito(p.id)}>{esFavorito(p.id) ? '⭐' : '☆'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="tarjetas-grid">
          {productosPaginados.map((p) => (
            <div key={p.id} className="tarjeta-producto">
              <img src={p.imagen} alt={p.nombre} />
              <h4>{p.nombre}</h4>
              <p><strong>Precio:</strong> ${p.precio.toLocaleString()}</p>
              <p><strong>Categoría:</strong> {p.categoria}</p>
              <button onClick={() => agregarProducto(p)}>🛒</button>
              <button onClick={() => setProductoSeleccionado(p)}>👁‍🗨</button>
              <button onClick={() => toggleFavorito(p.id)}>{esFavorito(p.id) ? '⭐' : '☆'}</button>
            </div>
          ))}
        </div>
      )}

      <div className="paginacion">
        <button onClick={() => cambiarPagina('prev')} disabled={paginaActual === 1}>
          <FaArrowLeft /> Anterior
        </button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button onClick={() => cambiarPagina('next')} disabled={paginaActual === totalPaginas}>
          Siguiente <FaArrowRight />
        </button>
      </div>

      <ModalProducto
        producto={productoSeleccionado}
        cerrar={() => setProductoSeleccionado(null)}
      />
    </div>
  );
};

export default Products;
