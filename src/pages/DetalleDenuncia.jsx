import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const DetalleDenuncia = () => {
  const { id } = useParams();
  const [denuncia, setDenuncia] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const denunciaEjemplo = {
      id: id,
      titulo: 'Falta de Iluminación en Calle Principal',
      categoria: 'Iluminación',
      descripcion: 'En la Av. Libertador, entre Mitre y San Martín, hay varios postes de luz que no funcionan hace semanas. Esto genera inseguridad durante la noche.',
      direccion: 'Av. Libertador 1250, entre Mitre y San Martín',
      zona: 'Zona Sur',
      referencia: 'Cerca de la plaza principal',
      estado: 'En Proceso',
      progreso: 45,
      fecha: '15 de enero de 2024',
      autor: 'Ana García',
      likes: 24,
      observaciones: 'El departamento de servicios públicos ha sido notificado y está evaluando la situación.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXXT1T1-VKJ2f74L-MAxKLcRKxOmE91kpVkfK_QqEnNUGeKF_tWvlCwCC1Cm6nmfAL5SsBQV8ImDGknNb05aBmxamqqtbq9FBA_Hdu8ZlsImI7Q3Lq1m0CsguNb2sJNhldYt_yzKDOVc9Pw0PKqqXrvZ1sAukGAn2Jg_mybeHVisv3uwbs7EbkOo-tpFQw7CsK2JS3iy-vn0UcIJdDQzL83C7bvj3k3KKCLs5uOmbKzzwGMnc2WZiT3-RqDcQBqTtttjfkE7t72mVF'
    };
    setDenuncia(denunciaEjemplo);
    
    // Verificar si ya tiene like
    const likedKey = `liked_report_${id}`;
    setIsLiked(localStorage.getItem(likedKey) === 'true');
  }, [id]);

  const handleLike = () => {
    const likedKey = `liked_report_${id}`;
    const newLikedState = !isLiked;
    
    setDenuncia(prev => ({
      ...prev,
      likes: newLikedState ? prev.likes + 1 : prev.likes - 1
    }));
    
    setIsLiked(newLikedState);
    localStorage.setItem(likedKey, String(newLikedState));
  };

  if (!denuncia) {
    return (
      <div className="container page">
        <div className="page__inner">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'badge--warning';
      case 'En Proceso': return 'badge--info';
      case 'Resuelta': return 'badge--success';
      default: return '';
    }
  };

  return (
    <div className="container page">
      <div className="page__inner page__inner--narrow">
        <header className="detalle-header">
          <div className="detalle-header__top">
            <span className="detalle-header__tag">Reporte #{denuncia.id}</span>
            <button 
              className={`like like--btn ${isLiked ? 'like--active' : ''}`}
              onClick={handleLike}
              aria-pressed={isLiked}
            >
              <span className="like__icon" aria-hidden="true">👍</span>
              <span className="like__count">{denuncia.likes}</span>
            </button>
          </div>
          <h1 className="detalle-header__title">{denuncia.titulo}</h1>
        </header>

        <div className="detalle-grid">
          {/* Imagen a la izquierda */}
          <div className="detalle-grid__image">
            <img src={denuncia.image} alt={denuncia.titulo} className="detalle-image" />
          </div>

          {/* Información a la derecha */}
          <div className="detalle-grid__info">
            <div className="detalle-info">
              <h2 className="detalle-info__title">Información del Reporte</h2>
              
              <div className="detalle-info__item">
                <span className="detalle-info__label">📍 Dirección</span>
                <span className="detalle-info__value">{denuncia.direccion}</span>
              </div>

              <div className="detalle-info__item">
                <span className="detalle-info__label">🗺️ Zona</span>
                <span className="detalle-info__value">{denuncia.zona}</span>
              </div>

              <div className="detalle-info__item">
                <span className="detalle-info__label">📂 Categoría</span>
                <span className="detalle-info__value">{denuncia.categoria}</span>
              </div>

              <div className="detalle-info__item">
                <span className="detalle-info__label">👤 Reportado por</span>
                <span className="detalle-info__value">{denuncia.autor}</span>
              </div>

              <div className="detalle-info__item">
                <span className="detalle-info__label">📅 Fecha</span>
                <span className="detalle-info__value">{denuncia.fecha}</span>
              </div>

              <div className="detalle-info__item">
                <span className="detalle-info__label">📊 Estado</span>
                <span className={`badge ${getEstadoClass(denuncia.estado)}`}>
                  {denuncia.estado}
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="detalle-section">
          <h2 className="detalle-section__title">Descripción</h2>
          <p className="detalle-section__text">{denuncia.descripcion}</p>
        </section>

        {denuncia.observaciones && (
          <section className="detalle-section">
            <h2 className="detalle-section__title">Observaciones</h2>
            <div className="detalle-section__note">
              <p>{denuncia.observaciones}</p>
            </div>
          </section>
        )}

        <section className="detalle-section">
          <h2 className="detalle-section__title">Progreso del Reporte</h2>
          <div className="detalle-progress">
            <div className="detalle-progress__bar">
              <div 
                className="detalle-progress__fill" 
                style={{ width: `${denuncia.progreso}%` }}
              ></div>
            </div>
            <span className="detalle-progress__text">{denuncia.progreso}% completado</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DetalleDenuncia;
