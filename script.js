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

collections['anglais-quotidien'].cards.push(
  ['Comment dit-on « bonjour » ?', 'Hello.'],
  ['Comment dit-on « merci beaucoup » ?', 'Thank you very much.'],
  ['Que signifie « You’re welcome » ?', 'De rien.'],
  ['Comment demander le prix ?', 'How much is it?'],
  ['Comment demander l’heure ?', 'What time is it?'],
  ['Traduisez « Je ne comprends pas »', 'I don’t understand.'],
  ['Comment demander de répéter ?', 'Could you repeat that, please?'],
  ['Que signifie « Excuse me » ?', 'Excusez-moi.'],
  ['Comment dit-on « À demain » ?', 'See you tomorrow.'],
  ['Traduisez « Où sont les toilettes ? »', 'Where is the bathroom?'],
  ['Comment dire que l’on a faim ?', 'I’m hungry.'],
  ['Comment dire que l’on a soif ?', 'I’m thirsty.'],
  ['Que signifie « Take care » ?', 'Prends soin de toi.'],
  ['Comment demander de l’aide ?', 'Could you help me?'],
  ['Traduisez « J’arrive tout de suite »', 'I’ll be right there.'],
  ['Comment dit-on « Bonne chance » ?', 'Good luck.'],
  ['Que signifie « Never mind » ?', 'Ce n’est pas grave.'],
  ['Comment demander le prénom de quelqu’un ?', 'What’s your name?'],
  ['Traduisez « Je suis en retard »', 'I’m late.'],
  ['Comment dit-on « Faites attention » ?', 'Be careful.'],
  ['Que signifie « I’m just looking » ?', 'Je regarde seulement.'],
  ['Comment accepter une proposition ?', 'That sounds good.'],
  ['Traduisez « Pouvez-vous parler plus lentement ? »', 'Could you speak more slowly?'],
  ['Comment dit-on « Bon voyage » ?', 'Have a good trip.'],
  ['Que signifie « It depends » ?', 'Ça dépend.'],
  ['Comment dire « Pas de problème » ?', 'No problem.'],
);

collections['capitales-du-monde'].cards.push(
  ['Quelle est la capitale de la France ?', 'Paris'],
  ['Quelle est la capitale de l’Allemagne ?', 'Berlin'],
  ['Quelle est la capitale de l’Italie ?', 'Rome'],
  ['Quelle est la capitale de l’Espagne ?', 'Madrid'],
  ['Quelle est la capitale du Royaume-Uni ?', 'Londres'],
  ['Quelle est la capitale de l’Irlande ?', 'Dublin'],
  ['Quelle est la capitale de la Belgique ?', 'Bruxelles'],
  ['Quelle est la capitale des Pays-Bas ?', 'Amsterdam'],
  ['Quelle est la capitale de la Suisse ?', 'Berne'],
  ['Quelle est la capitale de l’Autriche ?', 'Vienne'],
  ['Quelle est la capitale de la Grèce ?', 'Athènes'],
  ['Quelle est la capitale de la Norvège ?', 'Oslo'],
  ['Quelle est la capitale de la Suède ?', 'Stockholm'],
  ['Quelle est la capitale de la Finlande ?', 'Helsinki'],
  ['Quelle est la capitale du Danemark ?', 'Copenhague'],
  ['Quelle est la capitale de la Pologne ?', 'Varsovie'],
  ['Quelle est la capitale de la Tchéquie ?', 'Prague'],
  ['Quelle est la capitale de la Hongrie ?', 'Budapest'],
  ['Quelle est la capitale de la Roumanie ?', 'Bucarest'],
  ['Quelle est la capitale de la Croatie ?', 'Zagreb'],
  ['Quelle est la capitale de la Turquie ?', 'Ankara'],
  ['Quelle est la capitale de l’Égypte ?', 'Le Caire'],
  ['Quelle est la capitale du Maroc ?', 'Rabat'],
  ['Quelle est la capitale du Sénégal ?', 'Dakar'],
  ['Quelle est la capitale de l’Éthiopie ?', 'Addis-Abeba'],
  ['Quelle est la capitale de l’Afrique du Sud ?', 'Pretoria'],
  ['Quelle est la capitale de la Chine ?', 'Pékin'],
  ['Quelle est la capitale de l’Inde ?', 'New Delhi'],
  ['Quelle est la capitale de la Corée du Sud ?', 'Séoul'],
  ['Quelle est la capitale de la Thaïlande ?', 'Bangkok'],
  ['Quelle est la capitale du Vietnam ?', 'Hanoï'],
  ['Quelle est la capitale de l’Indonésie ?', 'Jakarta'],
  ['Quelle est la capitale de l’Australie ?', 'Canberra'],
  ['Quelle est la capitale des États-Unis ?', 'Washington, D.C.'],
  ['Quelle est la capitale du Mexique ?', 'Mexico'],
  ['Quelle est la capitale du Brésil ?', 'Brasília'],
  ['Quelle est la capitale du Chili ?', 'Santiago'],
  ['Quelle est la capitale du Pérou ?', 'Lima'],
  ['Quelle est la capitale de la Colombie ?', 'Bogotá'],
  ['Quelle est la capitale de Cuba ?', 'La Havane'],
  ['Quelle est la capitale de l’Islande ?', 'Reykjavik'],
  ['Quelle est la capitale de l’Ukraine ?', 'Kyiv'],
);

collections['bases-javascript'].cards.push(
  ['Comment déclarer une variable réassignable ?', 'Avec le mot-clé let.'],
  ['Quelle valeur représente une absence intentionnelle ?', 'null.'],
  ['Comment créer un tableau vide ?', 'Avec [].'],
  ['Comment ajouter un élément à la fin d’un tableau ?', 'Avec Array.push().'],
  ['À quoi sert Array.filter() ?', 'À créer un tableau avec les éléments qui passent un test.'],
  ['À quoi sert Array.find() ?', 'À obtenir le premier élément qui passe un test.'],
  ['Comment convertir une chaîne en nombre entier ?', 'Avec parseInt() ou Number().'],
  ['Quel opérateur permet l’interpolation dans un template literal ?', 'La syntaxe ${expression}.'],
  ['Comment écrire une fonction fléchée ?', 'Avec la syntaxe () => {}.'],
  ['Que vaut une variable déclarée mais non initialisée ?', 'undefined.'],
  ['Comment tester plusieurs conditions alternatives ?', 'Avec else if.'],
  ['Quelle boucle parcourt les valeurs d’un itérable ?', 'La boucle for...of.'],
  ['Comment créer un objet littéral ?', 'Avec des accolades : {}.'],
  ['À quoi sert JSON.stringify() ?', 'À convertir une valeur JavaScript en chaîne JSON.'],
  ['À quoi sert JSON.parse() ?', 'À convertir une chaîne JSON en valeur JavaScript.'],
  ['Comment empêcher le comportement par défaut d’un événement ?', 'Avec event.preventDefault().'],
  ['Que fait une fonction async ?', 'Elle retourne toujours une promesse.'],
  ['Quel mot-clé attend la résolution d’une promesse ?', 'await.'],
);

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
