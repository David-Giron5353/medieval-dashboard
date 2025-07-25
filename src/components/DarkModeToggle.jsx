import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className="boton-dark-mode">
        <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️' : '🌙'}
        </button>
    </div>
  );
};

export default DarkModeToggle;
