import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import '../styles/Ventas.css'; 

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9c27b0', '#3f51b5'];

const Ventas = () => {
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [tipoGrafico, setTipoGrafico] = useState('barras');
  const [tipoDato, setTipoDato] = useState('producto');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const parseFecha = (str) => {
    try {
      const [fechaStr] = str.split(',');
      const [dia, mes, anio] = fechaStr.split('/').map(Number);
      return new Date(anio, mes - 1, dia);
    } catch {
      return new Date(0);
    }
  };

  useEffect(() => {
    const historial = JSON.parse(localStorage.getItem('historialCompras')) || [];

    const filtrado = historial.filter(({ fecha }) => {
      const f = parseFecha(fecha);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;
      return (!inicio || f >= inicio) && (!fin || f <= fin);
    });

    setDatosFiltrados(filtrado);
  }, [fechaInicio, fechaFin]);

  const conteoPorProducto = {};
  const conteoPorCategoria = {};
  const ventasPorFecha = {};

  datosFiltrados.forEach(({ fecha, productos }) => {
    const fechaObj = parseFecha(fecha);
    const fechaKey = fechaObj.toISOString().split('T')[0];

    productos.forEach(({ nombre, cantidad, categoria }) => {
      conteoPorProducto[nombre] = (conteoPorProducto[nombre] || 0) + cantidad;
      conteoPorCategoria[categoria] = (conteoPorCategoria[categoria] || 0) + cantidad;
    });

    ventasPorFecha[fechaKey] = (ventasPorFecha[fechaKey] || 0) + productos.reduce((sum, p) => sum + p.cantidad, 0);
  });

  const dataPorProducto = Object.entries(conteoPorProducto).map(([nombre, cantidad]) => ({ nombre, cantidad }));
  const dataPorCategoria = Object.entries(conteoPorCategoria).map(([nombre, cantidad]) => ({ nombre, cantidad }));

  const dataPorFecha = Object.entries(ventasPorFecha)
    .map(([fechaISO, cantidad]) => {
      const [yyyy, mm, dd] = fechaISO.split('-');
      return { fecha: `${dd}/${mm}/${yyyy}`, cantidad, raw: fechaISO };
    })
    .sort((a, b) => new Date(a.raw) - new Date(b.raw));

  const exportarCSV = () => {
    let csv = `${tipoDato === 'producto' ? 'Producto' : 'Categoría'},Cantidad\n`;
    const data = tipoDato === 'producto' ? dataPorProducto : dataPorCategoria;
    data.forEach(({ nombre, cantidad }) => {
      csv += `${nombre},${cantidad}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'ventas.csv');
  };

  const exportarPDF = () => {
    const content = document.getElementById('grafico-contenido');
    html2pdf().from(content).save('ventas.pdf');
  };

  const borrarHistorial = () => {
    if (window.confirm('¿Estás seguro de eliminar todo el historial de ventas?')) {
      localStorage.removeItem('historialCompras');
      window.location.reload();
    }
  };

  const dataSeleccionada = tipoDato === 'producto' ? dataPorProducto : dataPorCategoria;

  return (
    <div className="ventas-container" style={{padding: '1rem'}} >
      <h1>Ventas</h1>

      {/* 🎛️ Filtros */}
      <div className="filtros-ventas">
        <label>Desde:
          <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        </label>
        <label>Hasta:
          <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        </label>
        <label>Tipo de gráfico:
          <select value={tipoGrafico} onChange={(e) => setTipoGrafico(e.target.value)}>
            <option value="barras">📊 Barras</option>
            <option value="lineas">📈 Líneas</option>
            <option value="pastel">🥧 Pastel</option>
          </select>
        </label>
        <label>Mostrar por:
          <select value={tipoDato} onChange={(e) => setTipoDato(e.target.value)}>
            <option value="producto">🛍️ Producto</option>
            <option value="categoria">📦 Categoría</option>
          </select>
        </label>

      <button onClick={exportarCSV} className="icon-btn" title="Exportar CSV">💾</button>
      <button onClick={exportarPDF} className="icon-btn" title="Exportar PDF">🖨️</button>
      <button onClick={borrarHistorial} className="icon-btn borrar" title="Borrar historial">🗑️</button>
      </div>

      {/* 📊 Gráfico */}
      <div id="grafico-contenido">
        {tipoGrafico === 'pastel' && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={dataSeleccionada} dataKey="cantidad" nameKey="nombre" outerRadius={130} label>
                {dataSeleccionada.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {tipoGrafico === 'barras' && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dataSeleccionada}>
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#8a5a2e" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {tipoGrafico === 'lineas' && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dataPorFecha}>
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cantidad" stroke="#8a5a2e" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Ventas;
