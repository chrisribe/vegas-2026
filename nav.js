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

  nav.innerHTML = links.map(function(l) {
    return '<a href="' + l.href + '"' + (current === l.href ? ' class="active"' : '') + '>' + l.label + '</a>';
  }).join('\n');

  // Scroll so the active link is centred in the nav bar
  var activeLink = nav.querySelector('a.active');
  if (activeLink) {
    var linkCenter = activeLink.offsetLeft + activeLink.offsetWidth / 2;
    nav.scrollLeft = linkCenter - nav.offsetWidth / 2;
  }

  // Fade/arrow hint: hide the › when fully scrolled to the right end
  var wrap = nav.parentElement;
  if (wrap && wrap.classList.contains('nav-scroll-wrap')) {
    function updateFade() {
      var atEnd = nav.scrollLeft + nav.offsetWidth >= nav.scrollWidth - 4;
      wrap.classList.toggle('nav-end', atEnd);
    }
    nav.addEventListener('scroll', updateFade, { passive: true });
    updateFade(); // run once on load (no overflow → hide arrow immediately)
  }
})();
