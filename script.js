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


  // Polvos mágicos de la portada: una lluvia delicada al cargar
  // y un pequeño destello cuando se toca "Descubre la magia".
  // CSS animations + elementos efímeros: sin dependencias ni imágenes extra.
  const dustLayer = document.getElementById('magic-dust');
  const coverImage = document.querySelector('.cover-art img');
  const magicColors = [
    ['#efd197', 'rgba(232,179,91,.48)'],
    ['#f2aecb', 'rgba(234,139,177,.42)'],
    ['#cdb5ed', 'rgba(178,146,228,.45)'],
    ['#f7e9c4', 'rgba(242,204,135,.35)']
  ];
  let introPlayed = false;
  const addMagicDust = (count, burst = false) => {
    if (prefersReducedMotion || !dustLayer) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      const color = magicColors[Math.floor(Math.random() * magicColors.length)];
      const x = burst ? 43 + Math.random() * 14 : 22 + Math.random() * 56;
      const y = burst ? 86 + Math.random() * 5 : 37 + Math.random() * 42;
      p.className = 'magic-dust__particle' + (Math.random() > 0.72 ? ' magic-dust__particle--star' : '');
      p.style.setProperty('--x', x.toFixed(1) + '%');
      p.style.setProperty('--y', y.toFixed(1) + '%');
      p.style.setProperty('--dx', Math.round((Math.random() - .5) * (burst ? 175 : 85)) + 'px');
      p.style.setProperty('--dy', Math.round((burst ? -65 : -40) - Math.random() * (burst ? 90 : 95)) + 'px');
      p.style.setProperty('--size', (2 + Math.random() * (burst ? 5 : 4)).toFixed(1) + 'px');
      p.style.setProperty('--delay', (burst ? 0 : Math.random() * .65).toFixed(2) + 's');
      p.style.setProperty('--duration', (1.3 + Math.random() * 1.15).toFixed(2) + 's');
      p.style.setProperty('--tone', color[0]);
      p.style.setProperty('--glow', color[1]);
      dustLayer.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }
  };
  const playOpeningMagic = () => {
    if (introPlayed || prefersReducedMotion) return;
    introPlayed = true;
    addMagicDust(26);
  };
  if (coverImage?.complete && coverImage.naturalWidth > 0) {
    window.requestAnimationFrame(playOpeningMagic);
  } else if (coverImage) {
    coverImage.addEventListener('load', playOpeningMagic, { once: true });
  } else {
    window.addEventListener('load', playOpeningMagic, { once: true });
  }
  document.querySelectorAll('.cover-enter, .cover-scroll').forEach(trigger => {
    trigger.addEventListener('click', event => {
      if (prefersReducedMotion || !dustLayer) return;
      event.preventDefault();
      addMagicDust(24, true);
      // Permite ver el destello antes de entrar, sin bloquear el scroll.
      window.setTimeout(() => {
        document.querySelector('#bienvenida')?.scrollIntoView({behavior:'smooth',block:'start'});
        if (history.replaceState) history.replaceState(null, '', '#bienvenida');
      }, 420);
    });
  });
})();
