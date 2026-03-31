async function loadGuest() {
  const guestNameEl = document.getElementById("guestName");
  const guestCountEl = document.getElementById("guestCount");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    guestNameEl.textContent = "Invitado";
    guestCountEl.textContent = "1";
    return;
  }

  try {
    const response = await fetch("data/invitados.json");
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
    console.error("Error cargando invitados:", error);
    guestNameEl.textContent = "Invitado";
    guestCountEl.textContent = "1";
  }
}

loadGuest();