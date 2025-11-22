import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [denuncias, setDenuncias] = useState([
    {
      id: 1,
      reportId: '12345',
      title: 'Falta de Iluminación en Calle Principal',
      location: 'Av. Libertador 1250, entre Mitre y San Martín',
      zone: 'Zona Sur',
      author: 'Ana García',
      likes: 24,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXXT1T1-VKJ2f74L-MAxKLcRKxOmE91kpVkfK_QqEnNUGeKF_tWvlCwCC1Cm6nmfAL5SsBQV8ImDGknNb05aBmxamqqtbq9FBA_Hdu8ZlsImI7Q3Lq1m0CsguNb2sJNhldYt_yzKDOVc9Pw0PKqqXrvZ1sAukGAn2Jg_mybeHVisv3uwbs7EbkOo-tpFQw7CsK2JS3iy-vn0UcIJdDQzL83C7bvj3k3KKCLs5uOmbKzzwGMnc2WZiT3-RqDcQBqTtttjfkE7t72mVF'
    },
    {
      id: 2,
      reportId: '67890',
      title: 'Baches en Avenida Central',
      location: 'Av. Central 3420, altura puente vehicular',
      zone: 'Zona Norte',
      author: 'Carlos López',
      likes: 18,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjvx5e6dMxi1jFcu7D8TTNmBoOyEoIgKdqJzJcOoyLERYu1-UianSfw6zYpRVB2-0PeWrwaX6vJypnlXyIsjE1vZt4flKPouCcwZ42iFmVZiuy3oXhvTHIkoIpEn-Jch7h_dFgRf43ghqIseOiPUmByE2X3kmx9vJsuVAwKXKMUAqnDcb3E8d93z8OCTISBC7d1X9g5ycNL4CbQXh4YeTzu8TgzEQPOK7Ddpx0wZyoZ-W6zCcav3ZffYnBtVD6CwZ0FQQV9YAaX5DM'
    },
    {
      id: 3,
      reportId: '11223',
      title: 'Acumulación de Basura en Parque',
      location: 'Parque San Martín, sector juegos infantiles',
      zone: 'Zona Centro',
      author: 'Sofía Martínez',
      likes: 31,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ52lzDw7GqGuVu1shcqrLfFesqYsKBGwOfsFV1-OtFaZ4RgqfUbeR2ugs_71wVSnttinthA7oU-KZB5ieSwY98MDu-wMhg7A2SHupppNn0Ej7QMUbJ5iSdjpn6F-e6rbUKtWpsAIYue_LO73Pi9VH61jPs5MlshZly94IuGVnFyfemCmIpsTDXymdsWmiVRadjMHWGFfvtNile6D0CnNrwDaRWwe7uPnpuoiajr5mcdDTCucgKPZxpBDtHbHzpZGrU0fgmGTblUIK'
    }
  ]);

  const [likedReports, setLikedReports] = useState({});

  useEffect(() => {
    const savedLikes = {};
    denuncias.forEach(d => {
      const key = `liked_report_${d.id}`;
      savedLikes[d.id] = localStorage.getItem(key) === 'true';
    });
    setLikedReports(savedLikes);
  }, []);

  const handleLike = (reportId) => {
    const key = `liked_report_${reportId}`;
    const isLiked = likedReports[reportId];

    setDenuncias(prev => prev.map(d => {
      if (d.id === reportId) {
        return {
          ...d,
          likes: isLiked ? d.likes - 1 : d.likes + 1
        };
      }
      return d;
    }));

    const newLikedState = !isLiked;
    setLikedReports(prev => ({ ...prev, [reportId]: newLikedState }));
    localStorage.setItem(key, String(newLikedState));
  };

  return (
    <>
      <section 
        className="hero" 
        style={{
          backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMhsPha3L9nrJzeBl_VeQNcjVlKb4s3rey3OhFTFdWlklkTVaYD7U2BLTZcWWtt5Ao8BqmrC65gmvYcJgnjlrmowLuIzG0DA4pLUPpSu4563CU-OMbVAwF8wiZ2cUL_Q9vrSqsGvI61qdKxvFdjsuOt64mpkYf_PtYeXxI3P1Nivj1xaNi9y1ygOH_ryzyqGI2QnzyqWSV0tYViPFhbBQXK5wm6vimg6h5VvARSSFxXap5GaoxShMC5zH3I-WsvMU6Xr5cy4voV2yK')",
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="hero__overlay"></div>
        <div className="hero__content container">
          <h1 className="hero__title">Bienvenido a MuniDenuncia</h1>
          <p className="hero__subtitle">Reporta problemas urbanos y sigue el progreso de tus denuncias.</p>
          <div className="hero__cta">
            <Link to="/crear" className="button button--primary button--lg">Crear Denuncia</Link>
          </div>
        </div>
      </section>

      <section className="section section--spacing">
        <div className="container">
          <header className="section__header">
            <h2 className="section__title">Acciones Rápidas</h2>
          </header>
          <div className="actions">
            <Link to="/denuncias" className="button button--primary actions__btn">Ver Denuncias</Link>
            <Link to="/seguimiento" className="button button--ghost actions__btn">Mi Seguimiento</Link>
          </div>
        </div>
      </section>

      <section className="section section--muted section--spacing">
        <div className="container">
          <header className="section__header">
            <h2 className="section__title">Denuncias Destacadas</h2>
            <p className="section__subtitle">Las denuncias con más apoyo de la comunidad.</p>
          </header>

          <div className="grid">
            {denuncias.map(denuncia => (
              <article key={denuncia.id} className="card">
                <div 
                  className="card__media" 
                  style={{ 
                    backgroundImage: `url('${denuncia.image}')`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                  }}
                ></div>
                <div className="card__body">
                  <div className="card__topline">
                    <p className="card__tag">Reporte #{denuncia.reportId}</p>
                    <button 
                      className={`like like--btn ${likedReports[denuncia.id] ? 'like--active' : ''}`}
                      data-report-id={denuncia.id}
                      aria-pressed={likedReports[denuncia.id] || false}
                      onClick={() => handleLike(denuncia.id)}
                    >
                      <span className="like__icon" aria-hidden="true">👍</span>
                      <span className="like__count">{denuncia.likes}</span>
                    </button>
                  </div>

                  <h3 className="card__title">{denuncia.title}</h3>
                  
                  <div className="card__meta">
                    <span className="card__meta-emoji" aria-hidden="true">📍</span>
                    <p className="card__meta-text">{denuncia.location}</p>
                  </div>
                  
                  <div className="card__meta card__meta--inline">
                    <span className="card__meta-emoji" aria-hidden="true">🗺️</span>
                    <span className="card__zone">{denuncia.zone}</span>
                  </div>
                  
                  <p className="card__author">Reportado por {denuncia.author}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
