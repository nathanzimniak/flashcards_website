const modal = document.querySelector('.modal');
const form = document.querySelector('#collection-form');

const collections = {
  'anglais-quotidien': {
    title: 'Anglais quotidien',
    category: 'LANGUES',
    description: 'Les mots et expressions pour discuter avec confiance.',
    emoji: '🗣️',
    color: '#feece7',
    count: 32,
    cards: [
      ['Comment dit-on « enchanté » ?', 'Nice to meet you.'],
      ['Que signifie « How are you doing? »', 'Comment vas-tu ?'],
      ['Comment demander son chemin ?', 'Could you tell me the way?'],
      ['Traduisez « Je suis d’accord »', 'I agree.'],
      ['Comment commander poliment ?', 'Could I have…, please?'],
      ['Que signifie « See you soon » ?', 'À bientôt.'],
    ],
  },
  'capitales-du-monde': {
    title: 'Les capitales du monde',
    category: 'GÉOGRAPHIE',
    description: 'Un tour du monde, capitale après capitale.',
    emoji: '🌍',
    color: '#e7f3fb',
    count: 48,
    cards: [
      ['Quelle est la capitale du Japon ?', 'Tokyo'],
      ['Quelle est la capitale du Canada ?', 'Ottawa'],
      ['Quelle est la capitale du Kenya ?', 'Nairobi'],
      ['Quelle est la capitale du Portugal ?', 'Lisbonne'],
      ['Quelle est la capitale de l’Argentine ?', 'Buenos Aires'],
      ['Quelle est la capitale de la Nouvelle-Zélande ?', 'Wellington'],
    ],
  },
  'bases-javascript': {
    title: 'Bases de JavaScript',
    category: 'DÉVELOPPEMENT',
    description: 'Les fondamentaux pour donner vie au web.',
    emoji: '&lt;/&gt;',
    color: '#fff5d9',
    count: 24,
    cards: [
      ['Comment déclarer une constante ?', 'Avec le mot-clé const.'],
      ['Que retourne typeof true ?', 'La chaîne « boolean ».'],
      ['À quoi sert Array.map() ?', 'À créer un nouveau tableau en transformant chaque élément.'],
      ['Quelle comparaison vérifie aussi le type ?', 'La comparaison stricte ===.'],
      ['Comment sélectionner un élément du DOM ?', 'Avec document.querySelector().'],
      ['À quoi sert addEventListener() ?', 'À exécuter une fonction lorsqu’un événement survient.'],
    ],
  },
};

const libraryView = document.querySelector('#library-view');
const collectionView = document.querySelector('#collection-view');

function renderRoute() {
  const match = window.location.hash.match(/^#collection\/(.+)$/);
  const collection = match ? collections[match[1]] : null;

  libraryView.hidden = Boolean(collection);
  collectionView.hidden = !collection;
  if (!collection) {
    document.title = 'Memento — Mes flashcards';
    return;
  }

  document.querySelector('.detail-title').textContent = collection.title;
  document.querySelector('.detail-category').textContent = collection.category;
  document.querySelector('.detail-description').textContent = collection.description;
  document.querySelector('.detail-count').textContent = `${collection.count} cartes`;
  const icon = document.querySelector('.detail-icon');
  icon.innerHTML = collection.emoji;
  icon.style.background = collection.color;

  document.querySelector('.flashcard-list').innerHTML = collection.cards.map(([question, answer], index) => `
    <button class="flashcard" type="button" aria-pressed="false" aria-label="Carte ${index + 1} : afficher la réponse">
      <span class="flashcard-label">CARTE ${String(index + 1).padStart(2, '0')}</span>
      <span class="flashcard-text flashcard-question">${question}</span>
      <span class="flashcard-text flashcard-answer">${answer}</span>
      <span class="flip-help">Cliquer pour retourner</span>
    </button>
  `).join('');

  document.querySelectorAll('.flashcard').forEach((card) => {
    card.addEventListener('click', () => {
      const flipped = card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', String(flipped));
      card.setAttribute('aria-label', `Carte : ${flipped ? 'afficher la question' : 'afficher la réponse'}`);
    });
  });
  document.title = `${collection.title} — Memento`;
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', renderRoute);
renderRoute();

document.querySelector('.start-study').addEventListener('click', () => {
  document.querySelector('.flashcard')?.focus();
  document.querySelector('.flashcards-section').scrollIntoView({ behavior: 'smooth' });
});

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
