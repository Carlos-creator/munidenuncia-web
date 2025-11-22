import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SeguimientoPersonal = () => {
  const [reportesGuardados, setReportesGuardados] = useState([]);
  const location = useLocation();

  // Reportes estáticos (ejemplo)
  const reportesEstaticos = [
    {
      id: 12345,
      titulo: 'Falta de Iluminación en Calle Principal',
      direccion: 'Av. Libertador 1250, entre Mitre y San Martín',
      zona: 'sur',
      fecha: '15 de Julio, 2024',
      estado: 'En Revisión',
      progreso: 60,
      observaciones: 'El reporte está en proceso de revisión por el departamento de obras públicas.',
      likes: 24,
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXXT1T1-VKJ2f74L-MAxKLcRKxOmE91kpVkfK_QqEnNUGeKF_tWvlCwCC1Cm6nmfAL5SsBQV8ImDGknNb05aBmxamqqtbq9FBA_Hdu8ZlsImI7Q3Lq1m0CsguNb2sJNhldYt_yzKDOVc9Pw0PKqqXrvZ1sAukGAn2Jg_mybeHVisv3uwbs7EbkOo-tpFQw7CsK2JS3iy-vn0UcIJdDQzL83C7bvj3k3KKCLs5uOmbKzzwGMnc2WZiT3-RqDcQBqTtttjfkE7t72mVF',
      esEstatico: true
    },
    {
      id: 67890,
      titulo: 'Baches en Avenida Central',
      direccion: 'Av. Central 3420, altura puente vehicular',
      zona: 'norte',
      fecha: '20 de Junio, 2024',
      estado: 'Resuelto',
      progreso: 100,
      observaciones: 'El reporte ha sido resuelto y cerrado. Se recomienda verificar la solución en el lugar.',
      likes: 18,
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjvx5e6dMxi1jFcu7D8TTNmBoOyEoIgKdqJzJcOoyLERYu1-UianSfw6zYpRVB2-0PeWrwaX6vJypnlXyIsjE1vZt4flKPouCcwZ42iFmVZiuy3oXhvTHIkoIpEn-Jch7h_dFgRf43ghqIseOiPUmByE2X3kmx9vJsuVAwKXKMUAqnDcb3E8d93z8OCTISBC7d1X9g5ycNL4CbQXh4YeTzu8TgzEQPOK7Ddpx0wZyoZ-W6zCcav3ZffYnBtVD6CwZ0FQQV9YAaX5DM',
      esEstatico: true
    },
    {
      id: 11223,
      titulo: 'Acumulación de Basura en Parque',
      direccion: 'Parque San Martín, sector juegos infantiles',
      zona: 'centro',
      fecha: '5 de Mayo, 2024',
      estado: 'Pendiente',
      progreso: 20,
      observaciones: 'El reporte está pendiente de asignación a un departamento específico.',
      likes: 31,
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ52lzDw7GqGuVu1shcqrLfFesqYsKBGwOfsFV1-OtFaZ4RgqfUbeR2ugs_71wVSnttinthA7oU-KZB5ieSwY98MDu-wMhg7A2SHupppNn0Ej7QMUbJ5iSdjpn6F-e6rbUKtWpsAIYue_LO73Pi9VH61jPs5MlshZly94IuGVnFyfemCmIpsTDXymdsWmiVRadjMHWGFfvtNile6D0CnNrwDaRWwe7uPnpuoiajr5mcdDTCucgKPZxpBDtHbHzpZGrU0fgmGTblUIK',
      esEstatico: true
    }
  ];

  // Cargar reportes del localStorage
  useEffect(() => {
    const reportes = JSON.parse(localStorage.getItem('misReportes') || '[]');
    setReportesGuardados(reportes);
  }, []);

  // Manejar destacado de nuevo reporte
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nuevoReporteId = params.get('nuevo');
    
    if (nuevoReporteId) {
      setTimeout(() => {
        const card = document.querySelector(`[data-id="${nuevoReporteId}"]`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('report-card--highlight');
          setTimeout(() => card.classList.remove('report-card--highlight'), 3000);
        }
      }, 400);
    }
  }, [location]);

  // Combinar reportes
  const todosLosReportes = [...reportesGuardados, ...reportesEstaticos];

  // Función para eliminar reporte
  const eliminarReporte = (reporteId) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este reporte? Esta acción no se puede deshacer.')) {
      return;
    }
    
    const reportes = JSON.parse(localStorage.getItem('misReportes') || '[]');
    const nuevosReportes = reportes.filter(r => String(r.id) !== String(reporteId));
    localStorage.setItem('misReportes', JSON.stringify(nuevosReportes));
    setReportesGuardados(nuevosReportes);
    
    setTimeout(() => alert('El reporte ha sido eliminado exitosamente.'), 100);
  };

  // Obtener nombre de zona
  const getZonaNombre = (zona) => {
    const zonas = {
      centro: 'Zona Centro',
      norte: 'Zona Norte',
      sur: 'Zona Sur',
      este: 'Zona Este',
      oeste: 'Zona Oeste'
    };
    return zonas[zona] || `Zona ${zona || ''}`;
  };

  // Obtener modificador de estado
  const getStatusModifier = (estado, progreso) => {
    if (estado === 'Resuelto' || progreso === 100) return 'is-done';
    if (estado === 'En Revisión' || progreso >= 50) return 'is-review';
    return 'is-pending';
  };

  // Renderizar imagen
  const renderMedia = (reporte) => {
    if (!reporte.imagen) {
      return (
        <div className="report-card__media-fallback">
          <span className="report-card__media-fallback-text">Sin Imagen</span>
        </div>
      );
    }

    // Si es base64
    if (reporte.imagen.startsWith('data:image/')) {
      return (
        <img 
          className="report-card__media-img" 
          src={reporte.imagen} 
          alt="Imagen del reporte"
          onError={(e) => console.log('Error cargando imagen base64')}
        />
      );
    }

    // Si es URL
    if (reporte.imagen.startsWith('http')) {
      return (
        <div 
          className="report-card__media-bg" 
          style={{ 
            backgroundImage: `url('${reporte.imagen}')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        ></div>
      );
    }

    return (
      <div className="report-card__media-fallback">
        <span className="report-card__media-fallback-text">Sin Imagen</span>
      </div>
    );
  };

  return (
    <div className="container page">
      <div className="page__inner page__inner--narrow">
        <header className="page-header">
          <div className="page-header__grid">
            <div className="page-header__text">
              <h1 className="page-header__title">Mis Reportes</h1>
              <p className="page-header__subtitle">Aquí puedes ver el estado de todas tus denuncias.</p>
            </div>

            {/* CTA desktop */}
            <Link to="/crear" className="button button--primary button--lg page-header__cta">
              <span className="button__icon">+</span>
              Crear Denuncia
            </Link>
          </div>
        </header>

        {/* Lista de reportes */}
        <section id="reportes-container" className="reports-list">
          {todosLosReportes.map(reporte => (
            <article 
              key={reporte.id} 
              className={`report-card ${getStatusModifier(reporte.estado, reporte.progreso)}`}
              data-id={reporte.id}
            >
              <div className="report-card__media">
                {renderMedia(reporte)}
                {!reporte.esEstatico && (
                  <button 
                    className="chip chip--danger report-card__delete" 
                    title="Eliminar reporte"
                    onClick={() => eliminarReporte(reporte.id)}
                  >
                    <svg className="chip__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Eliminar
                  </button>
                )}
              </div>

              <div className="report-card__body">
                <div className="report-card__head">
                  <p className="report-card__id">Reporte #{reporte.id}</p>
                  <div className="report-card__meta">
                    <span className="badge">{reporte.estado}</span>
                    <div className="likes">
                      <span className="likes__icon" aria-hidden="true">👍</span>
                      <span className="likes__count">{reporte.likes || 0}</span>
                    </div>
                  </div>
                </div>

                <h3 className="report-card__title">{reporte.titulo}</h3>

                <div className="report-card__row">
                  <span className="report-card__pin" aria-hidden="true">📍</span>
                  <p className="report-card__text">{reporte.direccion}</p>
                </div>

                <div className="report-card__row">
                  <span className="report-card__map" aria-hidden="true">🗺️</span>
                  <span className="report-card__zone">{getZonaNombre(reporte.zona)}</span>
                </div>

                <p className="report-card__date">Creado: {reporte.fecha}</p>

                <div className="progress">
                  <div className="progress__bar" style={{ width: `${reporte.progreso}%` }}></div>
                  <span className="progress__label">{reporte.progreso}%</span>
                </div>

                <div className="note">
                  <p className="note__text">
                    <span className="note__strong">Observaciones:</span> {reporte.observaciones}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Estado vacío */}
        {todosLosReportes.length === 0 && (
          <section className="empty-state">
            <div className="empty-state__emoji" aria-hidden="true">📋</div>
            <h3 className="empty-state__title">No tienes reportes aún</h3>
            <p className="empty-state__text">Crea tu primera denuncia para comenzar a hacer seguimiento.</p>
            <Link to="/crear" className="button button--primary button--md">
              <span className="button__icon">+</span>
              Crear Primera Denuncia
            </Link>
          </section>
        )}
      </div>

      {/* FAB móvil */}
      <Link to="/crear" className="fab">
        <span className="fab__icon">+</span>
        <span className="fab__label">Crear Denuncia</span>
      </Link>
    </div>
  );
};

export default SeguimientoPersonal;
