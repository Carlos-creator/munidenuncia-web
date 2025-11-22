"use strict";

/* ================== Helpers ================== */
function getZonaNombre(zona) {
  const zonas = {
    centro: "Zona Centro",
    norte: "Zona Norte",
    sur:   "Zona Sur",
    este:  "Zona Este",
    oeste: "Zona Oeste",
  };
  return zonas[zona] || ("Zona " + (zona ?? ""));
}

/** Devuelve un modificador de estado para la tarjeta */
function getStatusModifier(estado, progreso){
  if (estado === "Resuelto" || progreso === 100) return "is-done";
  if (estado === "En Revisión" || progreso >= 50) return "is-review";
  return "is-pending";
}

/* ============== Plantilla de tarjeta BEM ============== */
function crearTarjetaReporte(reporte, esNuevo = false){
  const statusMod = getStatusModifier(reporte.estado, reporte.progreso);
  const zonaNombre = getZonaNombre(reporte.zona);

  // imagen: base64 -> <img>, url -> background
  let mediaHTML = "";
  if (reporte.imagen) {
    if (typeof reporte.imagen === "string" && reporte.imagen.startsWith("data:image/")) {
      mediaHTML = `<img class="report-card__media-img" src="${reporte.imagen}" alt="Imagen del reporte" onerror="console.log('Error cargando imagen base64')"/>`;
    } else if (typeof reporte.imagen === "string" && reporte.imagen.startsWith("http")) {
      mediaHTML = `<div class="report-card__media-bg" style="--img:url('${reporte.imagen}')"></div>`;
    }
  }
  if (!mediaHTML) {
    mediaHTML = `
      <div class="report-card__media-fallback">
        <span class="report-card__media-fallback-text">Sin Imagen</span>
      </div>`;
  }

  // Nota: no usamos onclick inline; delegación de eventos por clase y data-id
  return `
  <article class="report-card ${statusMod}" data-id="${reporte.id}">
    <div class="report-card__media">
      ${mediaHTML}
      ${esNuevo ? `
      <button class="chip chip--danger report-card__delete" title="Eliminar reporte" data-action="delete" data-id="${reporte.id}">
        <svg class="chip__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        Eliminar
      </button>` : ``}
    </div>

    <div class="report-card__body">
      <div class="report-card__head">
        <p class="report-card__id">Reporte #${reporte.id}</p>
        <div class="report-card__meta">
          <span class="badge">${reporte.estado}</span>
          <div class="likes">
            <span class="likes__icon" aria-hidden="true">👍</span>
            <span class="likes__count">${reporte.likes || 0}</span>
          </div>
        </div>
      </div>

      <h3 class="report-card__title">${reporte.titulo}</h3>

      <div class="report-card__row">
        <span class="report-card__pin" aria-hidden="true">📍</span>
        <p class="report-card__text">${reporte.direccion}</p>
      </div>

      <div class="report-card__row">
        <span class="report-card__map" aria-hidden="true">🗺️</span>
        <span class="report-card__zone">${zonaNombre}</span>
      </div>

      <p class="report-card__date">Creado: ${reporte.fecha}</p>

      <div class="progress">
        <div class="progress__bar" style="width:${reporte.progreso}%"></div>
        <span class="progress__label">${reporte.progreso}%</span>
      </div>

      <div class="note">
        <p class="note__text"><span class="note__strong">Observaciones:</span> ${reporte.observaciones}</p>
      </div>
    </div>
  </article>`;
}

/* ============== Carga / Render ============== */
function cargarReportes(){
  const reportesGuardados = JSON.parse(localStorage.getItem("misReportes") || "[]");

  const reportesEstaticos = [
    {
      id: 12345,
      titulo: "Falta de Iluminación en Calle Principal",
      direccion: "Av. Libertador 1250, entre Mitre y San Martín",
      zona: "sur",
      fecha: "15 de Julio, 2024",
      estado: "En Revisión",
      progreso: 60,
      observaciones: "El reporte está en proceso de revisión por el departamento de obras públicas.",
      likes: 24,
      imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXXT1T1-VKJ2f74L-MAxKLcRKxOmE91kpVkfK_QqEnNUGeKF_tWvlCwCC1Cm6nmfAL5SsBQV8ImDGknNb05aBmxamqqtbq9FBA_Hdu8ZlsImI7Q3Lq1m0CsguNb2sJNhldYt_yzKDOVc9Pw0PKqqXrvZ1sAukGAn2Jg_mybeHVisv3uwbs7EbkOo-tpFQw7CsK2JS3iy-vn0UcIJdDQzL83C7bvj3k3KKCLs5uOmbKzzwGMnc2WZiT3-RqDcQBqTtttjfkE7t72mVF"
    },
    {
      id: 67890,
      titulo: "Baches en Avenida Central",
      direccion: "Av. Central 3420, altura puente vehicular",
      zona: "norte",
      fecha: "20 de Junio, 2024",
      estado: "Resuelto",
      progreso: 100,
      observaciones: "El reporte ha sido resuelto y cerrado. Se recomienda verificar la solución en el lugar.",
      likes: 18,
      imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjvx5e6dMxi1jFcu7D8TTNmBoOyEoIgKdqJzJcOoyLERYu1-UianSfw6zYpRVB2-0PeWrwaX6vJypnlXyIsjE1vZt4flKPouCcwZ42iFmVZiuy3oXhvTHIkoIpEn-Jch7h_dFgRf43ghqIseOiPUmByE2X3kmx9vJsuVAwKXKMUAqnDcb3E8d93z8OCTISBC7d1X9g5ycNL4CbQXh4YeTzu8TgzEQPOK7Ddpx0wZyoZ-W6zCcav3ZffYnBtVD6CwZ0FQQV9YAaX5DM"
    },
    {
      id: 11223,
      titulo: "Acumulación de Basura en Parque",
      direccion: "Parque San Martín, sector juegos infantiles",
      zona: "centro",
      fecha: "5 de Mayo, 2024",
      estado: "Pendiente",
      progreso: 20,
      observaciones: "El reporte está pendiente de asignación a un departamento específico.",
      likes: 31,
      imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ52lzDw7GqGuVu1shcqrLfFesqYsKBGwOfsFV1-OtFaZ4RgqfUbeR2ugs_71wVSnttinthA7oU-KZB5ieSwY98MDu-wMhg7A2SHupppNn0Ej7QMUbJ5iSdjpn6F-e6rbUKtWpsAIYue_LO73Pi9VH61jPs5MlshZly94IuGVnFyfemCmIpsTDXymdsWmiVRadjMHWGFfvtNile6D0CnNrwDaRWwe7uPnpuoiajr5mcdDTCucgKPZxpBDtHbHzpZGrU0fgmGTblUIK"
    }
  ];

  const todosLosReportes = [...reportesGuardados, ...reportesEstaticos];

  const container = document.getElementById("reportes-container");
  const noReportesMsg = document.getElementById("no-reportes");

  if (!todosLosReportes.length){
    container.innerHTML = "";
    noReportesMsg.classList.remove("empty-state--hidden");
    return;
  }

  noReportesMsg.classList.add("empty-state--hidden");

  const htmlGuardados = reportesGuardados.map(r => crearTarjetaReporte(r, true)).join("");
  const htmlEstaticos = reportesEstaticos.map(r => crearTarjetaReporte(r, false)).join("");
  container.innerHTML = htmlGuardados + htmlEstaticos;

  // destacar nuevo si viene ?nuevo=ID
  const urlParams = new URLSearchParams(window.location.search);
  const nuevoReporteId = urlParams.get("nuevo");
  if (nuevoReporteId){
    setTimeout(() => {
      const card = container.querySelector(`[data-id="${nuevoReporteId}"]`);
      if (card){
        card.scrollIntoView({ behavior:"smooth", block:"center" });
        card.classList.add("report-card--highlight");
        setTimeout(()=> card.classList.remove("report-card--highlight"), 3000);
      }
    }, 400);
  }
}

/* ============== Eliminar (delegación) ============== */
function eliminarReporte(reporteId){
  if (!confirm("¿Está seguro de que desea eliminar este reporte? Esta acción no se puede deshacer.")) return;
  let reportes = JSON.parse(localStorage.getItem("misReportes") || "[]");
  reportes = reportes.filter(r => String(r.id) !== String(reporteId));
  localStorage.setItem("misReportes", JSON.stringify(reportes));
  cargarReportes();
  setTimeout(()=> alert("El reporte ha sido eliminado exitosamente."), 100);
}

/* ================== Init ================== */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("reportes-container");

  cargarReportes();

  // Delegación para botón eliminar
  container.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-action='delete']");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    if (!id) return;
    eliminarReporte(id);
  });

  // Si venimos con ?nuevo=123, mostrar toast y limpiar URL
  const urlParams = new URLSearchParams(window.location.search);
  const nuevoReporteId = urlParams.get("nuevo");
  if (nuevoReporteId){
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
    setTimeout(() => {
      alert("¡Su denuncia ha sido registrada exitosamente!\n\n" +
            `Número de seguimiento: #${nuevoReporteId}\n` +
            "Puede ver el progreso de su reporte en esta página.");
    }, 800);
  }
});
