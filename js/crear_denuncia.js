"use strict";

/* ===========================
   Estado y referencias
=========================== */
let map;
let marker;
let userLocation = null;
let imagenBase64 = null;

/* ===========================
   Inicialización
=========================== */
document.addEventListener("DOMContentLoaded", () => {
  initMap();

  // Botones / acciones
  document.getElementById("btnMiUbicacion")
    .addEventListener("click", getCurrentLocation);

  document.getElementById("btnCancelar")
    .addEventListener("click", cancelarFormulario);

  // Upload
  const inputImagen = document.getElementById("imagen");
  const btnRemovePreview = document.querySelector(".preview__remove");

  inputImagen.addEventListener("change", (e) => previewImage(e.target));
  btnRemovePreview.addEventListener("click", removeImage);

  // Submit
  document.getElementById("denunciaForm")
    .addEventListener("submit", handleSubmit);
});

/* ===========================
   Mapa (Leaflet)
=========================== */
function initMap() {
  const defaultLat = -34.6037;
  const defaultLng = -58.3816;

  map = L.map("map").setView([defaultLat, defaultLng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  map.on("click", function (e) {
    updateMarker(e.latlng.lat, e.latlng.lng);
    updateAddressFromCoords(e.latlng.lat, e.latlng.lng);
  });
}

function updateMarker(lat, lng) {
  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lng]).addTo(map);
  document.getElementById("latitud").value = lat;
  document.getElementById("longitud").value = lng;
}

function getCurrentLocation() {
  const statusElement = document.getElementById("locationStatus");
  statusElement.textContent = "Obteniendo ubicación...";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        userLocation = { lat, lng };
        map.setView([lat, lng], 16);
        updateMarker(lat, lng);
        updateAddressFromCoords(lat, lng);

        statusElement.textContent = "Ubicación obtenida";
        setTimeout(() => (statusElement.textContent = ""), 3000);
      },
      function (error) {
        console.error("Error obteniendo ubicación:", error);
        statusElement.textContent = "Error al obtener ubicación";
        setTimeout(() => (statusElement.textContent = ""), 3000);
      },
      { enableHighAccuracy: true }
    );
  } else {
    statusElement.textContent = "Geolocalización no disponible";
  }
}

function updateAddressFromCoords(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.display_name) {
        const address = data.address || {};
        const direccionCompleta = data.display_name;

        let direccionLegible = "";
        if (address.road && address.house_number) {
          direccionLegible = `${address.road} ${address.house_number}`;
        } else if (address.road) {
          direccionLegible = address.road;
        } else {
          direccionLegible = direccionCompleta.split(",")[0];
        }

        if (address.suburb || address.neighbourhood) {
          direccionLegible += `, ${address.suburb || address.neighbourhood}`;
        }

        document.getElementById("direccion").value = direccionLegible;

        // Autoselección de zona (heurística simple para CABA, puedes adaptar a tu comuna/ciudad)
        const zonaSelect = document.getElementById("zona");
        if (address.suburb) {
          const suburb = address.suburb.toLowerCase();
          if (suburb.includes("centro") || suburb.includes("microcentro")) {
            zonaSelect.value = "centro";
          } else if (suburb.includes("norte") || suburb.includes("palermo") || suburb.includes("belgrano")) {
            zonaSelect.value = "norte";
          } else if (suburb.includes("sur") || suburb.includes("boca") || suburb.includes("barracas")) {
            zonaSelect.value = "sur";
          } else if (suburb.includes("oeste") || suburb.includes("flores") || suburb.includes("caballito")) {
            zonaSelect.value = "oeste";
          } else if (suburb.includes("este") || suburb.includes("puerto madero")) {
            zonaSelect.value = "este";
          }
        }
      }
    })
    .catch((error) => {
      console.error("Error en geocoding:", error);
      const direcciones = [
        "Av. Corrientes " + Math.floor(Math.random() * 9000 + 1000),
        "Av. Santa Fe " + Math.floor(Math.random() * 9000 + 1000),
        "Av. Rivadavia " + Math.floor(Math.random() * 9000 + 1000),
        "Av. Cabildo " + Math.floor(Math.random() * 9000 + 1000),
      ];
      const direccionAleatoria = direcciones[Math.floor(Math.random() * direcciones.length)];
      document.getElementById("direccion").value = direccionAleatoria;
    });
}

/* ===========================
   Upload imagen
=========================== */
function previewImage(input) {
  const file = input.files[0];
  if (!file) {
    imagenBase64 = null;
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("El archivo es demasiado grande. Máximo 5MB.");
    input.value = "";
    imagenBase64 = null;
    return;
  }
  if (!file.type.startsWith("image/")) {
    alert("Por favor seleccione un archivo de imagen válido.");
    input.value = "";
    imagenBase64 = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const previewImg = document.getElementById("previewImg");
    previewImg.src = e.target.result;
    document.getElementById("imagePreview").classList.remove("preview--hidden");
    imagenBase64 = e.target.result;
  };
  reader.onerror = function () {
    console.error("Error al leer el archivo");
    alert("Error al cargar la imagen");
    imagenBase64 = null;
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  document.getElementById("imagen").value = "";
  document.getElementById("imagePreview").classList.add("preview--hidden");
  imagenBase64 = null;
}

/* ===========================
   Form helpers
=========================== */
function cancelarFormulario() {
  if (confirm("¿Está seguro de que desea cancelar? Se perderán todos los datos ingresados.")) {
    window.location.href = "seguimiento_personal.html";
  }
}

function generateReportId() {
  return Math.floor(Math.random() * 90000 + 10000);
}

function handleSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);
  const newReportId = generateReportId();
  const currentDate = new Date();

  const denunciaData = {
    id: newReportId,
    titulo: formData.get("titulo") || "",
    categoria: formData.get("categoria") || "",
    descripcion: formData.get("descripcion") || "",
    direccion: formData.get("direccion") || "",
    zona: formData.get("zona") || "",
    referencia: formData.get("referencia") || "",
    latitud: formData.get("latitud") || "",
    longitud: formData.get("longitud") || "",
    imagen: imagenBase64,
    fecha: currentDate.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }),
    fechaCreacion: currentDate.toISOString(),
    estado: "Pendiente",
    progreso: 10,
    observaciones: "El reporte está pendiente de asignación a un departamento específico.",
    likes: 0,
  };

  if (!denunciaData.titulo || !denunciaData.categoria || !denunciaData.descripcion || !denunciaData.direccion || !denunciaData.zona) {
    alert("Por favor complete todos los campos obligatorios.");
    return;
    }

  let reportes = JSON.parse(localStorage.getItem("misReportes") || "[]");
  reportes.unshift(denunciaData);

  try {
    localStorage.setItem("misReportes", JSON.stringify(reportes));
  } catch (error) {
    console.error("Error guardando en localStorage:", error);
    alert("Error guardando el reporte. La imagen podría ser muy grande.");
    return;
  }

  alert(`¡Denuncia enviada exitosamente!\nNúmero de reporte: #${newReportId}\n\nSerá redirigido a su panel de seguimiento.`);
  window.location.href = `seguimiento_personal.html?nuevo=${newReportId}`;
}
