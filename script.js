import { collections } from "./data.js";

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
const frenchCollator = new Intl.Collator("fr", { sensitivity: "base" });
const categorySettings = {
  LANGUES: { directory: "langues", accent: "purple", order: 0 },
  SCIENCES: { directory: "sciences", accent: "blue", order: 1 },
  GEOGRAPHIE: { directory: "geographie", accent: "green", order: 2 },
  HISTOIRE: { directory: "histoire", accent: "yellow", order: 3 },
  ART: { directory: "art", accent: "orange", order: 4 },
  INFORMATIQUE: { directory: "informatique", accent: "red", order: 5 },
};
const collectionImageNames = ["0.png", "1.png", "2.png"];
const collectionColorValues = {
  black: "#171717",
  purple: "#7c3aed",
  blue: "#2563eb",
  green: "#16803c",
  red: "#dc2626",
  yellow: "#eab308",
  orange: "#ea580c",
};
let editedCardIndex = null;
let editedCollectionId = null;

const adaptiveTextClasses = ["text-medium", "text-long", "text-extra-long"];

function adaptCardTextSize(element, text) {
  const textLength = text.trim().length;
  let sizeClass = "";

  if (textLength > 180) {
    sizeClass = "text-extra-long";
  } else if (textLength > 100) {
    sizeClass = "text-long";
  } else if (textLength > 55) {
    sizeClass = "text-medium";
  }

  element.classList.remove(...adaptiveTextClasses);
  if (sizeClass) element.classList.add(sizeClass);
}

const libraryView = document.querySelector("#collections-view");
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
      (collection.image === undefined || typeof collection.image === "string"),
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
    // JSON.parse ne tolère pas le BOM ajouté par certains éditeurs Windows.
    const fileContents = (await file.text()).replace(/^\uFEFF/, "");
    const payload = JSON.parse(fileContents);
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
    const category = renameLegacyCategory(collection.category);
    collections[id] = {
      title: collection.title,
      category,
      image: getCollectionImage(collection.image, category),
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
  const normalizedCategory = normalizeCategory(category);
  return categorySettings[normalizedCategory]?.accent || "black";
}

function normalizeCategory(category) {
  return category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function renameLegacyCategory(category) {
  const normalizedCategory = normalizeCategory(category || "ART");
  if (normalizedCategory === "PERSONNEL") return "ART";
  if (normalizedCategory === "DEVELOPPEMENT") return "INFORMATIQUE";
  return category || "ART";
}

function getCollectionImages(category) {
  const directory =
    categorySettings[normalizeCategory(category || "LANGUES")]?.directory ||
    categorySettings.LANGUES.directory;
  return collectionImageNames.map((name) => `img/${directory}/${name}`);
}

function getCollectionImage(image, category) {
  const categoryImages = getCollectionImages(category);
  if (categoryImages.includes(image)) return image;

  // Conserve le choix des utilisateurs ayant enregistré une ancienne URL
  // (img/0.png, par exemple) tout en la replaçant dans la bonne catégorie.
  const imageName = image?.split("/").pop();
  return (
    categoryImages.find((candidate) => candidate.endsWith(`/${imageName}`)) ||
    categoryImages[0]
  );
}

function renderCollectionImageOptions(category, selectedImage = null) {
  const imageOptions = form.querySelector(".image-options");
  const categoryImages = getCollectionImages(category);
  const image = getCollectionImage(selectedImage, category);
  imageOptions.replaceChildren(
    ...categoryImages.map((source, index) => {
      const label = document.createElement("label");
      label.className = "image-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "image";
      input.value = source;
      input.checked = source === image;

      const preview = document.createElement("img");
      preview.src = source;
      preview.alt = `Illustration ${index + 1}`;
      label.append(input, preview);
      return label;
    }),
  );
}

function createCollectionCard(id, collection) {
  const card = document.createElement("a");
  card.className = "collection-card";
  card.dataset.collectionId = id;
  card.href = `#collection/${id}`;
  card.setAttribute("aria-label", `Ouvrir la collection ${collection.title}`);
  card.style.setProperty(
    "--card-accent",
    collectionColorValues[
      getCollectionAccent(collection.category)
    ],
  );
  card.innerHTML =
    '<div class="card-top"><img class="collection-image" alt=""></div><div class="card-content"><span class="tag"></span><h3></h3><div class="card-footer"><span></span></div></div>';
  card.querySelector(".tag").textContent = collection.category;
  card.querySelector(".collection-image").src = getCollectionImage(
    collection.image,
    collection.category,
  );
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
  }
  renderCollectionImageOptions(
    form.elements.category.value,
    isEditing ? collections[id].image : null,
  );
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

function getOrderedCollections() {
  return Object.entries(collections).sort(([, first], [, second]) => {
    const firstCategoryOrder =
      categorySettings[normalizeCategory(first.category)]?.order ?? Infinity;
    const secondCategoryOrder =
      categorySettings[normalizeCategory(second.category)]?.order ?? Infinity;
    const categoryComparison = firstCategoryOrder - secondCategoryOrder;
    return (
      categoryComparison || frenchCollator.compare(first.title, second.title)
    );
  });
}

function renderCollectionCards() {
  collectionGrid
    .querySelectorAll(".collection-theme")
    .forEach((theme) => theme.remove());

  const collectionsByCategory = new Map();
  getOrderedCollections().forEach(([id, collection]) => {
    if (!collectionsByCategory.has(collection.category)) {
      collectionsByCategory.set(collection.category, []);
    }
    collectionsByCategory.get(collection.category).push([id, collection]);
  });

  collectionsByCategory.forEach((categoryCollections, category) => {
    const theme = document.createElement("section");
    theme.className = "collection-theme";
    theme.innerHTML = '<div class="collection-slider" tabindex="0"></div>';

    const slider = theme.querySelector(".collection-slider");
    slider.setAttribute(
      "aria-label",
      `Collections du thème ${category}. Faites défiler horizontalement pour voir les collections restantes.`,
    );
    categoryCollections.forEach(([id, collection]) => {
      slider.append(createCollectionCard(id, collection));
    });
    collectionGrid.append(theme);
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
  const collectionStats = getOrderedCollections().map(([id, collection]) => {
    const saved = difficulties[id] || {};
    const difficultyCounts = { easy: 0, medium: 0, hard: 0, unrated: 0 };
    collection.cards.forEach((card) => {
      const difficulty = saved[getCardKey(card)];
      if (counts[difficulty] !== undefined) {
        counts[difficulty] += 1;
        difficultyCounts[difficulty] += 1;
      } else {
        difficultyCounts.unrated += 1;
      }
    });
    totalCards += collection.cards.length;
    return { collection, difficultyCounts };
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
  const masteredRate = totalCards
    ? Math.round((masteredCards / totalCards) * 100)
    : 0;
  const unratedRate = totalCards
    ? Math.round((unratedCards / totalCards) * 100)
    : 0;
  const stats = {
    unrated: unratedCards,
    "unrated-detail": `${unratedRate}% des cartes`,
    mastered: masteredCards,
    "mastered-detail": `${masteredRate} % au total`,
    collections: collectionStats.length,
    "collections-detail": `${formatCardCount(totalCards)} au total`,
  };
  Object.entries(stats).forEach(([name, value]) => {
    document.querySelector(`[data-stat="${name}"]`).textContent = value;
  });
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
          item.querySelector("img").src = getCollectionImage(
            collection.image,
            collection.category,
          );
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
  const visibleText = answerIsVisible ? answer : question;
  studyCardText.textContent = visibleText;
  adaptCardTextSize(studyCardText, visibleText);
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
  const questionElement = card.querySelector(".flashcard-question");
  const answerElement = card.querySelector(".flashcard-answer");
  questionElement.textContent = question;
  answerElement.textContent = answer;
  adaptCardTextSize(questionElement, question);
  adaptCardTextSize(answerElement, answer);
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
  detailImage.src = getCollectionImage(collection.image, collection.category);

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

form.elements.category.addEventListener("change", (event) => {
  renderCollectionImageOptions(event.target.value);
});

form.addEventListener("submit", (event) => {
  const submitter = event.submitter;
  if (submitter?.value === "cancel") return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const title = data.get("name").trim();
  const category = data.get("category");
  const requestedImage = data.get("image");
  const image = getCollectionImage(requestedImage, category);
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("Impossible d’enregistrer le service worker Memento.", error);
    });
  });
}
