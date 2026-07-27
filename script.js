const modal = document.querySelector(".modal");
const form = document.querySelector("#collection-form");
const cardModal = document.querySelector(".card-modal");
const cardForm = document.querySelector("#card-form");
const studyModal = document.querySelector(".study-modal");
const storageKey = "memento-custom-cards";
const collectionsStorageKey = "memento-custom-collections";
const deletedCollectionsStorageKey = "memento-deleted-collections";
const collectionViewStorageKey = "memento-collection-view";
const difficultyStorageKey = "memento-card-difficulties";
const difficultyWeights = { hard: 3, medium: 2, easy: 1 };
const difficultySortOrder = { hard: 0, medium: 1, easy: 2, unrated: 3 };
const difficultyLabels = { hard: "Difficile", medium: "Moyen", easy: "Facile" };
const collectionGrid = document.querySelector(".collection-grid");
const toast = document.querySelector(".toast");
const studyCard = document.querySelector(".study-card");
let editedCardIndex = null;
let editedCollectionId = null;

const collections = {
  "anglais-quotidien": {
    title: "Anglais quotidien",
    category: "LANGUES",
    emoji: "🗣️",
    color: "#feece7",
    cards: [
      ["Comment dit-on « enchanté » ?", "Nice to meet you."],
      ["Que signifie « How are you doing? »", "Comment vas-tu ?"],
      ["Comment demander son chemin ?", "Could you tell me the way?"],
      ["Traduisez « Je suis d’accord »", "I agree."],
      ["Comment commander poliment ?", "Could I have…, please?"],
      ["Que signifie « See you soon » ?", "À bientôt."],
    ],
  },
  "capitales-du-monde": {
    title: "Les capitales du monde",
    category: "GÉOGRAPHIE",
    emoji: "🌍",
    color: "#e7f3fb",
    cards: [
      ["Quelle est la capitale du Japon ?", "Tokyo"],
      ["Quelle est la capitale du Canada ?", "Ottawa"],
      ["Quelle est la capitale du Kenya ?", "Nairobi"],
      ["Quelle est la capitale du Portugal ?", "Lisbonne"],
      ["Quelle est la capitale de l’Argentine ?", "Buenos Aires"],
      ["Quelle est la capitale de la Nouvelle-Zélande ?", "Wellington"],
    ],
  },
  "bases-javascript": {
    title: "Bases de JavaScript",
    category: "DÉVELOPPEMENT",
    emoji: "&lt;/&gt;",
    color: "#fff5d9",
    cards: [
      ["Comment déclarer une constante ?", "Avec le mot-clé const."],
      ["Que retourne typeof true ?", "La chaîne « boolean »."],
      [
        "À quoi sert Array.map() ?",
        "À créer un nouveau tableau en transformant chaque élément.",
      ],
      [
        "Quelle comparaison vérifie aussi le type ?",
        "La comparaison stricte ===.",
      ],
      [
        "Comment sélectionner un élément du DOM ?",
        "Avec document.querySelector().",
      ],
      [
        "À quoi sert addEventListener() ?",
        "À exécuter une fonction lorsqu’un événement survient.",
      ],
    ],
  },
};

collections["anglais-quotidien"].cards.push(
  ["Comment dit-on « bonjour » ?", "Hello."],
  ["Comment dit-on « merci beaucoup » ?", "Thank you very much."],
  ["Que signifie « You’re welcome » ?", "De rien."],
  ["Comment demander le prix ?", "How much is it?"],
  ["Comment demander l’heure ?", "What time is it?"],
  ["Traduisez « Je ne comprends pas »", "I don’t understand."],
  ["Comment demander de répéter ?", "Could you repeat that, please?"],
  ["Que signifie « Excuse me » ?", "Excusez-moi."],
  ["Comment dit-on « À demain » ?", "See you tomorrow."],
  ["Traduisez « Où sont les toilettes ? »", "Where is the bathroom?"],
  ["Comment dire que l’on a faim ?", "I’m hungry."],
  ["Comment dire que l’on a soif ?", "I’m thirsty."],
  ["Que signifie « Take care » ?", "Prends soin de toi."],
  ["Comment demander de l’aide ?", "Could you help me?"],
  ["Traduisez « J’arrive tout de suite »", "I’ll be right there."],
  ["Comment dit-on « Bonne chance » ?", "Good luck."],
  ["Que signifie « Never mind » ?", "Ce n’est pas grave."],
  ["Comment demander le prénom de quelqu’un ?", "What’s your name?"],
  ["Traduisez « Je suis en retard »", "I’m late."],
  ["Comment dit-on « Faites attention » ?", "Be careful."],
  ["Que signifie « I’m just looking » ?", "Je regarde seulement."],
  ["Comment accepter une proposition ?", "That sounds good."],
  [
    "Traduisez « Pouvez-vous parler plus lentement ? »",
    "Could you speak more slowly?",
  ],
  ["Comment dit-on « Bon voyage » ?", "Have a good trip."],
  ["Que signifie « It depends » ?", "Ça dépend."],
  ["Comment dire « Pas de problème » ?", "No problem."],
);

collections["capitales-du-monde"].cards.push(
  ["Quelle est la capitale de la France ?", "Paris"],
  ["Quelle est la capitale de l’Allemagne ?", "Berlin"],
  ["Quelle est la capitale de l’Italie ?", "Rome"],
  ["Quelle est la capitale de l’Espagne ?", "Madrid"],
  ["Quelle est la capitale du Royaume-Uni ?", "Londres"],
  ["Quelle est la capitale de l’Irlande ?", "Dublin"],
  ["Quelle est la capitale de la Belgique ?", "Bruxelles"],
  ["Quelle est la capitale des Pays-Bas ?", "Amsterdam"],
  ["Quelle est la capitale de la Suisse ?", "Berne"],
  ["Quelle est la capitale de l’Autriche ?", "Vienne"],
  ["Quelle est la capitale de la Grèce ?", "Athènes"],
  ["Quelle est la capitale de la Norvège ?", "Oslo"],
  ["Quelle est la capitale de la Suède ?", "Stockholm"],
  ["Quelle est la capitale de la Finlande ?", "Helsinki"],
  ["Quelle est la capitale du Danemark ?", "Copenhague"],
  ["Quelle est la capitale de la Pologne ?", "Varsovie"],
  ["Quelle est la capitale de la Tchéquie ?", "Prague"],
  ["Quelle est la capitale de la Hongrie ?", "Budapest"],
  ["Quelle est la capitale de la Roumanie ?", "Bucarest"],
  ["Quelle est la capitale de la Croatie ?", "Zagreb"],
  ["Quelle est la capitale de la Turquie ?", "Ankara"],
  ["Quelle est la capitale de l’Égypte ?", "Le Caire"],
  ["Quelle est la capitale du Maroc ?", "Rabat"],
  ["Quelle est la capitale du Sénégal ?", "Dakar"],
  ["Quelle est la capitale de l’Éthiopie ?", "Addis-Abeba"],
  ["Quelle est la capitale de l’Afrique du Sud ?", "Pretoria"],
  ["Quelle est la capitale de la Chine ?", "Pékin"],
  ["Quelle est la capitale de l’Inde ?", "New Delhi"],
  ["Quelle est la capitale de la Corée du Sud ?", "Séoul"],
  ["Quelle est la capitale de la Thaïlande ?", "Bangkok"],
  ["Quelle est la capitale du Vietnam ?", "Hanoï"],
  ["Quelle est la capitale de l’Indonésie ?", "Jakarta"],
  ["Quelle est la capitale de l’Australie ?", "Canberra"],
  ["Quelle est la capitale des États-Unis ?", "Washington, D.C."],
  ["Quelle est la capitale du Mexique ?", "Mexico"],
  ["Quelle est la capitale du Brésil ?", "Brasília"],
  ["Quelle est la capitale du Chili ?", "Santiago"],
  ["Quelle est la capitale du Pérou ?", "Lima"],
  ["Quelle est la capitale de la Colombie ?", "Bogotá"],
  ["Quelle est la capitale de Cuba ?", "La Havane"],
  ["Quelle est la capitale de l’Islande ?", "Reykjavik"],
  ["Quelle est la capitale de l’Ukraine ?", "Kyiv"],
);

collections["bases-javascript"].cards.push(
  ["Comment déclarer une variable réassignable ?", "Avec le mot-clé let."],
  ["Quelle valeur représente une absence intentionnelle ?", "null."],
  ["Comment créer un tableau vide ?", "Avec []."],
  ["Comment ajouter un élément à la fin d’un tableau ?", "Avec Array.push()."],
  [
    "À quoi sert Array.filter() ?",
    "À créer un tableau avec les éléments qui passent un test.",
  ],
  [
    "À quoi sert Array.find() ?",
    "À obtenir le premier élément qui passe un test.",
  ],
  [
    "Comment convertir une chaîne en nombre entier ?",
    "Avec parseInt() ou Number().",
  ],
  [
    "Quel opérateur permet l’interpolation dans un template literal ?",
    "La syntaxe ${expression}.",
  ],
  ["Comment écrire une fonction fléchée ?", "Avec la syntaxe () => {}."],
  ["Que vaut une variable déclarée mais non initialisée ?", "undefined."],
  ["Comment tester plusieurs conditions alternatives ?", "Avec else if."],
  ["Quelle boucle parcourt les valeurs d’un itérable ?", "La boucle for...of."],
  ["Comment créer un objet littéral ?", "Avec des accolades : {}."],
  [
    "À quoi sert JSON.stringify() ?",
    "À convertir une valeur JavaScript en chaîne JSON.",
  ],
  [
    "À quoi sert JSON.parse() ?",
    "À convertir une chaîne JSON en valeur JavaScript.",
  ],
  [
    "Comment empêcher le comportement par défaut d’un événement ?",
    "Avec event.preventDefault().",
  ],
  ["Que fait une fonction async ?", "Elle retourne toujours une promesse."],
  ["Quel mot-clé attend la résolution d’une promesse ?", "await."],
);

const libraryView = document.querySelector("#library-view");
const collectionView = document.querySelector("#collection-view");
let activeCollectionId = null;
let studyCards = [];
let studyIndex = 0;
let answerIsVisible = false;

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function loadSavedCollections() {
  const savedCollections = readStorage(collectionsStorageKey);
  Object.entries(savedCollections).forEach(([id, collection]) => {
    if (!collection || typeof collection.title !== "string") return;
    collections[id] = {
      title: collection.title,
      category: collection.category || "PERSONNEL",
      emoji: collection.emoji || "✦",
      color: collection.color || "#eee9fc",
      cards: collections[id]?.cards || [],
    };
  });
}

function loadDeletedCollections() {
  const deletedCollections = readStorage(deletedCollectionsStorageKey);
  if (!Array.isArray(deletedCollections)) return;
  deletedCollections.forEach((id) => delete collections[id]);
}

function loadSavedCards() {
  const savedCards = readStorage(storageKey);
  Object.entries(savedCards).forEach(([collectionId, cards]) => {
    if (collections[collectionId] && Array.isArray(cards))
      collections[collectionId].cards = cards;
  });
}

function createCollectionId(title) {
  const baseId =
    title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "collection";
  let id = baseId;
  let suffix = 2;
  while (collections[id]) id = `${baseId}-${suffix++}`;
  return id;
}

function formatCardCount(count) {
  return `${count} carte${count > 1 ? "s" : ""}`;
}

function createCollectionCard(id, collection) {
  const card = document.createElement("article");
  card.className = "collection-card";
  card.dataset.collectionId = id;
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.setAttribute("aria-label", `Ouvrir la collection ${collection.title}`);
  card.innerHTML =
    '<div class="card-top"><span class="card-emoji" aria-hidden="true"></span><span class="collection-actions"><button class="edit-card edit-collection" type="button"><span class="sr-only">Modifier la collection</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m4 20 4.2-1 10.9-10.9a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z"></path><path d="m14.8 6.4 3 3"></path></svg></button><button class="delete-card delete-collection" type="button"><span class="sr-only">Supprimer la collection</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"></path></svg></button></span></div><div class="card-content"><span class="tag"></span><h3></h3><div class="card-footer"><span></span></div></div>';
  card.querySelector(".card-top").style.background = collection.color;
  const emoji = card.querySelector(".card-emoji");
  if (collection.emoji === "&lt;/&gt;") emoji.innerHTML = collection.emoji;
  else emoji.textContent = collection.emoji;
  card.querySelector(".tag").textContent = collection.category;
  card.querySelector("h3").textContent = collection.title;
  card.querySelector(".card-footer span").textContent = formatCardCount(
    collection.cards.length,
  );
  card.querySelector(".edit-collection").setAttribute(
    "aria-label",
    `Modifier la collection ${collection.title}`,
  );
  card.querySelector(".delete-collection").setAttribute(
    "aria-label",
    `Supprimer la collection ${collection.title}`,
  );
  card.querySelector(".edit-collection").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openCollectionModal(id);
  });
  card.querySelector(".delete-collection").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    deleteCollection(id);
  });
  card.addEventListener("click", () => {
    window.location.hash = `collection/${id}`;
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target === card)
      window.location.hash = `collection/${id}`;
  });
  return card;
}

function saveCollectionMetadata(id) {
  const savedCollections = readStorage(collectionsStorageKey);
  const { title, category, emoji, color } = collections[id];
  savedCollections[id] = { title, category, emoji, color };
  localStorage.setItem(collectionsStorageKey, JSON.stringify(savedCollections));
  const deletedCollections = readStorage(deletedCollectionsStorageKey);
  if (Array.isArray(deletedCollections) && deletedCollections.includes(id)) {
    localStorage.setItem(
      deletedCollectionsStorageKey,
      JSON.stringify(
        deletedCollections.filter((deletedId) => deletedId !== id),
      ),
    );
  }
}

function openCollectionModal(id = null) {
  editedCollectionId = id;
  form.reset();
  const isEditing = Boolean(id && collections[id]);
  document.querySelector(".collection-modal-label").textContent = isEditing
    ? "MODIFICATION"
    : "NOUVEAU DÉPART";
  document.querySelector(".collection-modal-title").textContent = isEditing
    ? "Modifier la collection"
    : "Créer une collection";
  document.querySelector(".collection-modal-description").textContent =
    isEditing
      ? "Modifiez le nom et la catégorie de cette collection."
      : "Donnez un nom au prochain sujet que vous allez maîtriser.";
  document.querySelector(".collection-modal-submit").textContent = isEditing
    ? "Enregistrer les modifications"
    : "Créer ma collection";
  if (isEditing) {
    form.elements.name.value = collections[id].title;
    form.elements.category.value = collections[id].category;
  }
  modal.showModal();
  setTimeout(() => form.elements.name.focus(), 50);
}

function deleteCollection(id) {
  const collection = collections[id];
  if (
    !collection ||
    !window.confirm(`Supprimer la collection « ${collection.title} » ?`)
  )
    return false;
  delete collections[id];
  const savedCollections = readStorage(collectionsStorageKey);
  delete savedCollections[id];
  localStorage.setItem(collectionsStorageKey, JSON.stringify(savedCollections));
  const savedCards = readStorage(storageKey);
  delete savedCards[id];
  localStorage.setItem(storageKey, JSON.stringify(savedCards));
  const difficulties = readStorage(difficultyStorageKey);
  delete difficulties[id];
  localStorage.setItem(difficultyStorageKey, JSON.stringify(difficulties));
  const deletedCollections = readStorage(deletedCollectionsStorageKey);
  const deletedIds = Array.isArray(deletedCollections) ? deletedCollections : [];
  if (!deletedIds.includes(id)) deletedIds.push(id);
  localStorage.setItem(deletedCollectionsStorageKey, JSON.stringify(deletedIds));
  renderCollectionCards();
  showToast("Collection supprimée");
  return true;
}

function renderCollectionCards() {
  collectionGrid
    .querySelectorAll(".collection-card")
    .forEach((card) => card.remove());
  Object.entries(collections).forEach(([id, collection]) => {
    collectionGrid.append(createCollectionCard(id, collection));
  });
}

function setCollectionView(view) {
  const selectedView = view === "list" ? "list" : "grid";
  collectionGrid.classList.toggle("list-view", selectedView === "list");
  document.querySelectorAll(".view-controls button").forEach((button) => {
    const isSelected = button.dataset.view === selectedView;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  localStorage.setItem(collectionViewStorageKey, selectedView);
}

function saveCards() {
  const cards = Object.fromEntries(
    Object.entries(collections).map(([id, collection]) => [
      id,
      collection.cards,
    ]),
  );
  localStorage.setItem(storageKey, JSON.stringify(cards));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2800);
}

function shuffleCards(cards) {
  const shuffled = cards.map((card) => ({ card, key: getCardKey(card) }));
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

function getCardKey([question, answer]) {
  return `${question}\u0000${answer}`;
}

function getDifficulties() {
  return readStorage(difficultyStorageKey);
}

function saveDifficulty(cardKey, difficulty) {
  const difficulties = getDifficulties();
  difficulties[activeCollectionId] ||= {};
  difficulties[activeCollectionId][cardKey] = difficulty;
  localStorage.setItem(difficultyStorageKey, JSON.stringify(difficulties));
}

function setDifficultyBadge(badge, difficulty) {
  const savedDifficulty = difficultyLabels[difficulty] ? difficulty : "unrated";
  badge.className = `difficulty-badge difficulty-${savedDifficulty}`;
  badge.textContent = difficultyLabels[savedDifficulty] || "À évaluer";
}

function getCardsSortedByDifficulty(collection) {
  const savedDifficulties = getDifficulties()[activeCollectionId] || {};
  return collection.cards
    .map((card, index) => ({
      card,
      index,
      difficulty: difficultyLabels[savedDifficulties[getCardKey(card)]]
        ? savedDifficulties[getCardKey(card)]
        : "unrated",
    }))
    .sort(
      (first, second) =>
        difficultySortOrder[first.difficulty] -
        difficultySortOrder[second.difficulty],
    );
}

function renderFlashcards(collection) {
  const sortedCards = getCardsSortedByDifficulty(collection);
  const flashcardList = document.querySelector(".flashcard-list");
  const addFlashcardButton = flashcardList.querySelector(
    ".add-flashcard-button",
  );
  flashcardList.replaceChildren(
    addFlashcardButton,
    ...sortedCards.map(({ card, index }) => createFlashcard(card, index)),
  );
}

function renderStudyCard() {
  const [question, answer] = studyCards[studyIndex].card;
  const progress = ((studyIndex + 1) / studyCards.length) * 100;
  document.querySelector(".study-progress-text").textContent =
    `Carte ${studyIndex + 1} sur ${studyCards.length}`;
  const progressBar = document.querySelector(".study-progress");
  progressBar.setAttribute("aria-valuemax", String(studyCards.length));
  progressBar.setAttribute("aria-valuenow", String(studyIndex + 1));
  progressBar.querySelector("span").style.width = `${progress}%`;
  document.querySelector(".study-side").textContent = answerIsVisible
    ? "RÉPONSE"
    : "QUESTION";
  document.querySelector(".study-card-text").textContent = answerIsVisible
    ? answer
    : question;
  document.querySelector(".study-flip-help").textContent = answerIsVisible
    ? "Revoir la question"
    : "Afficher la réponse";
  studyCard.classList.toggle("answer-visible", answerIsVisible);
  studyCard.setAttribute(
    "aria-label",
    answerIsVisible ? "Afficher la question" : "Afficher la réponse",
  );
  document.querySelector(".study-reveal").hidden = answerIsVisible;
  document.querySelector(".study-rating").hidden = !answerIsVisible;
}

function toggleStudyCard() {
  answerIsVisible = !answerIsVisible;
  renderStudyCard();
}

function startStudySession() {
  const collection = collections[activeCollectionId];
  if (!collection?.cards.length) {
    showToast("Ajoutez une carte avant de commencer");
    return;
  }
  studyCards = shuffleCards(collection.cards);
  const savedDifficulties = getDifficulties()[activeCollectionId] || {};
  studyCards.forEach(({ card, key }) => {
    const weight = difficultyWeights[savedDifficulties[key]] || 1;
    for (let appearance = 1; appearance < weight; appearance += 1)
      studyCards.push({ card, key });
  });
  studyCards = shuffleCards(studyCards.map(({ card }) => card));
  studyIndex = 0;
  answerIsVisible = false;
  document.querySelector("#study-title").textContent = collection.title;
  renderStudyCard();
  studyModal.showModal();
  studyCard.focus();
}

function createFlashcard([question, answer], index) {
  const cardKey = getCardKey([question, answer]);
  const difficulty = getDifficulties()[activeCollectionId]?.[cardKey];
  const card = document.createElement("article");
  card.className = "flashcard";
  card.dataset.cardKey = cardKey;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-pressed", "false");
  card.setAttribute("aria-label", `Carte ${index + 1} : afficher la réponse`);
  card.innerHTML = `<button class="edit-card" type="button" aria-label="Modifier la carte ${index + 1}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m4 20 4.2-1 10.9-10.9a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z"></path><path d="m14.8 6.4 3 3"></path></svg></button><button class="delete-card" type="button" aria-label="Supprimer la carte ${index + 1}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"></path></svg></button><span class="flashcard-meta"><span class="difficulty-badge"></span></span><span class="flashcard-text flashcard-question"></span><span class="flashcard-text flashcard-answer"></span>`;
  card.querySelector(".flashcard-question").textContent = question;
  card.querySelector(".flashcard-answer").textContent = answer;
  setDifficultyBadge(card.querySelector(".difficulty-badge"), difficulty);

  const flipCard = () => {
    const flipped = card.classList.toggle("flipped");
    card.setAttribute("aria-pressed", String(flipped));
    card.setAttribute(
      "aria-label",
      `Carte ${index + 1} : ${flipped ? "afficher la question" : "afficher la réponse"}`,
    );
  };
  card.addEventListener("click", flipCard);
  card.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target === card) {
      event.preventDefault();
      flipCard();
    }
  });
  card.querySelector(".delete-card").addEventListener("click", (event) => {
    event.stopPropagation();
    if (!window.confirm("Supprimer cette carte ?")) return;
    collections[activeCollectionId].cards.splice(index, 1);
    saveCards();
    renderRoute();
    showToast("Carte supprimée");
  });
  card.querySelector(".edit-card").addEventListener("click", (event) => {
    event.stopPropagation();
    editedCardIndex = index;
    cardForm.elements.question.value = question;
    cardForm.elements.answer.value = answer;
    document.querySelector(".card-modal-label").textContent = "MODIFICATION";
    document.querySelector(".card-modal-title").textContent =
      "Modifier la carte";
    document.querySelector(".card-modal-description").textContent =
      "Modifiez la question et la réponse de cette carte.";
    document.querySelector(".card-modal-submit").textContent =
      "Enregistrer les modifications";
    cardModal.showModal();
    setTimeout(() => cardForm.elements.question.focus(), 50);
  });
  return card;
}

function renderRoute() {
  const match = window.location.hash.match(/^#collection\/(.+)$/);
  const collection = match ? collections[match[1]] : null;
  activeCollectionId = collection ? match[1] : null;

  libraryView.hidden = Boolean(collection);
  collectionView.hidden = !collection;
  if (!collection) {
    document.querySelectorAll(".collection-card").forEach((card) => {
      const collectionId = card.dataset.collectionId;
      const count = collections[collectionId]?.cards.length;
      if (count === undefined) return;
      card.querySelector(".card-footer span").textContent =
        formatCardCount(count);
    });
    document.title = "Memento — Mes flashcards";
    return;
  }

  document.querySelector(".detail-title").textContent = collection.title;
  document.querySelector(".detail-category").textContent = collection.category;
  document
    .querySelector(".edit-detail-collection")
    .setAttribute("aria-label", `Modifier la collection ${collection.title}`);
  document
    .querySelector(".delete-detail-collection")
    .setAttribute("aria-label", `Supprimer la collection ${collection.title}`);
  const cardCount = collection.cards.length;
  document.querySelector(".detail-count").textContent =
    formatCardCount(cardCount);
  const icon = document.querySelector(".detail-icon");
  icon.innerHTML = collection.emoji;
  icon.style.background = collection.color;

  renderFlashcards(collection);
  document.querySelector(".empty-cards").hidden = cardCount !== 0;
  document.title = `${collection.title} — Memento`;
  window.scrollTo(0, 0);
}

loadSavedCollections();
loadDeletedCollections();
loadSavedCards();
renderCollectionCards();
setCollectionView(localStorage.getItem(collectionViewStorageKey));

document.querySelectorAll(".view-controls button").forEach((button) => {
  button.addEventListener("click", () =>
    setCollectionView(button.dataset.view),
  );
});

window.addEventListener("hashchange", renderRoute);
renderRoute();

document
  .querySelector(".start-study")
  .addEventListener("click", startStudySession);

studyCard.addEventListener("click", toggleStudyCard);
document
  .querySelector(".study-reveal")
  .addEventListener("click", toggleStudyCard);
document.querySelectorAll(".difficulty-button").forEach((button) =>
  button.addEventListener("click", () => {
    const currentCard = studyCards[studyIndex];
    const difficulty = button.dataset.difficulty;
    saveDifficulty(currentCard.key, difficulty);
    renderFlashcards(collections[activeCollectionId]);

    const appearances = studyCards.filter(
      ({ key }) => key === currentCard.key,
    ).length;
    const requestedAppearances = difficultyWeights[difficulty];
    for (
      let appearance = appearances;
      appearance < requestedAppearances;
      appearance += 1
    ) {
      studyCards.push({ ...currentCard });
    }

    if (studyIndex === studyCards.length - 1) {
      studyModal.close();
      showToast("Session terminée, bravo ! ✨");
      return;
    }
    studyIndex += 1;
    answerIsVisible = false;
    renderStudyCard();
    studyCard.focus();
  }),
);
document
  .querySelector(".study-close")
  .addEventListener("click", () => studyModal.close());

document
  .querySelector(".add-flashcard-button")
  .addEventListener("click", () => {
    editedCardIndex = null;
    cardForm.reset();
    document.querySelector(".card-modal-label").textContent = "NOUVELLE CARTE";
    document.querySelector(".card-modal-title").textContent =
      "Ajouter une carte";
    document.querySelector(".card-modal-description").textContent =
      "Renseignez le recto et le verso de votre nouvelle carte.";
    document.querySelector(".card-modal-submit").textContent =
      "Ajouter la carte";
    cardModal.showModal();
    setTimeout(() => document.querySelector("#card-question").focus(), 50);
  });

document
  .querySelector(".edit-detail-collection")
  .addEventListener("click", () => {
    if (activeCollectionId) openCollectionModal(activeCollectionId);
  });

document
  .querySelector(".delete-detail-collection")
  .addEventListener("click", () => {
    if (activeCollectionId && deleteCollection(activeCollectionId))
      window.location.hash = "collections";
  });

cardForm.addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  if (!cardForm.reportValidity() || !activeCollectionId) return;
  const data = new FormData(cardForm);
  const updatedCard = [data.get("question").trim(), data.get("answer").trim()];
  const isEditing = editedCardIndex !== null;
  if (isEditing) {
    const previousCard = collections[activeCollectionId].cards[editedCardIndex];
    const difficulties = getDifficulties();
    const collectionDifficulties = difficulties[activeCollectionId];
    const previousKey = getCardKey(previousCard);
    if (collectionDifficulties?.[previousKey]) {
      collectionDifficulties[getCardKey(updatedCard)] =
        collectionDifficulties[previousKey];
      delete collectionDifficulties[previousKey];
      localStorage.setItem(difficultyStorageKey, JSON.stringify(difficulties));
    }
    collections[activeCollectionId].cards[editedCardIndex] = updatedCard;
  } else {
    collections[activeCollectionId].cards.push(updatedCard);
  }
  saveCards();
  cardModal.close();
  cardForm.reset();
  editedCardIndex = null;
  renderRoute();
  showToast(
    isEditing
      ? "Carte modifiée avec succès ✨"
      : "Carte ajoutée avec succès ✨",
  );
});

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    openCollectionModal();
  });
});

form.addEventListener("submit", (event) => {
  const submitter = event.submitter;
  if (submitter?.value === "cancel") return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const title = data.get("name").trim();
  const category = data.get("category");
  const isEditing = Boolean(editedCollectionId);
  const id = isEditing ? editedCollectionId : createCollectionId(title);
  if (isEditing) {
    collections[id].title = title;
    collections[id].category = category;
  } else {
    collections[id] = {
      title,
      category,
      emoji: "✦",
      color: "#eee9fc",
      cards: [],
    };
  }
  saveCollectionMetadata(id);
  saveCards();
  renderCollectionCards();
  renderRoute();
  modal.close();
  form.reset();
  editedCollectionId = null;
  showToast(
    isEditing
      ? "Collection modifiée avec succès ✨"
      : "Collection créée avec succès ✨",
  );
  if (!isEditing) window.location.hash = `collection/${id}`;
});
