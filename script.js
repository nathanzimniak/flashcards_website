const modal = document.querySelector('.modal');
const form = document.querySelector('#collection-form');
const searchPanel = document.querySelector('.search-panel');
const searchInput = searchPanel.querySelector('input');
const emptySearch = document.querySelector('.empty-search');

document.querySelectorAll('[data-open-modal]').forEach((button) => {
  button.addEventListener('click', () => {
    modal.showModal();
    setTimeout(() => document.querySelector('#collection-name').focus(), 50);
  });
});

document.querySelector('[data-search-toggle]').addEventListener('click', () => {
  searchPanel.hidden = !searchPanel.hidden;
  if (!searchPanel.hidden) searchInput.focus();
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLocaleLowerCase('fr');
  let visible = 0;
  document.querySelectorAll('.collection-card').forEach((card) => {
    const matches = card.dataset.title.includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  emptySearch.hidden = visible !== 0;
});

form.addEventListener('submit', (event) => {
  const submitter = event.submitter;
  if (submitter?.value === 'cancel') return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  modal.close();
  form.reset();
  const toast = document.querySelector('.toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
});
