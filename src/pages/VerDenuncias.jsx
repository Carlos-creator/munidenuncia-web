import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const VerDenuncias = () => {
  const [denuncias, setDenuncias] = useState([
    {
      id: 12345,
      titulo: 'Bache en la calle principal',
      direccion: 'Av. Central 3420',
      autor: 'Ana García',
      categoria: 'infraestructura',
      zona: 'norte',
      estado: 'en-gestion',
      fecha: '15 de enero de 2024',
      likes: 24,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXXT1T1-VKJ2f74L-MAxKLcRKxOmE91kpVkfK_QqEnNUGeKF_tWvlCwCC1Cm6nmfAL5SsBQV8ImDGknNb05aBmxamqqtbq9FBA_Hdu8ZlsImI7Q3Lq1m0CsguNb2sJNhldYt_yzKDOVc9Pw0PKqqXrvZ1sAukGAn2Jg_mybeHVisv3uwbs7EbkOo-tpFQw7CsK2JS3iy-vn0UcIJdDQzL83C7bvj3k3KKCLs5uOmbKzzwGMnc2WZiT3-RqDcQBqTtttjfkE7t72mVF'
    },
    {
      id: 67890,
      titulo: 'Falta de iluminación en el parque',
      direccion: 'Parque San Martín',
      autor: 'Carlos López',
      categoria: 'iluminacion',
      zona: 'sur',
      estado: 'recibida',
      fecha: '10 de enero de 2024',
      likes: 18,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjvx5e6dMxi1jFcu7D8TTNmBoOyEoIgKdqJzJcOoyLERYu1-UianSfw6zYpRVB2-0PeWrwaX6vJypnlXyIsjE1vZt4flKPouCcwZ42iFmVZiuy3oXhvTHIkoIpEn-Jch7h_dFgRf43ghqIseOiPUmByE2X3kmx9vJsuVAwKXKMUAqnDcb3E8d93z8OCTISBC7d1X9g5ycNL4CbQXh4YeTzu8TgzEQPOK7Ddpx0wZyoZ-W6zCcav3ZffYnBtVD6CwZ0FQQV9YAaX5DM'
    },
    {
      id: 11223,
      titulo: 'Acumulación de basura en esquina',
      direccion: 'Parque San Martín, sector juegos infantiles',
      autor: 'Sofía Martínez',
      categoria: 'basura',
      zona: 'centro',
      estado: 'resuelta',
      fecha: '5 de enero de 2024',
      likes: 31,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ52lzDw7GqGuVu1shcqrLfFesqYsKBGwOfsFV1-OtFaZ4RgqfUbeR2ugs_71wVSnttinthA7oU-KZB5ieSwY98MDu-wMhg7A2SHupppNn0Ej7QMUbJ5iSdjpn6F-e6rbUKtWpsAIYue_LO73Pi9VH61jPs5MlshZly94IuGVnFyfemCmIpsTDXymdsWmiVRadjMHWGFfvtNile6D0CnNrwDaRWwe7uPnpuoiajr5mcdDTCucgKPZxpBDtHbHzpZGrU0fgmGTblUIK'
    },
    {
      id: 44556,
      titulo: 'Graffiti en edificio histórico',
      direccion: 'Calle Histórica 789',
      autor: 'Miguel Torres',
      categoria: 'vandalismo',
      zona: 'este',
      estado: 'recibida',
      fecha: '2 de enero de 2024',
      likes: 12,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ52lzDw7GqGuVu1shcqrLfFesqYsKBGwOfsFV1-OtFaZ4RgqfUbeR2ugs_71wVSnttinthA7oU-KZB5ieSwY98MDu-wMhg7A2SHupppNn0Ej7QMUbJ5iSdjpn6F-e6rbUKtWpsAIYue_LO73Pi9VH61jPs5MlshZly94IuGVnFyfemCmIpsTDXymdsWmiVRadjMHWGFfvtNile6D0CnNrwDaRWwe7uPnpuoiajr5mcdDTCucgKPZxpBDtHbHzpZGrU0fgmGTblUIK'
    }
  ]);

  const [filtros, setFiltros] = useState({
    tipo: 'todos',
    zona: 'todos',
    estado: 'todos'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [likedReports, setLikedReports] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const suggestionsRef = useRef(null);

  // Base de datos de búsqueda
  const searchDatabase = [
    { type: 'problema', value: 'Bache en la calle principal', category: 'Problemas' },
    { type: 'problema', value: 'Falta de iluminación en el parque', category: 'Problemas' },
    { type: 'problema', value: 'Acumulación de basura en esquina', category: 'Problemas' },
    { type: 'problema', value: 'Graffiti en edificio histórico', category: 'Problemas' },
    { type: 'direccion', value: 'Av. Libertador 1250', category: 'Direcciones' },
    { type: 'direccion', value: 'Av. Central 3420', category: 'Direcciones' },
    { type: 'direccion', value: 'Parque San Martín', category: 'Direcciones' },
    { type: 'direccion', value: 'Calle Histórica 789', category: 'Direcciones' },
    { type: 'zona', value: 'Zona Centro', category: 'Zonas' },
    { type: 'zona', value: 'Zona Norte', category: 'Zonas' },
    { type: 'zona', value: 'Zona Sur', category: 'Zonas' },
    { type: 'zona', value: 'Zona Este', category: 'Zonas' },
    { type: 'reporte', value: 'Reporte #12345', category: 'Reportes' },
    { type: 'reporte', value: 'Reporte #67890', category: 'Reportes' },
    { type: 'reporte', value: 'Reporte #11223', category: 'Reportes' },
    { type: 'reporte', value: 'Reporte #44556', category: 'Reportes' },
    { type: 'persona', value: 'Ana García', category: 'Reportado por' },
    { type: 'persona', value: 'Carlos López', category: 'Reportado por' },
    { type: 'persona', value: 'Sofía Martínez', category: 'Reportado por' },
    { type: 'persona', value: 'Miguel Torres', category: 'Reportado por' }
  ];

  // Restaurar likes del localStorage
  useEffect(() => {
    const savedLikes = {};
    denuncias.forEach(d => {
      const key = `liked_report_${d.id}`;
      if (localStorage.getItem(key) === 'true') {
        savedLikes[d.id] = true;
      }
    });
    setLikedReports(savedLikes);
  }, [denuncias]);

  // Ordenar por likes al cargar
  useEffect(() => {
    setDenuncias(prev => [...prev].sort((a, b) => b.likes - a.likes));
  }, []);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (!event.target.closest('.dropdown')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (!event.target.closest('.dropdown')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar likes
  const handleLike = (id) => {
    const key = `liked_report_${id}`;
    const isLiked = likedReports[id];

    if (!isLiked) {
      setLikedReports(prev => ({ ...prev, [id]: true }));
      localStorage.setItem(key, 'true');
      setDenuncias(prev => prev.map(d => 
        d.id === id ? { ...d, likes: d.likes + 1 } : d
      ));
    } else {
      setLikedReports(prev => {
        const newLikes = { ...prev };
        delete newLikes[id];
        return newLikes;
      });
      localStorage.setItem(key, 'false');
      setDenuncias(prev => prev.map(d => 
        d.id === id ? { ...d, likes: Math.max(d.likes - 1, 0) } : d
      ));
    }

    // Reordenar después de un delay
    setTimeout(() => {
      setDenuncias(prev => [...prev].sort((a, b) => b.likes - a.likes));
    }, 150);
  };

  // Manejar búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (value) => {
    setSearchTerm(value);
    setShowSuggestions(false);
  };

  // Filtrar sugerencias
  const filteredSuggestions = searchDatabase.filter(item =>
    item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSuggestions = filteredSuggestions.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Función para resaltar texto en sugerencias
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="search__mark">{part}</mark> : part
    );
  };

  // Obtener icono según tipo
  const getIconForType = (type) => {
    switch (type) {
      case 'problema': return 'report_problem';
      case 'direccion': return 'location_on';
      case 'reporte': return 'receipt';
      case 'persona': return 'person';
      default: return 'help';
    }
  };

  // Manejar filtros
  const handleFiltroChange = (tipo, valor) => {
    setFiltros(prev => ({ ...prev, [tipo]: valor }));
    setDropdownOpen(null);
  };

  const clearAllFilters = () => {
    setFiltros({
      tipo: 'todos',
      zona: 'todos',
      estado: 'todos'
    });
    setSearchTerm('');
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = () => {
    return filtros.tipo !== 'todos' || 
           filtros.zona !== 'todos' || 
           filtros.estado !== 'todos' ||
           searchTerm.length > 0;
  };

  // Filtrar denuncias
  const denunciasFiltradas = denuncias.filter(d => {
    // Filtros de dropdown
    const matchTipo = filtros.tipo === 'todos' || d.categoria === filtros.tipo;
    const matchZona = filtros.zona === 'todos' || d.zona === filtros.zona;
    const matchEstado = filtros.estado === 'todos' || d.estado === filtros.estado;

    // Búsqueda por texto
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || 
      d.titulo.toLowerCase().includes(searchLower) ||
      `Reporte #${d.id}`.toLowerCase().includes(searchLower) ||
      d.direccion.toLowerCase().includes(searchLower) ||
      d.autor.toLowerCase().includes(searchLower);

    return matchTipo && matchZona && matchEstado && matchSearch;
  });

  // Obtener texto del filtro
  const getFiltroText = (tipo) => {
    switch (tipo) {
      case 'todos': return 'Tipo de Problema';
      case 'infraestructura': return 'Infraestructura';
      case 'iluminacion': return 'Iluminación';
      case 'basura': return 'Basura';
      case 'vandalismo': return 'Vandalismo';
      default: return 'Tipo de Problema';
    }
  };

  const getZonaText = (zona) => {
    if (zona === 'todos') return 'Zona';
    return zona.charAt(0).toUpperCase() + zona.slice(1);
  };

  const getEstadoText = (estado) => {
    switch (estado) {
      case 'todos': return 'Estado';
      case 'recibida': return 'Recibida';
      case 'en-gestion': return 'En Gestión';
      case 'resuelta': return 'Resuelta';
      default: return 'Estado';
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'recibida': return 'badge--warning';
      case 'en-gestion': return 'badge--review';
      case 'resuelta': return 'badge--done';
      default: return '';
    }
  };

  return (
    <div className="container page">
      <div className="page__inner page__inner--narrow">
        <header className="page-header">
          <h1 className="page-header__title">Reportes Públicos</h1>
          <p className="page-header__subtitle">Explora los reportes de otros ciudadanos y apoya aquellos que te interesen.</p>
        </header>

        {/* Buscador */}
        <section className="search search--main">
          <div className="search__field" ref={suggestionsRef}>
            <label className="search__label">
              <span className="search__icon material-symbols-outlined" aria-hidden="true">search</span>
              <input
                id="search-input"
                className="search__input search__input--xl"
                type="text"
                placeholder="Buscar por dirección, problema o número de reporte…"
                aria-label="Buscar por dirección, problema o número de reporte"
                autoComplete="off"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button 
                  id="clear-search" 
                  className="search__clear" 
                  type="button" 
                  aria-label="Limpiar búsqueda"
                  onClick={handleSearchClear}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </label>

            {/* Sugerencias */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="search__suggestions" role="listbox" aria-label="Sugerencias">
                <div className="search__suggestions-content">
                  {Object.keys(groupedSuggestions).map(category => (
                    <div key={category}>
                      <div className="search__group">{category}</div>
                      {groupedSuggestions[category].map((item, idx) => (
                        <button
                          key={idx}
                          className="search__suggestion"
                          role="option"
                          onClick={() => handleSuggestionClick(item.value)}
                        >
                          <span className="material-symbols-outlined search__suggestion-icon">
                            {getIconForType(item.type)}
                          </span>
                          <span className="search__suggestion-text">
                            {highlightText(item.value, searchTerm)}
                          </span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contador de resultados */}
            {searchTerm && (
              <div className="search__counter">
                <span id="results-text">{denunciasFiltradas.length} resultado(s) para "{searchTerm}"</span>
              </div>
            )}
          </div>
        </section>

        {/* Filtros + CTA */}
        <section className="filters">
          <div className="filters__group">
            {/* Tipo */}
            <div className="dropdown" data-dropdown="tipo">
              <button 
                className="dropdown__toggle" 
                type="button" 
                onClick={() => setDropdownOpen(dropdownOpen === 'tipo' ? null : 'tipo')}
                aria-haspopup="true" 
                aria-expanded={dropdownOpen === 'tipo'}
              >
                <span id="tipo-text">{getFiltroText(filtros.tipo)}</span>
                <span className="material-symbols-outlined dropdown__chev" aria-hidden="true">expand_more</span>
              </button>
              <div className={`dropdown__menu ${dropdownOpen === 'tipo' ? 'dropdown__menu--open' : ''}`}>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('tipo', 'todos')}>Todos</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('tipo', 'infraestructura')}>Infraestructura</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('tipo', 'iluminacion')}>Iluminación</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('tipo', 'basura')}>Basura</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('tipo', 'vandalismo')}>Vandalismo</button>
              </div>
            </div>

            {/* Zona */}
            <div className="dropdown" data-dropdown="zona">
              <button 
                className="dropdown__toggle" 
                type="button" 
                onClick={() => setDropdownOpen(dropdownOpen === 'zona' ? null : 'zona')}
              >
                <span id="zona-text">{getZonaText(filtros.zona)}</span>
                <span className="material-symbols-outlined dropdown__chev" aria-hidden="true">expand_more</span>
              </button>
              <div className={`dropdown__menu ${dropdownOpen === 'zona' ? 'dropdown__menu--open' : ''}`}>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('zona', 'todos')}>Todas</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('zona', 'centro')}>Centro</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('zona', 'norte')}>Norte</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('zona', 'sur')}>Sur</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('zona', 'este')}>Este</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('zona', 'oeste')}>Oeste</button>
              </div>
            </div>

            {/* Estado */}
            <div className="dropdown" data-dropdown="estado">
              <button 
                className="dropdown__toggle" 
                type="button" 
                onClick={() => setDropdownOpen(dropdownOpen === 'estado' ? null : 'estado')}
              >
                <span id="estado-text">{getEstadoText(filtros.estado)}</span>
                <span className="material-symbols-outlined dropdown__chev" aria-hidden="true">expand_more</span>
              </button>
              <div className={`dropdown__menu ${dropdownOpen === 'estado' ? 'dropdown__menu--open' : ''}`}>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('estado', 'todos')}>Todos</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('estado', 'recibida')}>Recibida</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('estado', 'en-gestion')}>En Gestión</button>
                <button className="dropdown__item" type="button" onClick={() => handleFiltroChange('estado', 'resuelta')}>Resuelta</button>
              </div>
            </div>

            {/* Limpiar - Solo si hay filtros activos */}
            {hasActiveFilters() && (
              <button className="filters__clear" type="button" onClick={clearAllFilters}>
                Limpiar filtros
              </button>
            )}
          </div>

          <Link to="/crear" className="button button--primary">
            <span className="material-symbols-outlined button__icon" aria-hidden="true">add</span>
            <span>Crear Reporte</span>
          </Link>
        </section>

        {/* Grid de tarjetas */}
        <section className="cards">
          {denunciasFiltradas.length === 0 ? (
            <div className="nores">
              <div className="nores__wrap">
                <span className="material-symbols-outlined nores__icon" aria-hidden="true">search_off</span>
                <h3 className="nores__title">No se encontraron resultados</h3>
                <p className="nores__text">Prueba otros términos o ajusta los filtros.</p>
              </div>
            </div>
          ) : (
            denunciasFiltradas.map(denuncia => (
              <article key={denuncia.id} className="card">
                <div 
                  className="card__media card__media--sm" 
                  style={{ 
                    backgroundImage: `url('${denuncia.image}')`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                  }}
                ></div>
                <div className="card__body">
                  <div className="card__head">
                    <p className="card__id">Reporte #{denuncia.id}</p>
                    <div className="card__meta">
                      <span className={`badge ${getEstadoBadge(denuncia.estado)}`}>
                        {getEstadoText(denuncia.estado)}
                      </span>
                      <button 
                        className={`like like--btn ${likedReports[denuncia.id] ? 'like--active' : ''}`}
                        type="button" 
                        aria-pressed={likedReports[denuncia.id] ? 'true' : 'false'}
                        aria-label="Apoyar reporte"
                        onClick={() => handleLike(denuncia.id)}
                      >
                        <span className="like__icon" aria-hidden="true">👍</span>
                        <span className="like__count">{denuncia.likes}</span>
                      </button>
                    </div>
                  </div>
                  <h3 className="card__title">
                    <Link className="card__link" to={`/detalle/${denuncia.id}`}>
                      {denuncia.titulo}
                    </Link>
                  </h3>
                  <div className="card__row">
                    <span className="card__pin" aria-hidden="true">📍</span>
                    <p className="card__text">{denuncia.direccion}</p>
                  </div>
                  <div className="card__row">
                    <span className="card__map" aria-hidden="true">🗺️</span>
                    <span className="card__zone">Zona {getZonaText(denuncia.zona)}</span>
                  </div>
                  <p className="card__author">Reportado por {denuncia.autor}</p>
                  
                  <Link to={`/detalle/${denuncia.id}`} className="button button--primary button--block card__action">
                    Ver Detalle
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default VerDenuncias;
