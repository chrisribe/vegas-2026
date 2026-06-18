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

  // Low-maintenance cache buster:
  // derive ?ver= from active cache key (vegas2026-vN), with sw.js fallback.
  function getVersion() {
    if ('caches' in window) {
      return caches.keys().then(function (keys) {
        var versions = keys
          .filter(function (x) { return /^vegas2026-v\d+$/.test(x); })
          .sort(function (a, b) {
            return parseInt(b.split('-v')[1], 10) - parseInt(a.split('-v')[1], 10);
          });
        if (versions.length) return versions[0];
        return fetch('./sw.js', { cache: 'no-store' })
          .then(function (r) { return r.text(); })
          .then(function (txt) {
            var m = txt.match(/const CACHE = '([^']+)'/);
            return m ? m[1] : '';
          })
          .catch(function () { return ''; });
      });
    }

    return fetch('./sw.js', { cache: 'no-store' })
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        var m = txt.match(/const CACHE = '([^']+)'/);
        return m ? m[1] : '';
      })
      .catch(function () { return ''; });
  }

  function render(version) {
    var suffix = version ? ('?ver=' + encodeURIComponent(version)) : '';

    nav.innerHTML = links.map(function (l) {
      var href = l.href + suffix;
      return '<a href="' + href + '"' + (current === l.href ? ' class="active"' : '') + '>' + l.label + '</a>';
    }).join('\n');

    // Declare wrap early so centerActive can reference it
    var wrap = nav.parentElement;

    // ── Active link centring ────────────────────────────────────────────────
    var activeLink = nav.querySelector('a.active');

    function centerActive() {
      if (!activeLink) return;
      activeLink.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' });
      updateFade();
    }

    centerActive();
    window.addEventListener('load', centerActive);

    // ── Fade / › arrow hint ─────────────────────────────────────────────────
    function updateFade() {
      if (!wrap || !wrap.classList.contains('nav-scroll-wrap')) return;
      var atEnd = nav.scrollLeft + nav.offsetWidth >= nav.scrollWidth - 4;
      wrap.classList.toggle('nav-end', atEnd);
    }

    nav.addEventListener('scroll', updateFade, { passive: true });
    updateFade();
  }

  getVersion().then(render).catch(function () { render(''); });
})();
