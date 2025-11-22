"use strict";

/* ===============================
   Estado de filtros y base búsqueda
=================================*/
let currentFilters = { tipo: "todos", zona: "todos", estado: "todos" };

const searchDatabase = [
  { type:"problema",  value:"Bache en la calle principal",        category:"Problemas"  },
  { type:"problema",  value:"Falta de iluminación en el parque",  category:"Problemas"  },
  { type:"problema",  value:"Acumulación de basura en esquina",   category:"Problemas"  },
  { type:"problema",  value:"Graffiti en edificio histórico",     category:"Problemas"  },
  { type:"direccion", value:"Av. Libertador 1250",                category:"Direcciones"},
  { type:"direccion", value:"Av. Central 3420",                   category:"Direcciones"},
  { type:"direccion", value:"Parque San Martín",                  category:"Direcciones"},
  { type:"direccion", value:"Calle Histórica 789",                category:"Direcciones"},
  { type:"zona",      value:"Zona Centro",                        category:"Zonas"      },
  { type:"zona",      value:"Zona Norte",                         category:"Zonas"      },
  { type:"zona",      value:"Zona Sur",                           category:"Zonas"      },
  { type:"zona",      value:"Zona Este",                          category:"Zonas"      },
  { type:"zona",      value:"Zona Oeste",                         category:"Zonas"      },
  { type:"reporte",   value:"Reporte #12345",                     category:"Reportes"   },
  { type:"reporte",   value:"Reporte #67890",                     category:"Reportes"   },
  { type:"reporte",   value:"Reporte #11223",                     category:"Reportes"   },
  { type:"reporte",   value:"Reporte #44556",                     category:"Reportes"   },
  { type:"persona",   value:"Ana García",                         category:"Reportado por" },
  { type:"persona",   value:"Carlos López",                       category:"Reportado por" },
  { type:"persona",   value:"Sofía Martínez",                     category:"Reportado por" },
  { type:"persona",   value:"Miguel Torres",                      category:"Reportado por" },
];

/* ===============================
   Utilidades de UI
=================================*/
function updateSearchUI(term){
  const clearBtn = document.getElementById("clear-search");
  const counter  = document.getElementById("results-counter");
  const text     = document.getElementById("results-text");

  if (term && term.length){
    clearBtn?.classList.remove("is-hidden");
    const visible = Array.from(document.querySelectorAll("#reportes-grid .card"))
      .filter(c => c.style.display !== "none");
    counter?.classList.remove("is-hidden");
    if (text) text.textContent = `${visible.length} resultado(s) para "${term}"`;
  } else {
    clearBtn?.classList.add("is-hidden");
    counter?.classList.add("is-hidden");
  }
}

function showNoResultsMessage(count, term){
  let node = document.getElementById("no-results-message");
  if (count===0 && term && term.length){
    if (!node){
      node = document.createElement("div");
      node.id = "no-results-message";
      node.className = "nores";
      node.innerHTML = `
        <div class="nores__wrap">
          <span class="material-symbols-outlined nores__icon" aria-hidden="true">search_off</span>
          <h3 class="nores__title">No se encontraron resultados</h3>
          <p class="nores__text">Prueba otros términos o ajusta los filtros.</p>
        </div>`;
      document.getElementById("reportes-grid")?.appendChild(node);
    }
  } else if (node){
    node.remove();
  }
}

/* ===============================
   Sugerencias de búsqueda
=================================*/
function renderSearchSuggestions(searchTerm){
  const container = document.getElementById("search-suggestions");
  const content   = document.getElementById("suggestions-content");
  if (!container || !content) return;

  if (!searchTerm || searchTerm.length < 2){
    container.classList.add("is-hidden");
    return;
  }

  const filtered = searchDatabase.filter(i =>
    i.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!filtered.length){
    container.classList.add("is-hidden");
    return;
  }

  const groups = {};
  filtered.forEach(i => { (groups[i.category] ||= []).push(i); });

  let html = "";
  Object.keys(groups).forEach(cat => {
    html += `<div class="search__group">${cat}</div>`;
    groups[cat].forEach(item => {
      const re  = new RegExp(`(${searchTerm})`, "gi");
      const highlighted = item.value.replace(re, '<mark class="search__mark">$1</mark>');
      const icon = item.type==="problema"  ? "report_problem" :
                   item.type==="direccion" ? "location_on"   :
                   item.type==="reporte"   ? "receipt"       : "person";
      html += `
        <button class="search__suggestion" role="option" data-suggest="${item.value}">
          <span class="material-symbols-outlined search__suggestion-icon">${icon}</span>
          <span class="search__suggestion-text">${highlighted}</span>
        </button>`;
    });
  });

  content.innerHTML = html;
  container.classList.remove("is-hidden");
}

function selectSearchSuggestion(value){
  const input = document.getElementById("search-input");
  if (!input) return;
  input.value = value;
  document.getElementById("search-suggestions")?.classList.add("is-hidden");
  searchReports(value);
  updateSearchUI(value);
}

function clearSearch(){
  const input = document.getElementById("search-input");
  if (!input) return;
  input.value = "";
  document.getElementById("search-suggestions")?.classList.add("is-hidden");
  document.getElementById("clear-search")?.classList.add("is-hidden");
  document.getElementById("results-counter")?.classList.add("is-hidden");
  searchReports("");
}

/* ===============================
   Likes con persistencia
=================================*/
function toggleLike(btn){
  const id = btn.getAttribute("data-report-id") || "desconocido";
  const key = `liked_report_${id}`;

  const countEl = btn.querySelector(".like__count");
  let count = parseInt(countEl?.textContent || "0", 10);
  const liked = localStorage.getItem(key) === "true";

  if (!liked){
    btn.classList.add("like--active");
    if (countEl) countEl.textContent = String(count + 1);
    localStorage.setItem(key, "true");
    btn.setAttribute("aria-pressed","true");
  } else {
    btn.classList.remove("like--active");
    if (countEl) countEl.textContent = String(Math.max(count - 1, 0));
    localStorage.setItem(key, "false");
    btn.setAttribute("aria-pressed","false");
  }

  // Sincroniza data-likes para ordenar
  const card = btn.closest(".card");
  if (card && countEl){
    card.setAttribute("data-likes", countEl.textContent);
  }

  // Reordenar suavemente
  setTimeout(sortByLikes, 150);
}

function restoreLikes(){
  document.querySelectorAll(".like--btn").forEach(btn => {
    const id = btn.getAttribute("data-report-id");
    if (!id) return;
    const liked = localStorage.getItem(`liked_report_${id}`) === "true";
    if (liked){
      btn.classList.add("like--active");
      btn.setAttribute("aria-pressed","true");
    }
  });
}

function sortByLikes(){
  const grid = document.getElementById("reportes-grid");
  if (!grid) return;
  const cards = Array.from(grid.children);
  cards.sort((a,b) =>
    parseInt(b.dataset.likes||"0",10) - parseInt(a.dataset.likes||"0",10)
  );
  grid.innerHTML = "";
  cards.forEach(c => grid.appendChild(c));
}

/* ===============================
   Filtros
=================================*/
function openDropdown(id){
  ["tipo-dropdown","zona-dropdown","estado-dropdown"].forEach(x => {
    if (x !== id) document.getElementById(x)?.classList.remove("dropdown__menu--open");
  });
  document.getElementById(id)?.classList.toggle("dropdown__menu--open");
}

function applyFilters(){
  const cards = document.querySelectorAll("#reportes-grid .card");
  cards.forEach(card => {
    const okTipo   = currentFilters.tipo==="todos"   || card.dataset.tipo   === currentFilters.tipo;
    const okZona   = currentFilters.zona==="todos"   || card.dataset.zona   === currentFilters.zona;
    const okEstado = currentFilters.estado==="todos" || card.dataset.estado === currentFilters.estado;

    const show = (okTipo && okZona && okEstado);
    card.style.display = show ? "block" : "none";
    card.style.opacity = show ? "1" : "0";
  });
}

function setTipo(tipo){
  currentFilters.tipo = tipo;
  const label = document.getElementById("tipo-text");
  if (label){
    label.textContent =
      tipo==="todos" ? "Tipo de Problema" :
      tipo==="infraestructura" ? "Infraestructura" :
      tipo==="iluminacion" ? "Iluminación" :
      tipo==="basura" ? "Basura" : "Vandalismo";
  }
  document.getElementById("tipo-dropdown")?.classList.remove("dropdown__menu--open");
  applyFilters();
}

function setZona(zona){
  currentFilters.zona = zona;
  const label = document.getElementById("zona-text");
  if (label){
    label.textContent = zona==="todos" ? "Zona" : zona.charAt(0).toUpperCase()+zona.slice(1);
  }
  document.getElementById("zona-dropdown")?.classList.remove("dropdown__menu--open");
  applyFilters();
}

function setEstado(estado){
  currentFilters.estado = estado;
  const label = document.getElementById("estado-text");
  if (label){
    label.textContent =
      estado==="todos" ? "Estado" :
      estado==="recibida" ? "Recibida" :
      estado==="en-gestion" ? "En Gestión" : "Resuelta";
  }
  document.getElementById("estado-dropdown")?.classList.remove("dropdown__menu--open");
  applyFilters();
}

function clearAllFilters(){
  currentFilters = { tipo:"todos", zona:"todos", estado:"todos" };
  const t = document.getElementById("tipo-text");
  const z = document.getElementById("zona-text");
  const e = document.getElementById("estado-text");
  if (t) t.textContent = "Tipo de Problema";
  if (z) z.textContent = "Zona";
  if (e) e.textContent = "Estado";
  applyFilters();
}

/* ===============================
   Búsqueda (con filtros activos)
=================================*/
function searchReports(term){
  const cards = document.querySelectorAll("#reportes-grid .card");
  const t = (term||"").toLowerCase();
  let visibleCount = 0;

  cards.forEach(card => {
    const title  = (card.querySelector(".card__title")?.textContent||"").toLowerCase();
    const idtext = (card.querySelector(".card__id")?.textContent||"").toLowerCase();
    const addr   = (card.querySelector(".card__row .card__text")?.textContent||"").toLowerCase();
    const author = (card.querySelector(".card__author")?.textContent||"").toLowerCase();

    const match = !t || title.includes(t) || idtext.includes(t) || addr.includes(t) || author.includes(t);

    const okTipo   = currentFilters.tipo==="todos"   || card.dataset.tipo   === currentFilters.tipo;
    const okZona   = currentFilters.zona==="todos"   || card.dataset.zona   === currentFilters.zona;
    const okEstado = currentFilters.estado==="todos" || card.dataset.estado === currentFilters.estado;

    if (match && okTipo && okZona && okEstado){
      card.style.display = "block";
      card.style.opacity = "1";
      card.style.boxShadow  = t ? "0 0 0 2px #13a4ec40" : "";
      card.style.borderColor= t ? "#13a4ec" : "";
      visibleCount++;
    } else {
      card.style.display = "none";
      card.style.opacity = "0";
      card.style.boxShadow  = "";
      card.style.borderColor= "";
    }
  });

  updateSearchUI(term);
  showNoResultsMessage(visibleCount, term);
}

/* ===============================
   Eventos
=================================*/
document.addEventListener("DOMContentLoaded", () => {
  // Restaurar likes
  restoreLikes();

  // Orden inicial por likes
  sortByLikes();

  // Listeners: dropdown toggles
  document.addEventListener("click", (ev) => {
    // Cerrar dropdowns si clic fuera
    const dropArea = ev.target.closest(".dropdown");
    if (!dropArea){
      ["tipo-dropdown","zona-dropdown","estado-dropdown"].forEach(id => {
        document.getElementById(id)?.classList.remove("dropdown__menu--open");
      });
    }

    // Toggle dropdown
    const toggle = ev.target.closest("[data-toggle]");
    if (toggle){
      const which = toggle.getAttribute("data-toggle");
      if (which === "tipo")   openDropdown("tipo-dropdown");
      if (which === "zona")   openDropdown("zona-dropdown");
      if (which === "estado") openDropdown("estado-dropdown");
    }

    // Selecciones de filtros
    const tipoBtn = ev.target.closest("[data-filter-tipo]");
    if (tipoBtn) setTipo(tipoBtn.getAttribute("data-filter-tipo"));

    const zonaBtn = ev.target.closest("[data-filter-zona]");
    if (zonaBtn) setZona(zonaBtn.getAttribute("data-filter-zona"));

    const estadoBtn = ev.target.closest("[data-filter-estado]");
    if (estadoBtn) setEstado(estadoBtn.getAttribute("data-filter-estado"));

    // Limpiar filtros
    if (ev.target.closest("#filters-clear")) clearAllFilters();

    // Cerrar sugerencias si clic fuera
    if (!ev.target.closest("#search-input, #search-suggestions")){
      document.getElementById("search-suggestions")?.classList.add("is-hidden");
    }

    // Like buttons
    const likeBtn = ev.target.closest(".like--btn");
    if (likeBtn) toggleLike(likeBtn);

    // Click sugerencia
    const sug = ev.target.closest("[data-suggest]");
    if (sug) selectSearchSuggestion(sug.getAttribute("data-suggest"));
  });

  // Búsqueda con debounce + sugerencias
  const input = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search");
  let tmt;
  if (input){
    input.addEventListener("input", function(){
      const val = this.value;
      clearTimeout(tmt);
      if (val.length >= 2){
        renderSearchSuggestions(val);
      } else {
        document.getElementById("search-suggestions")?.classList.add("is-hidden");
      }
      tmt = setTimeout(() => searchReports(val), 280);
    });
    input.addEventListener("focus", function(){
      if (this.value.length >= 2) renderSearchSuggestions(this.value);
    });
  }
  clearBtn?.addEventListener("click", clearSearch);
});
