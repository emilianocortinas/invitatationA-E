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
    return;
  }

  const decoded = sqids.decode(code);

  if (!decoded.length) {
    guestNameEl.textContent = "Invitado";
    guestCountEl.textContent = "1";
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
      return;
    }

    guestNameEl.textContent = invitado.nombre || "Invitado";
    guestCountEl.textContent = invitado.pases || "1";

  } catch (error) {
    console.error("Error cargando invitado:", error);

    guestNameEl.textContent = "Invitado";
    guestCountEl.textContent = "1";
  }
}

loadGuest();