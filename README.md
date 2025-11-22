# MuniDenuncia - React + Webpack

Sistema de Denuncias Municipales desarrollado con React y Webpack.

## 🚀 Inicio Rápido

### 1. Las dependencias ya están instaladas

Las dependencias de React, Webpack, Babel y todas las librerías ya se instalaron automáticamente.

### 2. Iniciar el servidor de desarrollo

```powershell
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### 3. Compilar para producción

```powershell
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
├── public/                 # Archivos públicos estáticos
│   ├── index.html         # Template HTML principal
│   └── favicon.ico
├── src/                   # Código fuente React
│   ├── components/        # Componentes React
│   │   └── layout/       
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       └── Layout.jsx
│   ├── pages/            # Páginas/Vistas
│   │   ├── Home.jsx
│   │   ├── CrearDenuncia.jsx
│   │   ├── VerDenuncias.jsx
│   │   ├── DetalleDenuncia.jsx
│   │   └── SeguimientoPersonal.jsx
│   ├── App.jsx           # Componente principal con rutas
│   └── index.js          # Punto de entrada
├── css/                  # Estilos CSS (importados desde src/App.jsx)
├── webpack.config.js     # Configuración de Webpack
├── .babelrc             # Configuración de Babel
└── package.json         # Dependencias del proyecto
```

## 🗺️ Rutas de la Aplicación

- `/` - Página de inicio con denuncias destacadas
- `/crear` - Formulario para crear nueva denuncia
- `/denuncias` - Lista de todas las denuncias con filtros
- `/detalle/:id` - Detalle de una denuncia específica
- `/seguimiento` - Panel personal de seguimiento

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **React Router DOM** - Enrutamiento
- **Webpack 5** - Module bundler
- **Babel** - Transpilador
- **Leaflet + React Leaflet** - Mapas interactivos
- **CSS BEM** - Metodología de estilos

## ✨ Características

### ✅ Migración Completa de HTML/JS a React

- ✅ Todos los templates HTML convertidos a componentes React
- ✅ Lógica JavaScript migrada a hooks (useState, useEffect)
- ✅ Navegación convertida a React Router
- ✅ Estilos CSS preservados
- ✅ Funcionalidad de mapas con React Leaflet
- ✅ Sistema de almacenamiento en LocalStorage

### 🎯 Funcionalidades Principales

1. **Crear Denuncia**
   - Formulario con validación
   - Mapa interactivo con Leaflet
   - Geolocalización del usuario
   - Upload de imágenes con preview

2. **Ver Denuncias**
   - Lista de todas las denuncias
   - Filtros por categoría, zona y estado
   - Botón flotante para crear nueva

3. **Detalle de Denuncia**
   - Información completa del reporte
   - Barra de progreso
   - Sistema de likes/apoyos

4. **Seguimiento Personal**
   - Dashboard con estadísticas
   - Tabla de denuncias personales
   - Gestión de reportes

## 📝 Scripts Disponibles

- `npm start` - Inicia servidor de desarrollo (puerto 3000)
- `npm run dev` - Alias para npm start
- `npm run build` - Compila para producción

## 💾 Persistencia de Datos

Los datos se almacenan en LocalStorage:
- `misReportes` - Array de denuncias del usuario
- `liked_report_{id}` - Estado de likes por denuncia

## 🎨 Estilos

Los estilos CSS utilizan metodología BEM y están organizados por componente/página.

## 📄 Licencia

ISC


## 👥 Integrantes

| Nombre                | ROL            |
|----------------------|-----------------|
| Cristóbal Cesped     | 202173054-0     |
| Carlos Ramírez       | 202192826-K     |
| Baltazar Portilla    | 202173112-1   |

