import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import '../styles/Factura.css';

const Factura = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Recibe datos pasados desde /carrito
  const {
    productos = [],
    fecha = new Date().toLocaleString(),
    total = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0)
  } = location.state || {};

  const refFactura = useRef();

  const descargarPDF = () => {
    const element = refFactura.current;
    html2pdf().from(element).set({
      margin: 10,
      filename: `Factura-${Date.now()}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save();
  };

  // Redirige si se accede directamente sin datos
  useEffect(() => {
    if (!productos.length) {
      navigate('/');
    }
  }, [productos, navigate]);

  return (
    <div className="factura-container">
      <div className="factura-box" ref={refFactura}>
        <img src="/img/logo.jpg" alt="Drunken Dragon" className="factura-logo" />
        <h1>Factura - Drunken Dragon 🍺</h1>
        <p><strong>Fecha:</strong> {fecha}</p>

        <ul>
          {productos.map((p) => (
            <li key={p.id}>
              <span>{p.nombre} × {p.cantidad}</span>
              <span>${(p.precio * p.cantidad).toLocaleString()}</span>
            </li>
          ))}
        </ul>

        <div className="factura-total">
          <strong>Total:</strong> ${total.toLocaleString()}
        </div>
      </div>

      <div className="factura-acciones">
        <button onClick={descargarPDF}>📥 Descargar PDF</button>
        <button onClick={() => navigate('/')}>🏠 Volver al inicio</button>
      </div>
    </div>
  );
};

export default Factura;
