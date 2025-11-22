import { useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, onLocationChange }) {
  useMapEvents({
    click(e) {
      const newPos = e.latlng;
      setPosition(newPos);
      onLocationChange(newPos.lat, newPos.lng);
    }
  });

  return position ? <Marker position={position} /> : null;
}

function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);

  return null;
}

const CrearDenuncia = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    descripcion: '',
    direccion: '',
    referencia: '',
    latitud: '',
    longitud: ''
  });
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Autocompletar direcciones usando Nominatim
  const fetchAddressSuggestions = debounce(async (query) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    // Limitar búsqueda a Chile y priorizar Viña del Mar y Valparaíso
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Chile')}&addressdetails=1&limit=10`;
    const res = await fetch(url);
    let data = await res.json();
    // Filtrar para mostrar primero Viña del Mar y Valparaíso
    let filtered = data.filter(s => {
      const name = (s.display_name || '').toLowerCase();
      return name.includes('chile') && (name.includes('viña del mar') || name.includes('valparaíso'));
    });
    // Si no hay resultados de Viña/Valpo, mostrar los de Chile
    if (filtered.length === 0) {
      filtered = data.filter(s => (s.display_name || '').toLowerCase().includes('chile'));
    }
    setAddressSuggestions(filtered);
  }, 400);

  const handleDireccionChange = (e) => {
    handleInputChange(e);
    fetchAddressSuggestions(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      direccion: suggestion.display_name,
      latitud: suggestion.lat,
      longitud: suggestion.lon
    }));
    setMapCenter([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
    setPosition({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setShowSuggestions(false);
  };

  const [imagePreview, setImagePreview] = useState(null);
  const [imagenBase64, setImagenBase64] = useState(null);
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([-33.0472, -71.6127]); // Valparaíso
  const [locationStatus, setLocationStatus] = useState('');
  const fileInputRef = useRef(null);
  const mapRef = useRef(null);

  const defaultCenter = [-33.0472, -71.6127]; // Valparaíso, Chile

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImagenBase64(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5MB.');
      e.target.value = '';
      setImagenBase64(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccione un archivo de imagen válido.');
      e.target.value = '';
      setImagenBase64(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setImagenBase64(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImagePreview(null);
    setImagenBase64(null);
  };

  const getCurrentLocation = () => {
    setLocationStatus('Obteniendo ubicación...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos = { lat: latitude, lng: longitude };
          setPosition(newPos);
          setMapCenter([latitude, longitude]); // Actualizar el centro del mapa
          updateAddressFromCoords(latitude, longitude);
          setLocationStatus('Ubicación obtenida');
          setTimeout(() => setLocationStatus(''), 3000);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          setLocationStatus('Error al obtener ubicación');
          setTimeout(() => setLocationStatus(''), 3000);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationStatus('Geolocalización no disponible');
    }
  };

  const updateAddressFromCoords = (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          const address = data.address || {};
          let direccionLegible = '';

          if (address.road && address.house_number) {
            direccionLegible = `${address.road} ${address.house_number}`;
          } else if (address.road) {
            direccionLegible = address.road;
          } else {
            direccionLegible = data.display_name.split(',')[0];
          }

          if (address.suburb || address.neighbourhood) {
            direccionLegible += `, ${address.suburb || address.neighbourhood}`;
          }

          setFormData(prev => ({
            ...prev,
            direccion: direccionLegible,
            latitud: lat.toString(),
            longitud: lng.toString()
          }));
        }
      })
      .catch(error => {
        console.error('Error en geocoding:', error);
      });
  };

  const handleLocationChange = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitud: lat.toString(),
      longitud: lng.toString()
    }));
    updateAddressFromCoords(lat, lng);
  };

  const handleCancel = () => {
    if (window.confirm('¿Está seguro de que desea cancelar? Se perderán todos los datos ingresados.')) {
      navigate('/seguimiento');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.titulo || !formData.categoria || !formData.descripcion || !formData.direccion) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const newReportId = Math.floor(Math.random() * 90000 + 10000);
    const currentDate = new Date();

    const denunciaData = {
      id: newReportId,
      ...formData,
      imagen: imagenBase64,
      fecha: currentDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
      fechaCreacion: currentDate.toISOString(),
      estado: 'Pendiente',
      progreso: 10,
      observaciones: 'El reporte está pendiente de asignación a un departamento específico.',
      likes: 0
    };

    let reportes = JSON.parse(localStorage.getItem('misReportes') || '[]');
    reportes.unshift(denunciaData);

    try {
      localStorage.setItem('misReportes', JSON.stringify(reportes));
      alert(`¡Denuncia enviada exitosamente!\nNúmero de reporte: #${newReportId}\n\nSerá redirigido a su panel de seguimiento.`);
      navigate(`/seguimiento?nuevo=${newReportId}`);
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
      alert('Error guardando el reporte. La imagen podría ser muy grande.');
    }
  };

  return (
    <div className="crear-denuncia-page">
      <div className="container page">
        <div className="page__inner page__inner--narrow">
          <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol className="breadcrumb__list">
            <li className="breadcrumb__item">
              <a href="/" className="breadcrumb__link">Inicio</a>
            </li>
            <li className="breadcrumb__item">
              <span className="breadcrumb__sep">/</span>
              <span className="breadcrumb__current">Crear Denuncia</span>
            </li>
          </ol>
        </nav>

        <header className="page-header">
          <h1 className="page-header__title">Crear Nueva Denuncia</h1>
          <p className="page-header__subtitle">
            Comparta los detalles de su reporte para que podamos ayudarle de la mejor manera.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="report-form">
          <section className="card">
            <h2 className="card__title">Información Básica</h2>

            <div className="grid grid--2">
              <div className="field">
                <label htmlFor="titulo" className="field__label">Título de la Denuncia *</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  required
                  className="field__control"
                  placeholder="Ej: Bache en la calle principal"
                  value={formData.titulo}
                  onChange={handleInputChange}
                />
              </div>

              <div className="field">
                <label htmlFor="categoria" className="field__label">Categoría *</label>
                <select
                  id="categoria"
                  name="categoria"
                  required
                  className="field__control"
                  value={formData.categoria}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="infraestructura">Infraestructura</option>
                  <option value="iluminacion">Iluminación</option>
                  <option value="limpieza">Limpieza</option>
                  <option value="vandalismo">Vandalismo</option>
                  <option value="transito">Tránsito</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="descripcion" className="field__label">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="4"
                required
                className="field__control"
                placeholder="Describa detalladamente el problema..."
                value={formData.descripcion}
                onChange={handleInputChange}
              />
            </div>
          </section>

          <section className="card">
            <h2 className="card__title">Evidencia Fotográfica</h2>

            <div className="upload">
              <label htmlFor="imagen" className="upload__drop">
                <div className="upload__content">
                  <span className="material-symbols-outlined upload__icon">cloud_upload</span>
                  <p className="upload__text"><strong>Haga clic para cargar</strong> o arrastre y suelte</p>
                  <p className="upload__hint">PNG, JPG o JPEG (MAX. 5MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  id="imagen"
                  type="file"
                  accept="image/*"
                  className="upload__input"
                  onChange={handleImageChange}
                />
              </label>

              {imagePreview && (
                <div className="preview">
                  <div className="preview__frame">
                    <img src={imagePreview} alt="Vista previa" className="preview__img" />
                    <button
                      type="button"
                      className="preview__remove"
                      aria-label="Eliminar imagen"
                      onClick={removeImage}
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="card">
            <h2 className="card__title">Ubicación del Problema</h2>

            <div className="field">
              <label className="field__label">Seleccione la ubicación en el mapa</label>
              <div className="map" style={{ height: '400px', zIndex: 1 }}>
                <MapContainer
                  center={position || defaultCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapUpdater center={mapCenter} />
                  <LocationMarker
                    position={position}
                    setPosition={setPosition}
                    onLocationChange={handleLocationChange}
                  />
                </MapContainer>
              </div>
              <div className="map__actions">
                <button
                  type="button"
                  className="button button--primary button--sm"
                  onClick={getCurrentLocation}
                >
                  <span className="material-symbols-outlined button__icon">my_location</span>
                  Mi Ubicación
                </button>
                <span className="map__status">{locationStatus}</span>
              </div>
            </div>

            <div className="grid grid--2">
              <div className="field field--full">
                <label htmlFor="direccion" className="field__label">Dirección *</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  required
                  className="field__control"
                  placeholder="Ej: Av. Libertador 1250, entre Mitre y San Martín"
                  value={formData.direccion}
                  autoComplete="off"
                  onChange={handleDireccionChange}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() => formData.direccion && setShowSuggestions(true)}
                />
                {showSuggestions && addressSuggestions.length > 0 && (
                  <ul className="address-suggestions" style={{position: 'absolute', zIndex: 10, background: '#fff', border: '1px solid #ccc', width: '100%', maxHeight: '180px', overflowY: 'auto'}}>
                    {addressSuggestions.map(s => (
                      <li key={s.place_id} style={{padding: '8px', cursor: 'pointer'}} onMouseDown={() => handleSuggestionClick(s)}>
                        {s.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>


              <div className="field">
                <label htmlFor="referencia" className="field__label">Referencia</label>
                <input
                  type="text"
                  id="referencia"
                  name="referencia"
                  className="field__control"
                  placeholder="Ej: Frente al banco, al lado del parque"
                  value={formData.referencia}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>

          <div className="form-actions">
            <button type="button" className="button button--ghost" onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit" className="button button--primary">
              Enviar Denuncia
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default CrearDenuncia;
