import { collections } from "./data.js";
import { calculateNextSchedule, isCardDue } from "./scheduler.js";

const select = (selector, parent = document) => parent.querySelector(selector);

const collectionModal = select(".modal");
const collectionForm = select("#collection-form");
const cardModal = select(".card-modal");
const cardForm = select("#card-form");
const studyModal = select(".study-modal");
const collectionGrid = select(".collection-grid");
const collectionModalTitle = select("#collection-modal-title");
const collectionModalSubmit = select(
  ".collection-modal-submit",
);
const cardModalTitle = select("#card-modal-title");
const cardModalDescription = select(".card-modal-description");
const cardModalSubmit = select(".card-modal-submit");
const flashcardList = select(".flashcard-list");
const toast = select(".toast");
const studyCard = select(".study-card");
const studyProgressText = select(".study-progress-text");
const studyProgress = select(".study-progress");
const studyProgressBar = select("span", studyProgress);
const studyTitle = select("#study-title");
const studySide = select(".study-side");
const studyCardText = select(".study-card-text");
const studyFlipHelp = select(".study-flip-help");
const studyRating = select(".study-rating");
const collectionStudyButton = select(
  ".collection-study-button",
);
const detailTitle = select(".detail-title");
const detailCategory = select(".detail-category");
const detailCount = select(".detail-count");
const detailHeader = select(".detail-header");
const detailContent = select(".detail-content");
const detailImage = select(".detail-icon .collection-image");
const editCollectionButton = select(".edit-detail-collection");
const deleteCollectionButton = select(
  ".delete-detail-collection",
);
const importButtons = document.querySelectorAll(".import-button");
const exportButtons = document.querySelectorAll(".export-button");
const importFileInput = select(".import-file-input");
const storageKeys = {
  cards: "memento-custom-cards",
  collections: "memento-custom-collections",
  difficulties: "memento-card-difficulties",
  schedules: "memento-card-schedules",
  reviewActivity: "memento-review-activity",
};
const exportFormat = "memento-user-data";
const exportVersion = 2;
const previousExportVersion = 1;
const difficultySortOrder = { unrated: 0, easy: 1, medium: 2, hard: 3 };
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

// Keep the previous id as a fallback while an older app shell may still be
// served by the browser or the GitHub Pages CDN during an update.
const libraryView = document.querySelector("#collections-view, #collections");
const collectionView = document.querySelector("#collection-view");
const statsView = document.querySelector("#stats");
const navLinks = document.querySelectorAll("[data-nav]");
let activeCollectionId = null;
let studyCards = [];
let studyIndex = 0;
let answerIsVisible = false;

const detailContentObserver = new ResizeObserver(() => {
  const contentHeight = detailContent.getBoundingClientRect().height;
  if (contentHeight > 0) {
    detailHeader.style.setProperty("--detail-column", `${contentHeight}px`);
  }
});

detailContentObserver.observe(detailContent);

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
    ![previousExportVersion, exportVersion].includes(data.version) ||
    !isRecord(data.data)
  )
    return false;

  const {
    collections: metadata,
    cards,
    difficulties,
    schedules = {},
    reviewActivity,
  } = data.data;
  if (
    !isRecord(metadata) ||
    !isRecord(cards) ||
    !isRecord(difficulties) ||
    !isRecord(schedules) ||
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
  const schedulesAreValid = Object.values(schedules).every(
    (collectionSchedules) =>
      isRecord(collectionSchedules) &&
      Object.values(collectionSchedules).every(
        (schedule) =>
          isRecord(schedule) &&
          Number.isFinite(schedule.dueAt) &&
          Number.isFinite(schedule.intervalDays) &&
          schedule.intervalDays >= 0 &&
          Number.isFinite(schedule.lastReviewedAt),
      ),
  );
  return (
    [
      ...Object.keys(metadata),
      ...Object.keys(cards),
      ...Object.keys(difficulties),
      ...Object.keys(schedules),
    ].every((id) => /^[a-z0-9][a-z0-9-]*$/.test(id)) &&
    metadataIsValid &&
    cardsAreValid &&
    difficultiesAreValid &&
    schedulesAreValid &&
    reviewActivity.every((timestamp) => Number.isFinite(timestamp))
  );
}

function getExportedCollections() {
  return Object.fromEntries(
    Object.entries(collections).map(([id, collection]) => [
      id,
      {
        title: collection.title,
        category: collection.category,
        image: collection.image,
      },
    ]),
  );
}

function getExportedCards() {
  return Object.fromEntries(
    Object.entries(collections).map(([id, collection]) => [
      id,
      collection.cards,
    ]),
  );
}

function exportUserData() {
  const reviewActivity = readStorage(storageKeys.reviewActivity);
  const payload = {
    format: exportFormat,
    version: exportVersion,
    exportedAt: new Date().toISOString(),
    data: {
      collections: readStorage(storageKeys.collections),
      cards: readStorage(storageKeys.cards),
      difficulties: readStorage(storageKeys.difficulties),
      schedules: readStorage(storageKeys.schedules),
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
    writeStorage(storageKeys.collections, importedData.collections);
    writeStorage(storageKeys.cards, importedData.cards);
    writeStorage(storageKeys.difficulties, importedData.difficulties);
    writeStorage(storageKeys.schedules, importedData.schedules || {});
    writeStorage(storageKeys.reviewActivity, importedData.reviewActivity);
    window.location.reload();
  } catch {
    showToast("Fichier invalide : import impossible");
  } finally {
    importFileInput.value = "";
  }
}

function loadSavedCollections() {
  const savedCollections = readStorage(storageKeys.collections);
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

function loadSavedCards() {
  const savedCards = readStorage(storageKeys.cards);
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

function getCollectionImages(category, variant = "card") {
  const directory =
    categorySettings[normalizeCategory(category || "LANGUES")]?.directory ||
    categorySettings.LANGUES.directory;
  return collectionImageNames.map(
    (name) => `img/collection-${variant}/${directory}_${name}`,
  );
}

function getCollectionImage(image, category, variant = "card") {
  const categoryImages = getCollectionImages(category, variant);
  if (categoryImages.includes(image)) return image;

  // Conserve le choix des utilisateurs ayant enregistré une ancienne URL
  // (img/0.png ou l'ancien format avec sous-dossier, par exemple) tout en la
  // replaçant dans la bonne catégorie et le format demandé.
  const imageName = image?.split("/").pop();
  return (
    categoryImages.find((candidate) => candidate.endsWith(`_${imageName}`)) ||
    categoryImages[0]
  );
}

function updateCollectionImage(imageElement, source) {
  imageElement.hidden = true;

  const revealCurrentImage = () => {
    if (imageElement.getAttribute("src") !== source) return;
    imageElement.hidden = false;
  };

  imageElement.onload = revealCurrentImage;
  imageElement.onerror = () => {
    if (imageElement.getAttribute("src") === source) imageElement.hidden = true;
  };
  imageElement.src = source;

  // L'événement load a parfois déjà eu lieu lorsque l'image vient du cache.
  if (imageElement.complete && imageElement.naturalWidth > 0) {
    revealCurrentImage();
  }
}

function renderCollectionImageOptions(category, selectedImage = null) {
  const imageOptions = collectionForm.querySelector(".image-options");
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
    '<div class="card-top"><img class="collection-image" alt=""><span class="review-notification" aria-hidden="true"></span></div><div class="card-content"><span class="tag"></span><h3></h3><div class="card-footer"><span></span></div></div>';
  card.querySelector(".tag").textContent = collection.category;
  updateCollectionImage(
    card.querySelector(".collection-image"),
    getCollectionImage(collection.image, collection.category),
  );
  card.querySelector("h3").textContent = collection.title;
  card.querySelector(".card-footer span").textContent = formatCardCount(
    collection.cards.length,
  );
  updateCollectionCard(card, id, collection);
  return card;
}

function updateCollectionCard(card, id, collection) {
  const dueCount = getDueCards(collection, Date.now(), id).length;
  const notification = card.querySelector(".review-notification");
  notification.hidden = dueCount === 0;
  notification.textContent = dueCount > 99 ? "99+" : String(dueCount);
  notification.title = `${dueCount} ${
    dueCount === 1 ? "carte disponible" : "cartes disponibles"
  } à la révision`;
  card.setAttribute(
    "aria-label",
    `Ouvrir la collection ${collection.title}${
      dueCount
        ? `, ${dueCount} ${dueCount === 1 ? "carte disponible" : "cartes disponibles"} à la révision`
        : ""
    }`,
  );
}

function saveCollectionMetadata(id) {
  const savedCollections = readStorage(storageKeys.collections);
  const { title, category, image } = collections[id];
  savedCollections[id] = { title, category, image };
  writeStorage(storageKeys.collections, savedCollections);
}

function openCollectionModal(id = null) {
  editedCollectionId = id;
  collectionForm.reset();
  const isEditing = Boolean(id && collections[id]);
  collectionModalTitle.textContent = isEditing
    ? "Modifier la collection"
    : "Créer une collection";
  collectionModalSubmit.textContent = isEditing
    ? "Enregistrer les modifications"
    : "Créer ma collection";
  if (isEditing) {
    collectionForm.elements.name.value = collections[id].title;
    collectionForm.elements.category.value = collections[id].category;
  }
  renderCollectionImageOptions(
    collectionForm.elements.category.value,
    isEditing ? collections[id].image : null,
  );
  collectionModal.showModal();
  setTimeout(() => collectionForm.elements.name.focus(), 50);
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
  const savedCollections = readStorage(storageKeys.collections);
  delete savedCollections[id];
  writeStorage(storageKeys.collections, savedCollections);
  const savedCards = readStorage(storageKeys.cards);
  delete savedCards[id];
  writeStorage(storageKeys.cards, savedCards);
  const difficulties = readStorage(storageKeys.difficulties);
  delete difficulties[id];
  writeStorage(storageKeys.difficulties, difficulties);
  const schedules = readStorage(storageKeys.schedules);
  delete schedules[id];
  writeStorage(storageKeys.schedules, schedules);
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
  writeStorage(storageKeys.cards, cards);
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
  return readStorage(storageKeys.difficulties);
}

function getSchedules() {
  return readStorage(storageKeys.schedules);
}

function saveSchedule(cardKey, difficulty, reviewedAt = Date.now()) {
  const schedules = getSchedules();
  schedules[activeCollectionId] ||= {};
  const previousSchedule = schedules[activeCollectionId][cardKey];
  schedules[activeCollectionId][cardKey] = calculateNextSchedule(
    previousSchedule,
    difficulty,
    reviewedAt,
  );
  writeStorage(storageKeys.schedules, schedules);
}

function getDueCards(
  collection,
  now = Date.now(),
  collectionId = activeCollectionId,
) {
  const savedSchedules = getSchedules()[collectionId] || {};
  return collection.cards.filter((card) => {
    const schedule = savedSchedules[getCardKey(card)];
    return isCardDue(schedule, now);
  });
}

function saveDifficulty(cardKey, difficulty) {
  const difficulties = getDifficulties();
  difficulties[activeCollectionId] ||= {};
  difficulties[activeCollectionId][cardKey] = difficulty;
  writeStorage(storageKeys.difficulties, difficulties);
}

function recordReview() {
  const activity = readStorage(storageKeys.reviewActivity);
  const reviews = Array.isArray(activity) ? activity : [];
  reviews.push(Date.now());
  writeStorage(
    storageKeys.reviewActivity,
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
          item.innerHTML = '<div class="progress-collection"><div class="progress-collection-media" aria-hidden="true"><img class="collection-image" alt=""></div><div><strong></strong><span></span></div></div><div class="progress-track" role="img"></div>';
          item.querySelector("img").src = getCollectionImage(
            collection.image,
            collection.category,
          );
          item.querySelector("strong").textContent = collection.title;
          item.querySelector(".progress-collection span").textContent =
            `${collection.category} · ${formatCardCount(collection.cards.length)}`;
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
  studyProgressBar.style.width = `${progress}%`;
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
  const dueCards = getDueCards(collection);
  if (!dueCards.length) {
    showToast("Aucune carte à réviser pour le moment");
    return;
  }
  studyCards = shuffleCards(dueCards);
  studyIndex = 0;
  answerIsVisible = false;
  studyTitle.textContent = collection.title;
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
      const cardCollection = collections[collectionId];
      const count = cardCollection?.cards.length;
      if (count === undefined) return;
      card.querySelector(".card-footer span").textContent =
        formatCardCount(count);
      updateCollectionCard(card, collectionId, cardCollection);
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
  updateCollectionImage(
    detailImage,
    getCollectionImage(collection.image, collection.category, "header"),
  );

  renderFlashcards(collection);
  document.title = `${collection.title} — Memento`;
  window.scrollTo(0, 0);
}

loadSavedCollections();
loadSavedCards();
renderCollectionCards();
window.addEventListener("hashchange", renderRoute);
renderRoute();

exportButtons.forEach((button) =>
  button.addEventListener("click", exportUserData),
);
importButtons.forEach((button) =>
  button.addEventListener("click", () => importFileInput.click()),
);
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
    saveSchedule(currentCard.key, difficulty);
    recordReview();
    renderFlashcards(collections[activeCollectionId]);

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
    const cardKey = getCardKey(collections[activeCollectionId].cards[cardIndex]);
    collections[activeCollectionId].cards.splice(cardIndex, 1);
    [storageKeys.difficulties, storageKeys.schedules].forEach((storageKey) => {
      const savedData = readStorage(storageKey);
      if (savedData[activeCollectionId]) {
        delete savedData[activeCollectionId][cardKey];
        writeStorage(storageKey, savedData);
      }
    });
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
      writeStorage(storageKeys.difficulties, difficulties);
    }
    const schedules = getSchedules();
    const collectionSchedules = schedules[activeCollectionId];
    if (collectionSchedules?.[previousKey]) {
      collectionSchedules[getCardKey(updatedCard)] =
        collectionSchedules[previousKey];
      delete collectionSchedules[previousKey];
      writeStorage(storageKeys.schedules, schedules);
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

collectionForm.elements.category.addEventListener("change", (event) => {
  renderCollectionImageOptions(event.target.value);
});

collectionForm.addEventListener("submit", (event) => {
  const submitter = event.submitter;
  if (submitter?.value === "cancel") return;
  event.preventDefault();
  if (!collectionForm.reportValidity()) return;
  const data = new FormData(collectionForm);
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
  collectionModal.close();
  collectionForm.reset();
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
