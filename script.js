(() => {
  'use strict';
  const config = window.LUNA_CONFIG || {};
  const el = (id) => document.getElementById(id);
  const setText = (id, text) => { if (el(id)) el(id).textContent = text; };
  const validWebUrl = (value) => {
    try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; }
    catch { return ''; }
  };

  // Fecha y hora: el navegador muestra la fecha de acuerdo con hora CDMX.
  const eventDate = config.dateTime ? new Date(config.dateTime) : null;
  const validDate = eventDate instanceof Date && !Number.isNaN(eventDate.getTime());
  if (validDate) {
    const loc = 'es-MX';
    const zone = 'America/Mexico_City';
    setText('event-date', new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: zone }).format(eventDate));
    setText('event-time', new Intl.DateTimeFormat(loc, { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: zone }).format(eventDate));
  }
  if (typeof config.venueName === 'string' && config.venueName.trim()) {
    setText('event-venue', config.venueName.trim());
  }
  if (typeof config.venueAddress === 'string' && config.venueAddress.trim()) {
    setText('event-address', config.venueAddress.trim());
  }

  const maps = validWebUrl(config.mapsUrl || '');
  if (maps) {
    const link = el('maps-link');
    link.href = maps;
    link.hidden = false;
    el('maps-pending').hidden = true;
  }

  // Cuenta regresiva real. Se oculta cuando aún no se conoce la fecha.
  function updateCountdown() {
    if (!validDate) return;
    const delta = Math.max(0, eventDate.getTime() - Date.now());
    if (delta === 0) {
      ['days','hours','minutes','seconds'].forEach((id) => setText(id, '00'));
      setText('countdown-caption', '¡El gran día ha llegado!');
      return;
    }
    const s = Math.floor(delta / 1000);
    setText('days', String(Math.floor(s / 86400)).padStart(2, '0'));
    setText('hours', String(Math.floor((s % 86400) / 3600)).padStart(2, '0'));
    setText('minutes', String(Math.floor((s % 3600) / 60)).padStart(2, '0'));
    setText('seconds', String(s % 60).padStart(2, '0'));
    setText('countdown-caption', 'Cada segundo nos acerca un poquito más a la magia.');
  }
  updateCountdown();
  if (validDate) window.setInterval(updateCountdown, 1000);

  // WhatsApp: no enlazar ni mostrar el botón hasta configurar un número válido.
  const phone = String(config.rsvpPhone || '').replace(/\D/g, '');
  if (phone.length >= 10 && phone.length <= 15) {
    const link = el('rsvp-link');
    const message = typeof config.rsvpMessage === 'string' ? config.rsvpMessage : 'Hola, quiero confirmar mi asistencia.';
    link.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    link.hidden = false;
    el('rsvp-pending').hidden = true;
  }

  // Código de vestimenta: sección opcional.
  if (typeof config.dressCode === 'string' && config.dressCode.trim()) {
    setText('dress-copy', config.dressCode.trim());
    el('vestimenta').hidden = false;
  }

  // Inspiración de vestimenta: el enlace no impone ningún código específico.
  const dressUrl = validWebUrl(config.dressCodeUrl || '');
  if (dressUrl) {
    el('vestimenta').hidden = false;
    const dressLink = el('dress-link');
    if (dressLink) { dressLink.href = dressUrl; dressLink.hidden = false; }
  }

  // Mesas de regalo: enlaces proporcionados por la familia, sin listado de productos.
  [
    ['gift-amazon', config.amazonRegistryUrl],
    ['gift-liverpool', config.liverpoolRegistryUrl]
  ].forEach(([id, url]) => {
    const link = el(id);
    const safeUrl = validWebUrl(url || '');
    if (link && safeUrl) { link.href = safeUrl; link.hidden = false; }
  });

  // Fecha límite RSVP en la fecha local de México, sin conversión de zona horaria.
  const deadline = String(config.rsvpDeadline || '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    const [year, month, day] = deadline.split('-').map(Number);
    const localDate = new Date(year, month - 1, day, 12);
    if (localDate.getFullYear() === year && localDate.getMonth() === month - 1 && localDate.getDate() === day) {
      const formatted = new Intl.DateTimeFormat('es-MX', {day:'numeric',month:'long',year:'numeric'}).format(localDate);
      setText('rsvp-deadline', 'Confirma tu asistencia a más tardar el ' + formatted + '.');
      if (el('rsvp-deadline')) el('rsvp-deadline').hidden = false;
    }
  }

  // Animaciones suaves, respetando accesibilidad y preferencia de movimiento reducido.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealNodes = document.querySelectorAll('.reveal');
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    revealNodes.forEach(node => node.classList.add('reveal--ready'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealNodes.forEach(node => observer.observe(node));
  }

  // Pequeño efecto de pétalos al entrar. Se ejecuta sólo tras una interacción real.
  const enter = document.querySelector('.cover-enter');
  const layer = document.querySelector('.petal-layer');
  enter?.addEventListener('click', () => {
    if (prefersReducedMotion || !layer) return;
    for (let i = 0; i < 11; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.setProperty('--left', `${15 + Math.random() * 70}%`);
      petal.style.setProperty('--delay', `${Math.random() * 0.5}s`);
      petal.style.setProperty('--drift', `${Math.round(Math.random() * 180 - 90)}px`);
      layer.appendChild(petal);
      petal.addEventListener('animationend', () => petal.remove(), {once: true});
    }
  });
})();
