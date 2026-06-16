// Single source of truth for the nav — edit here, applies everywhere
(function () {
  const links = [
    { href: 'index.html',      label: '🏠 Home' },
    { href: 'cheap-eats.html', label: '🍽️ Cheap Eats' },
    { href: 'buffets.html',    label: '🦞 Buffets' },
    { href: 'off-strip.html',  label: '🏙️ Off-Strip' },
    { href: 'tournament.html', label: '🎱 Tournament' },
    { href: 'transport.html',  label: '🚇 Transport' },
    { href: 'tips.html',       label: '💡 Tips' },
    { href: 'map.html',        label: '🗺️ Map' },
  ];

  const current = window.location.pathname.split('/').pop() || 'index.html';

  const nav = document.getElementById('main-nav');
  if (!nav) return;

  nav.innerHTML = links.map(l =>
    `<a href="${l.href}"${current === l.href ? ' class="active"' : ''}>${l.label}</a>`
  ).join('\n');
})();
