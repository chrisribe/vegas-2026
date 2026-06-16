// Single source of truth for the nav — edit here, applies everywhere
(function () {
  var links = [
    { href: 'index.html',      label: '🏠 Home' },
    { href: 'cheap-eats.html', label: '🍽️ Cheap Eats' },
    { href: 'buffets.html',    label: '🦞 Buffets' },
    { href: 'off-strip.html',  label: '🏙️ Off-Strip' },
    { href: 'tournament.html', label: '🎱 Tournament' },
    { href: 'transport.html',  label: '🚇 Transport' },
    { href: 'tips.html',       label: '💡 Tips' },
    { href: 'map.html',        label: '🗺️ Map' },
  ];

  var current = window.location.pathname.split('/').pop() || 'index.html';

  var nav = document.getElementById('main-nav');
  if (!nav) return;

  nav.innerHTML = links.map(function (l) {
    return '<a href="' + l.href + '"' + (current === l.href ? ' class="active"' : '') + '>' + l.label + '</a>';
  }).join('\n');

  // Declare wrap early so centerActive can reference it
  var wrap = nav.parentElement;

  // ── Active link centring ──────────────────────────────────────────────────
  // scrollIntoView is far more reliable than manual offsetLeft math because
  // it doesn't depend on font-load timing. We fire it twice:
  //   1. immediately (works when fonts are cached / already loaded)
  //   2. on window 'load' (catches the first visit when DM Sans is still fetching)
  var activeLink = nav.querySelector('a.active');

  function centerActive() {
    if (!activeLink) return;
    activeLink.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' });
    updateFade();
  }

  centerActive();
  window.addEventListener('load', centerActive);

  // ── Fade / › arrow hint ───────────────────────────────────────────────────
  // Hide the › once the user has scrolled all the way to the right.
  function updateFade() {
    if (!wrap || !wrap.classList.contains('nav-scroll-wrap')) return;
    var atEnd = nav.scrollLeft + nav.offsetWidth >= nav.scrollWidth - 4;
    wrap.classList.toggle('nav-end', atEnd);
  }

  nav.addEventListener('scroll', updateFade, { passive: true });
  updateFade(); // initial state (hides arrow when all links already fit)
})();
