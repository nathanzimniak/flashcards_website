const modal = document.querySelector('.modal');
const form = document.querySelector('#collection-form');

document.querySelectorAll('[data-open-modal]').forEach((button) => {
  button.addEventListener('click', () => {
    modal.showModal();
    setTimeout(() => document.querySelector('#collection-name').focus(), 50);
  });
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
