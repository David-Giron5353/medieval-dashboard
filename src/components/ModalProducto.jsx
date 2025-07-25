import React from 'react';
import '../styles/ModalProducto.css';

const ModalProducto = ({ producto, cerrar }) => {
  if (!producto) return null;

  return (
    <div className="modal-backdrop" onClick={cerrar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <button className="cerrar-modal" onClick={cerrar}>✖</button>
        <img src={producto.imagen} alt={producto.nombre} />
        <h2>{producto.nombre}</h2>
        <p><strong>Categoría:</strong> {producto.categoria}</p>
        <p><strong>Precio:</strong> ${producto.precio.toLocaleString()}</p>
        <p><em>{producto.descripcion}</em></p>
      </div>
    </div>
  );
};

export default ModalProducto;
