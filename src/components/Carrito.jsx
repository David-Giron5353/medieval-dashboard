import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalFinalizarCompra from './ModalFinalizarCompra';
import '../styles/Carrito.css';

const Carrito = ({ visible, productos, eliminar, vaciar }) => {
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);

  if (!visible) return null;

  const total = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  return (
    <div className="nota-carrito custom-scroll">
      <h4>📝 Tu carrito</h4>

      {productos.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {productos.map((p) => (
              <li key={p.id}>
                <div>
                  <strong>{p.nombre}</strong> × {p.cantidad}
                </div>
                <div>${(p.precio * p.cantidad).toLocaleString()}</div>
                <button onClick={() => eliminar(p.id)}>❌</button>
              </li>
            ))}
          </ul>

          <div className="carrito-total">
            <strong>Total:</strong> ${total.toLocaleString()}
          </div>
          <div className="btn-finalizar">
            <button onClick={() => setMostrarModal(true)}>
              Finalizar compra
            </button>
          </div>
        </>
      )}

      <ModalFinalizarCompra
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        productos={productos}
        vaciar={vaciar}
        navigate={navigate}
      />
    </div>
  );
};

export default Carrito;
