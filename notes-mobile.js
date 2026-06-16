// notes-mobile.js — collapse Notes/Must Try/Why Go column on mobile into tap-to-expand rows
(function () {
  if (window.innerWidth > 640) return; // desktop: do nothing

  // All column header names that should collapse on mobile
  var COLLAPSIBLE = ['Notes', 'Must Try', 'Why Go'];

  document.querySelectorAll('table').forEach(function (table) {
    // Find the first collapsible column by header text
    var headers = table.querySelectorAll('thead th');
    var notesIdx = -1;
    headers.forEach(function (th, i) {
      if (notesIdx === -1 && COLLAPSIBLE.indexOf(th.textContent.trim()) !== -1) notesIdx = i;
    });
    if (notesIdx === -1) return;

    // Hide Notes header
    headers[notesIdx].classList.add('col-notes');

    // Break multi-price cells (e.g. "$5 · $7") into min–max range on mobile
    table.querySelectorAll('tbody tr').forEach(function (row) {
      var cells = row.querySelectorAll('td');
      if (cells.length >= 3) {
        var priceCol = cells[notesIdx - 1];
        var raw = priceCol.textContent.trim();
        // Only reformat if multiple prices exist (contains ·)
        if (raw.indexOf('·') !== -1) {
          var nums = [];
          var matches = raw.match(/\d+(?:\.\d+)?/g);
          if (matches) matches.forEach(function(n) { nums.push(parseFloat(n)); });
          if (nums.length >= 2) {
            var mn = Math.min.apply(null, nums);
            var mx = Math.max.apply(null, nums);
            // Round to whole dollars if no cents
            var fmt = function(n) { return n % 1 === 0 ? '$' + n : '$' + n.toFixed(2); };
            priceCol.textContent = mn === mx ? fmt(mn) : fmt(mn) + '–' + mx + '$';
          }
        }
      }
    });

    // Process each body row
    table.querySelectorAll('tbody tr').forEach(function (row) {
      var cells = row.querySelectorAll('td');
      if (cells.length <= notesIdx) return;

      var noteCell = cells[notesIdx];
      var noteHTML = noteCell.innerHTML.trim();
      if (!noteHTML) return;

      // Hide the Notes cell
      noteCell.classList.add('col-notes');

      // Add 💡 toggle button to the Restaurant cell (col 0 — always visible, never clipped)
      var priceCell = cells[0];
      var btn = document.createElement('button');
      btn.className = 'note-toggle-btn';
      btn.innerHTML = ' 💡';
      btn.setAttribute('aria-label', 'Show note');
      priceCell.appendChild(btn);

      // Create the expandable row (spans all visible columns)
      var visibleCols = cells.length - 1; // minus the hidden Notes col
      var expandRow = document.createElement('tr');
      expandRow.className = 'note-expand-row';
      expandRow.innerHTML =
        '<td colspan="' + visibleCols + '" class="note-expand-cell">' +
        noteHTML +
        '</td>';
      row.parentNode.insertBefore(expandRow, row.nextSibling);

      btn.addEventListener('click', function () {
        var isOpen = expandRow.classList.toggle('open');
        btn.innerHTML = isOpen ? ' ✕' : ' 💡';
        btn.setAttribute('aria-label', isOpen ? 'Hide note' : 'Show note');
      });
    });
  });
})();
