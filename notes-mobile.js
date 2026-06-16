// notes-mobile.js — collapse Notes column on mobile into tap-to-expand rows
(function () {
  if (window.innerWidth > 640) return; // desktop: do nothing

  document.querySelectorAll('table').forEach(function (table) {
    // Find the Notes column index by header text
    var headers = table.querySelectorAll('thead th');
    var notesIdx = -1;
    headers.forEach(function (th, i) {
      if (th.textContent.trim() === 'Notes') notesIdx = i;
    });
    if (notesIdx === -1) return;

    // Hide Notes header
    headers[notesIdx].classList.add('col-notes');

    // Process each body row
    table.querySelectorAll('tbody tr').forEach(function (row) {
      var cells = row.querySelectorAll('td');
      if (cells.length <= notesIdx) return;

      var noteCell = cells[notesIdx];
      var noteHTML = noteCell.innerHTML.trim();
      if (!noteHTML) return;

      // Hide the Notes cell
      noteCell.classList.add('col-notes');

      // Add 💡 toggle button to the Price cell (one before Notes)
      var priceCell = cells[notesIdx - 1];
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
