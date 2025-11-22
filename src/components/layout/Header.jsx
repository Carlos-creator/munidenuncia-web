import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        {/* Marca a la izquierda */}
        <div className="site-header__brand">
          <Link to="/" className="brand">
            <span className="brand__logo" aria-hidden="true">
              <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="brand__logo-svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"/>
              </svg>
            </span>
            <span className="brand__name">MuniDenuncia</span>
          </Link>
        </div>

        {/* Nav al centro */}
        <nav className="site-header__nav nav nav--tw">
          <Link to="/" className={`nav__link ${isActive('/') ? 'nav__link--active' : ''}`}>
            Inicio
          </Link>
          <Link to="/denuncias" className={`nav__link ${isActive('/denuncias') ? 'nav__link--active' : ''}`}>
            Denuncias
          </Link>
          <Link to="/seguimiento" className={`nav__link ${isActive('/seguimiento') ? 'nav__link--active' : ''}`}>
            Mi Seguimiento
          </Link>
        </nav>

        {/* Iniciar sesión a la derecha */}
        <div className="site-header__actions">
          <button className="button button--outline">Iniciar Sesión</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
