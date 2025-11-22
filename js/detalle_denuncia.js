"use strict";

/**
 * Control de “likes” con persistencia en localStorage.
 * - Identifica el reporte por ?id=... en la URL o por el número en el título (Reporte #12345) o data-report-id.
 * - Evita múltiples likes del mismo usuario (toggle: permite quitar el apoyo).
 * - Actualiza contador y estado visual del botón.
 */

document.addEventListener("DOMContentLoaded", () => {
  const likeBtn     = document.getElementById("likeBtn");
  const likesCount  = document.getElementById("likesCount");
  const tituloH1    = document.getElementById("tituloReporte");

  const reportId = getReportId(tituloH1);
  const storeKeyLikes = `likes_${reportId}`;
  const storeKeyUser  = `likedByUser_${reportId}`;

  // Inicializar contador desde localStorage si existe
  const storedLikes = readNumber(storeKeyLikes, parseInt(likesCount.textContent || "0", 10));
  setCount(storedLikes);

  // Estado de usuario (si ya apoyó)
  const userLiked = readBool(storeKeyUser, false);
  setButtonState(userLiked);

  likeBtn.addEventListener("click", () => {
    const currentlyLiked = likeBtn.getAttribute("aria-pressed") === "true";
    const currentCount   = parseInt(likesCount.textContent || "0", 10);

    if (currentlyLiked) {
      // Quitar apoyo
      const newCount = Math.max(0, currentCount - 1);
      setCount(newCount);
      setButtonState(false);
      persist(newCount, false);
    } else {
      // Dar apoyo
      const newCount = currentCount + 1;
      setCount(newCount);
      setButtonState(true);
      persist(newCount, true);
    }

    // (Opcional) si usas “misReportes” en localStorage, también reflejar el cambio ahí:
    syncWithMisReportes(reportId, parseInt(likesCount.textContent || "0", 10));
  });

  /* ===== Helpers ===== */

  function getReportId(h1El) {
    // 1) URL ?id=12345
    const urlId = new URLSearchParams(window.location.search).get("id");
    if (urlId) return urlId;

    // 2) data-report-id en el H1
    const dataId = h1El?.dataset?.reportId;
    if (dataId) return dataId;

    // 3) Parsear “Reporte #12345” del texto del H1
    const text = (h1El?.textContent || "").trim();
    const match = text.match(/#(\d+)/);
    if (match) return match[1];

    // 4) Fallback
    return "desconocido";
  }

  function readNumber(key, fallback = 0) {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : fallback;
  }

  function readBool(key, fallback = false) {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === "true";
  }

  function setCount(n) {
    likesCount.textContent = String(n);
    localStorage.setItem(storeKeyLikes, String(n));
  }

  function setButtonState(liked) {
    likeBtn.setAttribute("aria-pressed", liked ? "true" : "false");
    likeBtn.classList.toggle("button--liked", liked);
    likeBtn.querySelector(".button__icon")?.classList.toggle("is-active", liked);
    likeBtn.innerHTML = liked
      ? `<span class="material-symbols-outlined button__icon">thumb_up</span> Quitar Apoyo`
      : `<span class="material-symbols-outlined button__icon">thumb_up</span> Apoyar Reporte`;
  }

  function persist(count, liked) {
    localStorage.setItem(storeKeyLikes, String(count));
    localStorage.setItem(storeKeyUser, liked ? "true" : "false");
  }

  function syncWithMisReportes(id, newLikes) {
    try {
      const raw = localStorage.getItem("misReportes");
      if (!raw) return;
      const arr = JSON.parse(raw);
      const idx = arr.findIndex((r) => String(r.id) === String(id));
      if (idx >= 0) {
        arr[idx].likes = newLikes;
        localStorage.setItem("misReportes", JSON.stringify(arr));
      }
    } catch (e) {
      // silenciar si no existe o no es JSON válido
    }
  }
});
