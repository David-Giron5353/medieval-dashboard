import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaCashRegister, FaUsers, FaBars } from 'react-icons/fa';
import '../styles/Sidebar.css';
import '../styles/DarkModeToggle.css';
import DarkModeToggle from '../components/DarkModeToggle';

const Sidebar = ({ open, toggleSidebar }) => {
  const location = useLocation();

  const links = [
    { path: '/', name: 'Inicio', icon: <FaHome /> },
    { path: '/productos', name: 'Productos', icon: <FaBox /> },
    { path: '/ventas', name: 'Ventas', icon: <FaCashRegister /> },
    { path: '/clientes', name: 'Clientes', icon: <FaUsers /> },
  ];

  return (
    <div className={`sidebar ${open ? 'open' : 'collapsed'}`}>
      <div className="top-bar">
        {open && (
          <div className="logo">
            <img src="/img/logo.jpg" alt="Drunken Dragon" className='img-sidebar'/>              
          </div>
        )}
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      <nav>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={location.pathname === link.path ? 'active' : ''}
          >
            {link.icon}
            {open && <span>{link.name}</span>}
          </Link>
        ))}
      </nav>
    <DarkModeToggle />
    </div>
  );
};

export default Sidebar;
