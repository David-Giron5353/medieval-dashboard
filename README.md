# Medieval Dashboard

## Descripción del Proyecto

Medieval Dashboard es un sistema de gestión visual enfocado en la administración de productos, clientes y ventas. Está diseñado con una estética temática medieval moderna, adaptable a modo claro y modo oscuro. No requiere backend: toda la persistencia de datos se maneja en el navegador mediante `localStorage`.

El proyecto incluye funcionalidades como visualización de productos, gestión de favoritos, carrito de compras, historial de clientes, gráficos de ventas, exportaciones en PDF/CSV y generación de facturas.


## Tecnologías Utilizadas

- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Recharts](https://recharts.org/en-US/)
- [html2pdf.js](https://github.com/eKoopmans/html2pdf)
- [file-saver](https://github.com/eligrey/FileSaver.js)
- CSS personalizado (modo claro / oscuro)
- `localStorage` (persistencia de datos local)


## Estructura del Proyecto

📦 src/
├── 📁 Public/
│   └── img/
│ 
├── 📁 components/ -- maneja componentes reutilizables --
│   ├── ModalProducto.jsx
│   ├── ModalFinalizarCompra.jsx
│   ├── DarkModeToggle.jsx
│   ├── Carrito.jsx
│   └── Sidebar.jsx
│ 
├── 📁 context/ -- archivos relacionados con el manejo del estado global de la aplicación --
│   └── ThemeContext.js
│ 
├── 📁 data/ --  archivos que contienen datos estáticos o simulados --
│   ├── noticiasData.js
│   └── productosLicor.js
│ 
├── 📁 hooks/ --  funciones especiales de React que ayudan a organizar mejor el código y reutilizar lógica en la aplicacion --
│   ├── useCarrito.js
│   └── useFavoritos.js
│ 
├── 📁 pages/ -- maneja las paginas principales --
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Customers.jsx
│   ├── Ventas.jsx
│   └── Factura.jsx
│ 
├── 📁 routes/ --maneja las rutas--
│   └── AppRoutes.jsx
│ 
├── 📁 styles/ --maneja los estilos --
│   ├── ModalProducto.css
│   ├── ModalFinalizarCompra.css
│   ├── DarkModeToggle.css
│   ├── Carrito.css
│   ├── Sidebar.css
│   ├── Dashboard.css
│   ├── Products.css
│   ├── Customers.css
│   ├── Ventas.css
│   ├── Factura.css
│   └── global.css
│
├── App.jsx
└── index.js


## Instalación

```bash
git clone [ttps://github.com/David-Giron5353/medieval-dashboard.git]
cd medieval-dashboard
npm install
npm run dev
```

> El servidor se iniciará en `http://localhost:3000`

---

## Funcionalidades

### Productos
- Vista en tabla o tarjetas
- Filtros por nombre, categoría y precio
- Paginación
- Botones con íconos: ver detalles, añadir al carrito, marcar favorito

### Carrito
- Visualiza productos seleccionados
- Cálculo total en tiempo real
- Eliminar productos
- Generación de factura en PDF

### Clientes
- Visualización por usuario
- Filtros por nombre, correo, fecha
- Orden por total gastado, fecha, nombre
- Exportar PDF y CSV
- Historial detallado con paginación

### Ventas
- Gráficos de ventas por producto
- Filtros por fecha
- Exportación a PDF
- Limpieza de historial

### Factura
- Resumen detallado de compra
- Vista previa de factura tipo recibo
- Exportación a PDF


## Modo Oscuro

- Activable/desactivable con botón flotante
- Adaptado a todos los módulos
- Colores personalizados para mejor experiencia nocturna


## Dependencias

```bash
npm install react react-dom
npm install html2pdf.js
npm install file-saver
npm install recharts
```


## Requisitos

- Node.js 16+
- Navegador moderno

