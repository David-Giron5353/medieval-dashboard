import React, { useState } from 'react';
import '../styles/ModalFinalizarCompra.css';

const ModalFinalizarCompra = ({ visible, onClose, productos, vaciar, navigate }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  if (!visible) return null;

  const handleSubmit = () => {
    if (!nombre.trim()) return alert('El nombre es obligatorio.');
    if (!email.includes('@')) return alert('Correo inválido.');

    const confirmado = window.confirm("¿Confirmas tu compra? 🛒");
    if (!confirmado) return;

    const fecha = new Date().toLocaleString();
    const total = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const historial = JSON.parse(localStorage.getItem('historialCompras')) || [];

    historial.push({ fecha, productos, total, nombre, email });
    localStorage.setItem('historialCompras', JSON.stringify(historial));

    vaciar();
    onClose();
    navigate('/factura', { state: { productos, fecha, total, nombre, email } });
  };

  return (
    <div className="modal-compra-overlay" onClick={(e) => {
      if (e.target.className === 'modal-compra-overlay') onClose();
    }}>
      <div className="modal-compra">
        <h2>🧾 Finalizar compra</h2>
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="modal-buttonsF">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSubmit}>Confirmar compra</button>
        </div>
      </div>
    </div>
  );
};

export default ModalFinalizarCompra;
