import { useState, useEffect } from 'react';

const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favoritos')) || [];
    setFavoritos(favs);
  }, []);

  const toggleFavorito = (id) => {
    const actualizados = favoritos.includes(id)
      ? favoritos.filter(f => f !== id)
      : [...favoritos, id];

    setFavoritos(actualizados);
    localStorage.setItem('favoritos', JSON.stringify(actualizados));
  };

  const esFavorito = (id) => favoritos.includes(id);

  return { favoritos, toggleFavorito, esFavorito };
};

export default useFavoritos;
