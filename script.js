const modal = document.querySelector(".modal");
const form = document.querySelector("#collection-form");
const cardModal = document.querySelector(".card-modal");
const cardForm = document.querySelector("#card-form");
const studyModal = document.querySelector(".study-modal");
const collectionGrid = document.querySelector(".collection-grid");
const collectionModalTitle = document.querySelector("#collection-modal-title");
const collectionModalSubmit = document.querySelector(
  ".collection-modal-submit",
);
const cardModalTitle = document.querySelector("#card-modal-title");
const cardModalDescription = document.querySelector(".card-modal-description");
const cardModalSubmit = document.querySelector(".card-modal-submit");
const flashcardList = document.querySelector(".flashcard-list");
const toast = document.querySelector(".toast");
const studyCard = document.querySelector(".study-card");
const studyProgressText = document.querySelector(".study-progress-text");
const studyProgress = document.querySelector(".study-progress");
const studySide = document.querySelector(".study-side");
const studyCardText = document.querySelector(".study-card-text");
const studyFlipHelp = document.querySelector(".study-flip-help");
const studyRating = document.querySelector(".study-rating");
const collectionStudyButton = document.querySelector(
  ".collection-study-button",
);
const detailTitle = document.querySelector(".detail-title");
const detailCategory = document.querySelector(".detail-category");
const detailCount = document.querySelector(".detail-count");
const detailImage = document.querySelector(".detail-icon .collection-image");
const editCollectionButton = document.querySelector(".edit-detail-collection");
const deleteCollectionButton = document.querySelector(
  ".delete-detail-collection",
);
const importButton = document.querySelector(".import-button");
const exportButton = document.querySelector(".export-button");
const importFileInput = document.querySelector(".import-file-input");
const storageKey = "memento-custom-cards";
const collectionsStorageKey = "memento-custom-collections";
const deletedCollectionsStorageKey = "memento-deleted-collections";
const difficultyStorageKey = "memento-card-difficulties";
const activityStorageKey = "memento-review-activity";
const exportFormat = "memento-user-data";
const exportVersion = 1;
const difficultyWeights = { hard: 3, medium: 2, easy: 1 };
const difficultySortOrder = { easy: 0, medium: 1, hard: 2, unrated: 3 };
const difficultyLabels = { hard: "Difficile", medium: "Moyen", easy: "Facile" };
const availableCollectionImages = ["img/0.png", "img/1.png", "img/2.png"];
const accentColorValues = {
  black: "#171717",
  blue: "#2563eb",
  green: "#16803c",
  yellow: "#eab308",
  magenta: "#d946ef",
  cyan: "#06b6d4",
};
const categoryAccents = {
  LANGUES: "blue",
  GEOGRAPHIE: "green",
  HISTOIRE: "yellow",
  SCIENCES: "cyan",
  DEVELOPPEMENT: "magenta",
};
let editedCardIndex = null;
let editedCollectionId = null;

const collections = {
  "anglais-quotidien": {
    title: "Anglais quotidien",
    category: "LANGUES",
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

const libraryView = document.querySelector("#collections");
const collectionView = document.querySelector("#collection-view");
const statsView = document.querySelector("#stats");
const navLinks = document.querySelectorAll(".desktop-nav [data-nav]");
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

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateImport(data) {
  if (
    !isRecord(data) ||
    data.format !== exportFormat ||
    data.version !== exportVersion ||
    !isRecord(data.data)
  )
    return false;

  const {
    collections: metadata,
    cards,
    deletedCollections,
    difficulties,
    reviewActivity,
  } = data.data;
  if (
    !isRecord(metadata) ||
    !isRecord(cards) ||
    !Array.isArray(deletedCollections) ||
    !isRecord(difficulties) ||
    !Array.isArray(reviewActivity)
  )
    return false;

  const metadataIsValid = Object.values(metadata).every(
    (collection) =>
      isRecord(collection) &&
      typeof collection.title === "string" &&
      typeof collection.category === "string" &&
      availableCollectionImages.includes(collection.image),
  );
  const cardsAreValid = Object.values(cards).every(
    (collectionCards) =>
      Array.isArray(collectionCards) &&
      collectionCards.every(
        (card) =>
          Array.isArray(card) &&
          card.length === 2 &&
          card.every((side) => typeof side === "string"),
      ),
  );
  const difficultiesAreValid = Object.values(difficulties).every(
    (collectionDifficulties) =>
      isRecord(collectionDifficulties) &&
      Object.values(collectionDifficulties).every((difficulty) =>
        ["easy", "medium", "hard"].includes(difficulty),
      ),
  );
  return (
    [
      ...Object.keys(metadata),
      ...Object.keys(cards),
      ...Object.keys(difficulties),
    ].every((id) => /^[a-z0-9][a-z0-9-]*$/.test(id)) &&
    metadataIsValid &&
    cardsAreValid &&
    deletedCollections.every(
      (id) => typeof id === "string" && /^[a-z0-9][a-z0-9-]*$/.test(id),
    ) &&
    difficultiesAreValid &&
    reviewActivity.every((timestamp) => Number.isFinite(timestamp))
  );
}

function exportUserData() {
  const deletedCollections = readStorage(deletedCollectionsStorageKey);
  const reviewActivity = readStorage(activityStorageKey);
  const payload = {
    format: exportFormat,
    version: exportVersion,
    exportedAt: new Date().toISOString(),
    data: {
      collections: readStorage(collectionsStorageKey),
      cards: readStorage(storageKey),
      deletedCollections: Array.isArray(deletedCollections)
        ? deletedCollections
        : [],
      difficulties: readStorage(difficultyStorageKey),
      reviewActivity: Array.isArray(reviewActivity) ? reviewActivity : [],
    },
  };
  const file = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `memento-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
  showToast("Données exportées avec succès");
}

async function importUserData(file) {
  try {
    const payload = JSON.parse(await file.text());
    if (!validateImport(payload)) throw new Error("invalid-data");
    if (
      !window.confirm(
        "Importer ce fichier et remplacer vos données actuelles ?",
      )
    )
      return;
    const importedData = payload.data;
    writeStorage(collectionsStorageKey, importedData.collections);
    writeStorage(storageKey, importedData.cards);
    writeStorage(deletedCollectionsStorageKey, importedData.deletedCollections);
    writeStorage(difficultyStorageKey, importedData.difficulties);
    writeStorage(activityStorageKey, importedData.reviewActivity);
    window.location.reload();
  } catch {
    showToast("Fichier invalide : import impossible");
  } finally {
    importFileInput.value = "";
  }
}

function loadSavedCollections() {
  const savedCollections = readStorage(collectionsStorageKey);
  Object.entries(savedCollections).forEach(([id, collection]) => {
    if (!collection || typeof collection.title !== "string") return;
    collections[id] = {
      title: collection.title,
      category: collection.category || "PERSONNEL",
      image: availableCollectionImages.includes(collection.image)
        ? collection.image
        : "img/0.png",
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

function getCollectionAccent(category) {
  const normalizedCategory = category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  return categoryAccents[normalizedCategory] || "black";
}

function createCollectionCard(id, collection) {
  const card = document.createElement("a");
  card.className = "collection-card";
  card.dataset.collectionId = id;
  card.href = `#collection/${id}`;
  card.setAttribute("aria-label", `Ouvrir la collection ${collection.title}`);
  card.style.setProperty(
    "--card-accent",
    accentColorValues[getCollectionAccent(collection.category)],
  );
  card.innerHTML =
    '<div class="card-top"><img class="collection-image" src="img/0.png" alt=""></div><div class="card-content"><span class="tag"></span><h3></h3><div class="card-footer"><span></span></div></div>';
  card.querySelector(".tag").textContent = collection.category;
  card.querySelector(".collection-image").src = collection.image || "img/0.png";
  card.querySelector("h3").textContent = collection.title;
  card.querySelector(".card-footer span").textContent = formatCardCount(
    collection.cards.length,
  );
  return card;
}

function saveCollectionMetadata(id) {
  const savedCollections = readStorage(collectionsStorageKey);
  const { title, category, image } = collections[id];
  savedCollections[id] = { title, category, image };
  writeStorage(collectionsStorageKey, savedCollections);
  const deletedCollections = readStorage(deletedCollectionsStorageKey);
  if (Array.isArray(deletedCollections) && deletedCollections.includes(id)) {
    writeStorage(
      deletedCollectionsStorageKey,
      deletedCollections.filter((deletedId) => deletedId !== id),
    );
  }
}

function openCollectionModal(id = null) {
  editedCollectionId = id;
  form.reset();
  const isEditing = Boolean(id && collections[id]);
  collectionModalTitle.textContent = isEditing
    ? "Modifier la collection"
    : "Créer une collection";
  collectionModalSubmit.textContent = isEditing
    ? "Enregistrer les modifications"
    : "Créer ma collection";
  if (isEditing) {
    form.elements.name.value = collections[id].title;
    form.elements.category.value = collections[id].category;
    form.elements.image.value = collections[id].image || "img/0.png";
  }
  modal.showModal();
  setTimeout(() => form.elements.name.focus(), 50);
}

function openCardModal(index = null) {
  editedCardIndex = index;
  cardForm.reset();
  const isEditing = index !== null;

  cardModalTitle.textContent = isEditing
    ? "Modifier la carte"
    : "Ajouter une carte";
  cardModalDescription.textContent = isEditing
    ? "Modifiez la question et la réponse de cette carte."
    : "Renseignez le recto et le verso de votre nouvelle carte.";
  cardModalSubmit.textContent = isEditing
    ? "Enregistrer les modifications"
    : "Ajouter la carte";

  if (isEditing) {
    const [question, answer] = collections[activeCollectionId].cards[index];
    cardForm.elements.question.value = question;
    cardForm.elements.answer.value = answer;
  }

  cardModal.showModal();
  setTimeout(() => cardForm.elements.question.focus(), 50);
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
  writeStorage(collectionsStorageKey, savedCollections);
  const savedCards = readStorage(storageKey);
  delete savedCards[id];
  writeStorage(storageKey, savedCards);
  const difficulties = readStorage(difficultyStorageKey);
  delete difficulties[id];
  writeStorage(difficultyStorageKey, difficulties);
  const deletedCollections = readStorage(deletedCollectionsStorageKey);
  const deletedIds = Array.isArray(deletedCollections)
    ? deletedCollections
    : [];
  if (!deletedIds.includes(id)) deletedIds.push(id);
  writeStorage(deletedCollectionsStorageKey, deletedIds);
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

function saveCards() {
  const cards = Object.fromEntries(
    Object.entries(collections).map(([id, collection]) => [
      id,
      collection.cards,
    ]),
  );
  writeStorage(storageKey, cards);
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
  writeStorage(difficultyStorageKey, difficulties);
}

function recordReview() {
  const activity = readStorage(activityStorageKey);
  const reviews = Array.isArray(activity) ? activity : [];
  reviews.push(Date.now());
  writeStorage(
    activityStorageKey,
    reviews.filter((timestamp) => timestamp > Date.now() - 90 * 86400000),
  );
}

function getStats() {
  const difficulties = getDifficulties();
  const counts = { easy: 0, medium: 0, hard: 0 };
  let totalCards = 0;
  const collectionStats = Object.entries(collections).map(([id, collection]) => {
    const saved = difficulties[id] || {};
    const difficultyCounts = { easy: 0, medium: 0, hard: 0, unrated: 0 };
    let reviewed = 0;
    collection.cards.forEach((card) => {
      const difficulty = saved[getCardKey(card)];
      if (counts[difficulty] !== undefined) {
        counts[difficulty] += 1;
        difficultyCounts[difficulty] += 1;
        reviewed += 1;
      } else {
        difficultyCounts.unrated += 1;
      }
    });
    totalCards += collection.cards.length;
    return { id, collection, reviewed, difficultyCounts };
  });
  return {
    counts,
    reviewed: counts.easy + counts.medium + counts.hard,
    totalCards,
    collectionStats,
  };
}

function renderStats() {
  const { counts, reviewed, totalCards, collectionStats } = getStats();
  const masteredCards = counts.easy;
  const unratedCards = totalCards - reviewed;
  // totalCards inclut aussi les cartes sans difficulté enregistrée (non évaluées).
  const masteredRate = totalCards ? Math.round((masteredCards / totalCards) * 100) : 0;
  const unratedRate = totalCards ? Math.round((unratedCards / totalCards) * 100) : 0;
  document.querySelector('[data-stat="unrated"]').textContent = unratedCards;
  document.querySelector('[data-stat="unrated-detail"]').textContent = `${unratedRate}% des cartes`;
  document.querySelector('[data-stat="mastered"]').textContent = masteredCards;
  document.querySelector('[data-stat="mastered-detail"]').textContent = `${masteredRate} % au total`;
  document.querySelector('[data-stat="collections"]').textContent = collectionStats.length;
  document.querySelector('[data-stat="collections-detail"]').textContent = `${formatCardCount(totalCards)} au total`;
  const list = document.querySelector(".collection-progress-list");
  if (!collectionStats.length) {
    const empty = document.createElement("p");
    empty.className = "stats-empty";
    empty.textContent = "Créez une collection pour commencer à suivre votre progression.";
    list.replaceChildren(empty);
  } else {
    list.replaceChildren(
      ...collectionStats.map(
        ({ collection, difficultyCounts }) => {
          const item = document.createElement("div");
          item.className = "collection-progress-item";
          item.innerHTML = '<div class="progress-collection"><img alt=""><div><strong></strong><span></span></div></div><div class="progress-track" role="img"></div>';
          item.querySelector("img").src = collection.image || "img/0.png";
          item.querySelector("strong").textContent = collection.title;
          item.querySelector(".progress-collection span").textContent =
            collection.category;
          const progressTrack = item.querySelector(".progress-track");
          const difficultyDescriptions = {
            easy: `${difficultyCounts.easy} faciles`,
            medium: `${difficultyCounts.medium} moyennes`,
            hard: `${difficultyCounts.hard} difficiles`,
            unrated: `${difficultyCounts.unrated} non évaluées`,
          };
          progressTrack.setAttribute(
            "aria-label",
            `${collection.title} : ${Object.values(difficultyDescriptions).join(", ")}`,
          );
          Object.entries(difficultyCounts).forEach(([difficulty, count]) => {
            const segment = document.createElement("span");
            segment.className = `progress-segment progress-${difficulty}`;
            segment.style.width = collection.cards.length
              ? `${(count / collection.cards.length) * 100}%`
              : "0%";
            segment.title = difficultyDescriptions[difficulty];
            progressTrack.append(segment);
          });
          return item;
        },
      ),
    );
  }
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
  studyProgressText.textContent = `Carte ${studyIndex + 1} / ${studyCards.length}`;
  studyProgress.setAttribute("aria-valuemax", String(studyCards.length));
  studyProgress.setAttribute("aria-valuenow", String(studyIndex + 1));
  studyProgress.querySelector("span").style.width = `${progress}%`;
  studySide.textContent = answerIsVisible ? "RÉPONSE" : "QUESTION";
  studyCardText.textContent = answerIsVisible ? answer : question;
  studyFlipHelp.textContent = answerIsVisible
    ? "Revoir la question"
    : "Afficher la réponse";
  studyCard.classList.toggle("answer-visible", answerIsVisible);
  studyCard.setAttribute(
    "aria-label",
    answerIsVisible ? "Afficher la question" : "Afficher la réponse",
  );
  studyRating.disabled = !answerIsVisible;
  studyRating.classList.toggle("awaiting-rating", answerIsVisible);
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

function setFlashcardFlipped(card, cardNumber, flipped) {
  card.classList.toggle("flipped", flipped);
  card.setAttribute("aria-pressed", String(flipped));
  card.setAttribute(
    "aria-label",
    `Carte ${cardNumber} : ${
      flipped ? "afficher la question" : "afficher la réponse"
    }`,
  );
}

function toggleFlashcard(card) {
  const cardNumber = Number(card.dataset.cardIndex) + 1;
  const flipped = !card.classList.contains("flipped");

  if (flipped) {
    flashcardList
      .querySelectorAll(".flashcard.flipped")
      .forEach((otherCard) => {
        if (otherCard !== card) {
          setFlashcardFlipped(
            otherCard,
            Number(otherCard.dataset.cardIndex) + 1,
            false,
          );
        }
      });
  }

  setFlashcardFlipped(card, cardNumber, flipped);
}

function createFlashcard([question, answer], index) {
  const cardKey = getCardKey([question, answer]);
  const difficulty = getDifficulties()[activeCollectionId]?.[cardKey];
  const card = document.createElement("article");
  card.className = "flashcard";
  card.dataset.cardKey = cardKey;
  card.dataset.cardIndex = String(index);
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-pressed", "false");
  card.setAttribute("aria-label", `Carte ${index + 1} : afficher la réponse`);
  card.innerHTML = `<button class="edit-card" type="button" aria-label="Modifier la carte ${index + 1}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m4 20 4.2-1 10.9-10.9a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z"></path><path d="m14.8 6.4 3 3"></path></svg></button><button class="delete-card" type="button" aria-label="Supprimer la carte ${index + 1}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"></path></svg></button><span class="flashcard-meta"><span class="difficulty-badge"></span></span><span class="flashcard-text flashcard-question"></span><span class="flashcard-text flashcard-answer"></span>`;
  card.querySelector(".flashcard-question").textContent = question;
  card.querySelector(".flashcard-answer").textContent = answer;
  setDifficultyBadge(card.querySelector(".difficulty-badge"), difficulty);

  return card;
}

function renderRoute() {
  const isStatsRoute = window.location.hash === "#stats";
  const match = window.location.hash.match(/^#collection\/(.+)$/);
  const collection = match ? collections[match[1]] : null;
  activeCollectionId = collection ? match[1] : null;
  document.body.dataset.accent = collection
    ? getCollectionAccent(collection.category)
    : "black";

  libraryView.hidden = Boolean(collection) || isStatsRoute;
  collectionView.hidden = !collection;
  statsView.hidden = !isStatsRoute;
  navLinks.forEach((link) =>
    link.classList.toggle(
      "active",
      link.dataset.nav === (isStatsRoute ? "stats" : "collections"),
    ),
  );
  if (isStatsRoute) {
    renderStats();
    document.title = "Statistiques — Memento";
    window.scrollTo(0, 0);
    return;
  }
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

  detailTitle.textContent = collection.title;
  detailCategory.textContent = collection.category;
  editCollectionButton.setAttribute(
    "aria-label",
    `Modifier la collection ${collection.title}`,
  );
  deleteCollectionButton.setAttribute(
    "aria-label",
    `Supprimer la collection ${collection.title}`,
  );
  const cardCount = collection.cards.length;
  detailCount.textContent = formatCardCount(cardCount);
  detailImage.src = collection.image || "img/0.png";

  renderFlashcards(collection);
  document.title = `${collection.title} — Memento`;
  window.scrollTo(0, 0);
}

loadSavedCollections();
loadDeletedCollections();
loadSavedCards();
renderCollectionCards();
window.addEventListener("hashchange", renderRoute);
renderRoute();

exportButton.addEventListener("click", exportUserData);
importButton.addEventListener("click", () => importFileInput.click());
importFileInput.addEventListener("change", () => {
  const [file] = importFileInput.files;
  if (file) importUserData(file);
});

collectionStudyButton.addEventListener("click", startStudySession);

studyCard.addEventListener("click", toggleStudyCard);
document.querySelectorAll(".difficulty-button").forEach((button) =>
  button.addEventListener("click", () => {
    studyRating.classList.remove("awaiting-rating");
    const currentCard = studyCards[studyIndex];
    const difficulty = button.dataset.difficulty;
    saveDifficulty(currentCard.key, difficulty);
    recordReview();
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
  .addEventListener("click", () => openCardModal());

flashcardList.addEventListener("click", (event) => {
  const card = event.target.closest(".flashcard");
  if (!card) return;

  const cardIndex = Number(card.dataset.cardIndex);
  if (event.target.closest(".edit-card")) {
    openCardModal(cardIndex);
    return;
  }
  if (event.target.closest(".delete-card")) {
    if (!window.confirm("Supprimer cette carte ?")) return;
    collections[activeCollectionId].cards.splice(cardIndex, 1);
    saveCards();
    renderRoute();
    showToast("Carte supprimée");
    return;
  }

  toggleFlashcard(card);
});

flashcardList.addEventListener("keydown", (event) => {
  const card = event.target.closest(".flashcard");
  if (
    card &&
    event.target === card &&
    (event.key === "Enter" || event.key === " ")
  ) {
    event.preventDefault();
    toggleFlashcard(card);
  }
});

editCollectionButton.addEventListener("click", () => {
  if (activeCollectionId) openCollectionModal(activeCollectionId);
});

deleteCollectionButton.addEventListener("click", () => {
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
      writeStorage(difficultyStorageKey, difficulties);
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

document
  .querySelector("[data-open-modal]")
  .addEventListener("click", () => openCollectionModal());

form.addEventListener("submit", (event) => {
  const submitter = event.submitter;
  if (submitter?.value === "cancel") return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const title = data.get("name").trim();
  const category = data.get("category");
  const requestedImage = data.get("image");
  const image = availableCollectionImages.includes(requestedImage)
    ? requestedImage
    : "img/0.png";
  const isEditing = Boolean(editedCollectionId);
  const id = isEditing ? editedCollectionId : createCollectionId(title);
  if (isEditing) {
    collections[id].title = title;
    collections[id].category = category;
    collections[id].image = image;
  } else {
    collections[id] = {
      title,
      category,
      image,
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
