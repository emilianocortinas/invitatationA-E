

const loader = document.getElementById("loader");
const inviteCard = document.getElementById("inviteCard");

let canNavigate = false;

/* =========================
   PRECARGAR IMAGENES
========================= */

const preloadImages = [
  "img/A&E0001.png",
  "img/A&E0001.mobile.png",
  "img/A&E0002.svg",
  "img/loader.svg",
  "img/A&E0002.details.png"
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

const detailPage = document.getElementById("detailPage");

inviteCard.addEventListener("click", () => {

  if (!canNavigate) return;

  /* fade portada */

  document.querySelector(".page").style.opacity = "0";

  setTimeout(() => {

    document.querySelector(".page").remove();

    detailPage.classList.add("show");

  }, 700);
});

/* =========================
   START
========================= */

window.addEventListener("load", () => {

  loadGuest();
});