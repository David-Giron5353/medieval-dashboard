import React, { useEffect, useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import '../styles/Customers.css';

const Customers = () => {
  const [clientes, setClientes] = useState([]);
  const [filtroCorreo, setFiltroCorreo] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [ordenValor, setOrdenValor] = useState('');
  const [ordenFecha, setOrdenFecha] = useState('');
  const [ordenNombre, setOrdenNombre] = useState('asc'); // por defecto A-Z
  const [mostrarHistorial, setMostrarHistorial] = useState(null);
  const [paginaClientes, setPaginaClientes] = useState(1);
  const [paginaHistorial, setPaginaHistorial] = useState(1);
  const elementosPorPagina = 5;

  const refReporte = useRef();
  const refModal = useRef();
  const historialCompleto = useRef([]);

  const parseFecha = (str) => {
    try {
      const [fechaStr, horaStr] = str.split(', ');
      const [dia, mes, anio] = fechaStr.split('/').map(Number);
      let [hora, minuto, segundo] = horaStr.split(':');
      let [seg, periodo] = segundo.split(' ');
      hora = parseInt(hora, 10);
      if (periodo.toLowerCase().includes('p') && hora < 12) hora += 12;
      if (periodo.toLowerCase().includes('a') && hora === 12) hora = 0;
      return new Date(anio, mes - 1, dia, hora, minuto, seg);
    } catch {
      return new Date(0);
    }
  };

  const toDateInputFormat = (fechaTexto) => {
    try {
      const [fecha] = fechaTexto.split(', ');
      const [dia, mes, anio] = fecha.split('/').map(Number);
      return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const historial = JSON.parse(localStorage.getItem('historialCompras')) || [];
    historialCompleto.current = historial;
    const agrupados = {};

    historial.forEach(compra => {
      const email = compra.email || 'anónimo';
      const nombre = compra.nombre || 'Cliente';
      if (!agrupados[email]) {
        agrupados[email] = {
          email,
          nombre,
          totalCompras: 0,
          totalGastado: 0,
          ultimaCompra: compra.fecha
        };
      }
      agrupados[email].totalCompras += 1;
      agrupados[email].totalGastado += compra.total;
      agrupados[email].ultimaCompra = compra.fecha;
    });

    setClientes(Object.values(agrupados));
  }, []);

  const exportarCSV = () => {
    const header = 'Nombre,Email,Total Compras,Total Gastado,Última Compra\n';
    const rows = clientesFiltrados.map(c =>
      `${c.nombre},${c.email},${c.totalCompras},${c.totalGastado},${c.ultimaCompra}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'clientes.csv');
  };

  const exportarPDF = () => {
    const opciones = {
      margin: 0.5,
      filename: 'clientes.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opciones).from(refReporte.current).save();
  };

  const nombresUnicos = [...new Set(clientes.map(c => c.nombre))];
  const correosFiltrados = clientes
    .filter(c => !filtroNombre || c.nombre === filtroNombre)
    .map(c => c.email);
  const correosUnicos = [...new Set(correosFiltrados)];

  const clientesFiltrados = clientes
    .filter(c => {
      const coincideCorreo = !filtroCorreo || c.email === filtroCorreo;
      const coincideNombre = !filtroNombre || c.nombre === filtroNombre;
      const coincideFecha = !filtroFecha || toDateInputFormat(c.ultimaCompra) === filtroFecha;
      return coincideCorreo && coincideNombre && coincideFecha;
    })
    .sort((a, b) => {
      if (ordenValor) {
        return ordenValor === 'asc'
          ? a.totalGastado - b.totalGastado
          : b.totalGastado - a.totalGastado;
      }
      if (ordenFecha) {
        return ordenFecha === 'asc'
          ? parseFecha(a.ultimaCompra) - parseFecha(b.ultimaCompra)
          : parseFecha(b.ultimaCompra) - parseFecha(a.ultimaCompra);
      }
      return ordenNombre === 'asc'
        ? a.nombre.localeCompare(b.nombre)
        : b.nombre.localeCompare(a.nombre);
    });

  const historialPorCliente = (email) => {
    return historialCompleto.current
      .filter(c => c.email === email)
      .sort((a, b) => parseFecha(b.fecha) - parseFecha(a.fecha));
  };

  const toggleOrdenNombre = () => {
    setOrdenNombre(o => o === 'asc' ? 'desc' : 'asc');
    setOrdenValor('');
    setOrdenFecha('');
  };

  return (
    <div className="clientes-container" style={{padding: '1rem'}} >
      <h1>Clientes</h1>

      <div className="filtros-clientes">
        <select value={filtroNombre} onChange={e => {
          setFiltroNombre(e.target.value);
          setFiltroCorreo('');
        }}>
          <option value="">Filtrar por nombre</option>
          {nombresUnicos.map((nombre, idx) => (
            <option key={idx} value={nombre}>{nombre}</option>
          ))}
        </select>

        <select value={filtroCorreo} onChange={e => setFiltroCorreo(e.target.value)}>
          <option value="">Filtrar por correo</option>
          {correosUnicos.map((correo, idx) => (
            <option key={idx} value={correo}>{correo}</option>
          ))}
        </select>

        <input
          type="date"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
        />

        <select
          value={ordenValor}
          onChange={e => {
            setOrdenValor(e.target.value);
            setOrdenFecha('');
          }}
        >
          <option value="">Ordenar por valor</option>
          <option value="desc">Mayor a menor</option>
          <option value="asc">Menor a mayor</option>
        </select>

        <select
          value={ordenFecha}
          onChange={e => {
            setOrdenFecha(e.target.value);
            setOrdenValor('');
          }}
        >
          <option value="">Ordenar por fecha</option>
          <option value="desc">Más reciente</option>
          <option value="asc">Más antiguo</option>
        </select>

        <button onClick={exportarCSV}>💾</button>
        <button onClick={exportarPDF}>🖨️</button>
      </div>

      <div ref={refReporte}>
        <table className="tabla-clientes">
          <thead>
            <tr>
              <th onClick={toggleOrdenNombre} style={{ cursor: 'pointer' }}>
                Nombre {ordenNombre === 'asc' ? '🔼' : '🔽'}
              </th>
              <th>Email</th>
              <th>Total Compras</th>
              <th>Total Gastado</th>
              <th>Última Compra</th>
              <th>Historial</th>
            </tr>
          </thead>
          <tbody>
  {clientesFiltrados
    .slice((paginaClientes - 1) * elementosPorPagina, paginaClientes * elementosPorPagina)
    .map((c, idx) => (
      <tr key={idx}>
        <td>{c.nombre.toUpperCase()}</td>
        <td>{c.email.toUpperCase()}</td>
        <td>{c.totalCompras}</td>
        <td>${c.totalGastado.toLocaleString()}</td>
        <td>{c.ultimaCompra}</td>
        <td>
          <button onClick={() => {
            setPaginaHistorial(1);
            setMostrarHistorial(historialPorCliente(c.email));
          }}>👁‍🗨</button>
        </td>
      </tr>
    ))}
  {clientesFiltrados.length === 0 && (
    <tr>
      <td colSpan="6" style={{ textAlign: 'center' }}>No hay resultados</td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      <div className="paginacion-clientes">
        <button
          onClick={() => setPaginaClientes(p => Math.max(p - 1, 1))}
          disabled={paginaClientes === 1}
        >
          <FaArrowLeft /> Anterior
        </button>
        <span>Página {paginaClientes} de {Math.ceil(clientesFiltrados.length / elementosPorPagina)}</span>
        <button
          onClick={() => setPaginaClientes(p =>
            p < Math.ceil(clientesFiltrados.length / elementosPorPagina) ? p + 1 : p
          )}
          disabled={paginaClientes === Math.ceil(clientesFiltrados.length / elementosPorPagina)}
        >
           Siguiente <FaArrowRight />
        </button>
      </div>

      {mostrarHistorial && (
        <div
          className="modal"
          onClick={(e) => {
            if (e.target.className === 'modal') setMostrarHistorial(null);
          }}
        >
          <div ref={refModal} className="modal-content">
            <h3>📦 Historial de compras</h3>
            <ul>
              {mostrarHistorial
                .slice((paginaHistorial - 1) * elementosPorPagina, paginaHistorial * elementosPorPagina)
                .map((compra, idx) => (
                  <li key={idx}>
                    <strong>{compra.fecha}:</strong>{' '}
                    {compra.productos.map(p => `${p.nombre} (${p.cantidad})`).join(', ')} – Total: ${compra.total.toLocaleString()}
                  </li>
              ))}
            </ul>

            <div className="paginacion-modal">
              <button
                onClick={() => setPaginaHistorial(p => Math.max(p - 1, 1))}
                disabled={paginaHistorial === 1}
              >⏪
              </button>
              <span>Página {paginaHistorial} de {Math.ceil(mostrarHistorial.length / elementosPorPagina)}</span>
              <button
                onClick={() =>
                  setPaginaHistorial(p =>
                    p < Math.ceil(mostrarHistorial.length / elementosPorPagina) ? p + 1 : p
                  )}
                disabled={paginaHistorial === Math.ceil(mostrarHistorial.length / elementosPorPagina)}
              >⏩</button>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button onClick={() => setMostrarHistorial(null)}>✖</button>
              <button onClick={() => {
                const opciones = {
                  margin: 0.5,
                  filename: 'historial_cliente.pdf',
                  image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: { scale: 2 },
                  jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
                };
                html2pdf().set(opciones).from(refModal.current).save();
              }}>🧾</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
