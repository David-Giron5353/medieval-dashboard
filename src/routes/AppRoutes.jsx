import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Ventas from '../pages/Ventas';
import Customers from '../pages/Customers';
import Sidebar from '../components/Sidebar';
import Factura from '../pages/Factura';


export default function AppRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main
          style={{
            marginLeft: sidebarOpen ? '240px' : '74px',
            transition: 'margin-left 0.3s ease',
            width: '100%',
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/clientes" element={<Customers />} />
            <Route path="/factura" element={<Factura />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
