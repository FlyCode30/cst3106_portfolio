				
// Recursive function to build dropdown lists (handles submenus)
function buildMenu(items, parentUl, frame, projectKey) {
  items.forEach(item => {
    const li = document.createElement('li');

    // Case 1: item has children → nested dropdown
    if (Array.isArray(item.children)) {
      li.classList.add('dropdown'); // required by your Bootstrap-like template

      const a = document.createElement('a');
      a.href = '#';
      a.innerHTML = `<span>${item.label}</span> <i class="bi bi-chevron-down toggle-dropdown"></i>`;

      const subUl = document.createElement('ul');
      buildMenu(item.children, subUl, frame, projectKey); // recurse for children

      li.appendChild(a);
      li.appendChild(subUl);
    }
    // Case 2: normal link
    else {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = item.label;

      a.addEventListener('click', (ev) => {
        ev.preventDefault();

        if (item.embed === 'newtab') {
          window.open(item.src, '_blank', 'noopener');
        } else if (frame) {
          frame.src = item.src;
        }

        // optional: update URL
        const url = new URL(location.href);
        url.searchParams.set('p', projectKey);
        url.searchParams.set('asset', encodeURIComponent(item.label));
        history.replaceState(null, '', url);
      });

      li.appendChild(a);
    }

    parentUl.appendChild(li);
  });
}