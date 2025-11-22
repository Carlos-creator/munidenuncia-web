"use strict";

/**
 * Control de likes para cards destacadas en página de inicio.
 * - Usa data-report-id en cada botón .like--btn
 * - Persiste el estado por reporte en localStorage: liked_report_{id}
 * - Toggle: permite apoyar y deshacer apoyo
 * - Actualiza contador, aria-pressed y clase visual like--active
 */

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".like--btn");

  // Restaurar estado visual desde localStorage
  buttons.forEach((btn) => {
    const id = getId(btn);
    const key = storageKey(id);
    const liked = localStorage.getItem(key) === "true";
    setButtonState(btn, liked);
  });

  // Listeners
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => handleToggle(btn));
  });
});

function handleToggle(button) {
  const id = getId(button);
  const key = storageKey(id);
  const countSpan = button.querySelector(".like__count");
  const current = parseInt(countSpan.textContent, 10) || 0;
  const liked = button.getAttribute("aria-pressed") === "true";

  if (liked) {
    // Quitar apoyo
    const newCount = Math.max(0, current - 1);
    countSpan.textContent = String(newCount);
    setButtonState(button, false);
    localStorage.setItem(key, "false");
  } else {
    // Dar apoyo
    const newCount = current + 1;
    countSpan.textContent = String(newCount);
    setButtonState(button, true);
    localStorage.setItem(key, "true");

    // micro-animación
    button.style.transform = "scale(1.08)";
    setTimeout(() => (button.style.transform = "scale(1)"), 150);
  }
}

/* ===== Helpers ===== */
function getId(button) {
  return button.getAttribute("data-report-id") || "desconocido";
}
function storageKey(id) {
  return `liked_report_${id}`;
}
function setButtonState(button, isLiked) {
  button.setAttribute("aria-pressed", isLiked ? "true" : "false");
  button.classList.toggle("like--active", isLiked);

  // (Opcional) variar icono con font-variation si usas Material Symbols
  // aquí mantenemos el emoji 👍 simple.
}
