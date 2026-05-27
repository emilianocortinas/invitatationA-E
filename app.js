const targetUrl =
  "https://anethyemiliano.my.canva.site/copia-de-a-e";

const loader = document.getElementById("loader");
const inviteCard = document.getElementById("inviteCard");

let canNavigate = false;

/* =========================
   PRECONECTAR CANVA
========================= */

const preconnect = document.createElement("link");
preconnect.rel = "preconnect";
preconnect.href = "https://anethyemiliano.my.canva.site";

document.head.appendChild(preconnect);

/* =========================
   PRECARGAR DESTINO
========================= */

const iframe = document.createElement("iframe");

iframe.style.display = "none";
iframe.src = targetUrl;
iframe.loading = "eager";

document.body.appendChild(iframe);

/* =========================
   PRECARGAR IMAGENES
========================= */

const preloadImages = [
  "img/A&E0001.png",
  "img/A&E0001.mobile.png",
  "img/A&E0002.svg",
  "img/loader.svg"
];

Promise.all(
  preloadImages.map(src => {
    return new Promise(resolve => {
      const img = new Image();

      img.src = src;

      img.onload = resolve;
      img.onerror = resolve;
    });
  })
);

/* =========================
   CARGAR INVITADO
========================= */

async function loadGuest() {

  const guestNameEl = document.getElementById("guestName");
  const guestCountEl = document.getElementById("guestCount");

  const params = new URLSearchParams(window.location.search);

  const sqids = new Sqids({
    minLength: 8,
    alphabet: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  });

  const code = params.get("i");

  if (!code) {

    guestNameEl.textContent = "Invitado";
    guestCountEl.textContent = "1";

    finishLoading();
    return;
  }

  const decoded = sqids.decode(code);

  if (!decoded.length) {

    guestNameEl.textContent = "Invitado";
    guestCountEl.textContent = "1";

    finishLoading();
    return;
  }

  const id = decoded[0].toString();

  try {

    const response = await fetch("data/invitados.json");

    if (!response.ok) {
      throw new Error("No se pudo cargar invitados.json");
    }

    const invitados = await response.json();

    const invitado = invitados[id];

    if (!invitado) {

      guestNameEl.textContent = "Invitado";
      guestCountEl.textContent = "1";

      finishLoading();
      return;
    }

    guestNameEl.textContent = invitado.nombre || "Invitado";
    guestCountEl.textContent = invitado.pases || "1";

    finishLoading();

  } catch (error) {

    console.error(error);

    guestNameEl.textContent = "Invitado";
    guestCountEl.textContent = "1";

    finishLoading();
  }
}

/* =========================
   TERMINAR CARGA
========================= */

function finishLoading() {

  setTimeout(() => {

    loader.classList.add("hide");

    canNavigate = true;

  }, 2200);
}

/* =========================
   CLICK PREMIUM
========================= */

inviteCard.addEventListener("click", () => {

  if (!canNavigate) return;

  document.body.style.opacity = "0";
  document.body.style.filter = "blur(12px)";

  setTimeout(() => {

    window.location.replace(targetUrl);

  }, 700);
});

/* =========================
   START
========================= */

window.addEventListener("load", () => {

  loadGuest();
});