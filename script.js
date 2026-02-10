const chisteDiv = document.getElementById("chiste");
const boton = document.getElementById("nuevo");
const selector = document.getElementById("categoria");

/* =========================
   ESTADO PRINCIPAL
========================= */

let chistes = [];
let cola = [];
let indice = 0;
let vistos = [];

let categoriaActual = localStorage.getItem("categoria") || "cortos";
selector.value = categoriaActual;

/* =========================
   UTILIDADES
========================= */

// Mezclar array (Fisher-Yates)
function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* =========================
   LOCAL STORAGE (POR CATEGORÍA)
========================= */

function guardarProgreso() {
  localStorage.setItem(`cola_${categoriaActual}`, JSON.stringify(cola));
  localStorage.setItem(`indice_${categoriaActual}`, indice);
  localStorage.setItem(`vistos_${categoriaActual}`, JSON.stringify(vistos));
  localStorage.setItem("categoria", categoriaActual);
}

function cargarProgreso() {
  const colaGuardada = localStorage.getItem(`cola_${categoriaActual}`);
  const indiceGuardado = localStorage.getItem(`indice_${categoriaActual}`);
  const vistosGuardados = localStorage.getItem(`vistos_${categoriaActual}`);

  if (colaGuardada && indiceGuardado && vistosGuardados) {
    cola = JSON.parse(colaGuardada);
    indice = parseInt(indiceGuardado, 10);
    vistos = JSON.parse(vistosGuardados);
    return true;
  }
  return false;
}

/* =========================
   COLA DE CHISTES
========================= */

function iniciarCola() {
  cola = mezclar([...chistes]);
  indice = 0;
  vistos = [];
  guardarProgreso();
}

/* =========================
   MOSTRAR CHISTE
========================= */

function mostrarSiguiente() {
  if (!cola.length) return;

  if (indice >= cola.length) {
    iniciarCola();
  }

  chisteDiv.classList.remove("ya-visto");
  chisteDiv.textContent = cola[indice];

  if (!vistos.includes(indice)) {
    vistos.push(indice);
  }

  chisteDiv.classList.add("ya-visto");

  indice++;
  guardarProgreso();
}

/* =========================
   CARGAR JSON
========================= */

async function cargarChistes() {
  try {
    const respuesta = await fetch(`${categoriaActual}.json`);
    chistes = await respuesta.json();

    if (!Array.isArray(chistes) || chistes.length === 0) {
      chisteDiv.textContent = "No hay chistes aún 😅";
      return;
    }

    // Cargar progreso SOLO de esta categoría
    if (!cargarProgreso()) {
      iniciarCola();
    }

    mostrarSiguiente();
  } catch (error) {
    chisteDiv.textContent = "Error cargando chistes ❌";
    console.error(error);
  }
}

/* =========================
   EVENTOS
========================= */

boton.addEventListener("click", mostrarSiguiente);

selector.addEventListener("change", () => {
  categoriaActual = selector.value;
  cargarChistes();
});

/* =========================
   INIT
========================= */

cargarChistes();
