import { getLetterConfig } from "../../../data/words/words.js";

const THEME_STORAGE_KEY = "logoped-games-theme";

const getPreferredTheme = () => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const getSunIcon = () => `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 4.5a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1Zm6.364 2.136a1 1 0 0 1 1.414-1.414l1.061 1.06a1 1 0 0 1-1.414 1.415l-1.06-1.061ZM18.5 12a6.5 6.5 0 1 1-13.001 0A6.5 6.5 0 0 1 18.5 12Zm-6.5-4.5a4.5 4.5 0 1 0 .001 9.001A4.5 4.5 0 0 0 12 7.5ZM4.5 13H3a1 1 0 1 1 0-2h1.5a1 1 0 1 1 0 2Zm18 0H21a1 1 0 1 1 0-2h1.5a1 1 0 1 1 0 2Zm-2.66 7.247a1 1 0 0 1 0 1.414l-1.06 1.061a1 1 0 0 1-1.414-1.415l1.06-1.06a1 1 0 0 1 1.414 0ZM12 21.5a1 1 0 0 1 1 1V24a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1Zm-6.364-2.136a1 1 0 0 1 0 1.414l-1.06 1.061A1 1 0 0 1 3.162 20.1l1.06-1.06a1 1 0 0 1 1.414 0ZM4.5 4.5a1 1 0 0 1 1.414-1.414l1.06 1.06A1 1 0 1 1 5.56 5.561L4.5 4.5Z"></path>
  </svg>
`;

const getMoonIcon = () => `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M21.752 15.002a1 1 0 0 0-1.077-1.332 7 7 0 0 1-6.345-11.984A1 1 0 0 0 13.6.8a9 9 0 1 0 9.6 14.401 1 1 0 0 0-1.448-.199Z"></path>
  </svg>
`;

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) {
    return;
  }
  const icon = theme === "dark" ? getMoonIcon() : getSunIcon();
  const label = theme === "dark" ? "Темна тема" : "Світла тема";
  toggle.setAttribute("aria-label", label);
  toggle.innerHTML = `${icon}<span>${label}</span>`;
};

const saveTheme = (theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

const initThemeToggle = () => {
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) {
    return;
  }
  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    saveTheme(next);
  });
};

const initMenuToggle = () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (!toggle || !nav) {
    return;
  }

  nav.classList.add("is-collapsible");
  nav.setAttribute("aria-hidden", "true");
  nav.setAttribute("inert", "");

  const openMenu = () => {
    toggle.classList.add("is-active");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Закрити меню");
    nav.classList.add("is-open");
    nav.setAttribute("aria-hidden", "false");
    nav.removeAttribute("inert");
  };

  const closeMenu = ({ skipFocus = true } = {}) => {
    if (!toggle.classList.contains("is-active")) {
      nav.setAttribute("aria-hidden", "true");
      nav.setAttribute("inert", "");
      return;
    }
    toggle.classList.remove("is-active");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Меню");
    nav.classList.remove("is-open");
    nav.setAttribute("aria-hidden", "true");
    nav.setAttribute("inert", "");
    if (!skipFocus) {
      toggle.focus();
    }
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const activator = event.target.closest("a, button");
    if (activator && activator.tagName.toLowerCase() === "a") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }
    if (toggle.getAttribute("aria-expanded") === "true") {
      closeMenu({ skipFocus: false });
    }
  });
};

const messageArea = document.querySelector(".message-area");

const showMessage = (text, duration = 2000) => {
  if (!messageArea) {
    return;
  }
  messageArea.textContent = text;
  messageArea.classList.add("show");
  window.setTimeout(() => {
    messageArea.classList.remove("show");
    messageArea.textContent = "";
  }, duration);
};

const shuffle = (array) => {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

const uid = (prefix = "id") => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const theme = getPreferredTheme();
applyTheme(theme);
initThemeToggle();
initMenuToggle();

const params = new URLSearchParams(window.location.search);
const letterParam = (params.get("letter") || "").toLowerCase();
const categoryParam = params.get("category");

const letterConfig = getLetterConfig(letterParam);
const categoryConfig = letterConfig?.categories?.[categoryParam];

const redirectToSelect = () => {
  window.location.replace("../../select/index.html");
};

if (!letterConfig || !categoryConfig) {
  redirectToSelect();
}

const gameSurface = document.querySelector("[data-game-surface]");
const freeInner = document.querySelector("[data-free-inner]");
const slotWrapper = document.querySelector("[data-slot-wrapper]");
const checkButton = document.querySelector("[data-check]");
const statusText = document.querySelector("[data-status]");
const questionPanel = document.querySelector("[data-question-panel]");
const questionTitle = document.querySelector("[data-question-title]");
const answersContainer = document.querySelector("[data-answers]");
const feedbackLabel = document.querySelector("[data-feedback]");
const quizActionBtn = document.querySelector("[data-quiz-action]");
const questionCounter = document.querySelector("[data-question-counter]");
const finalScreen = document.querySelector("[data-final-screen]");
const finalMessage = document.querySelector("[data-final-message]");
const finalScore = document.querySelector("[data-final-score]");
const replayBtn = document.querySelector("[data-replay]");
const menuBtn = document.querySelector("[data-menu]");
const backBtn = document.querySelector("[data-back]");

const correctWords = [...categoryConfig.words];

const POSITION_CATEGORIES = ["pochatok", "seredyna", "kinets"];

const collectDistractors = () => {
  const categoryEntries = Object.entries(letterConfig.categories);
  const isPositionMode = POSITION_CATEGORIES.includes(categoryParam);

  const allowedKeys = isPositionMode
    ? POSITION_CATEGORIES.filter((key) => key !== categoryParam)
    : categoryEntries.map(([key]) => key).filter((key) => key !== categoryParam);

  let pool = categoryEntries
    .filter(([key]) => allowedKeys.includes(key))
    .flatMap(([, value]) => value.words);

  if (pool.length < 4) {
    // Fallback to previous behaviour if the specialised pools are too small.
    pool = categoryEntries
      .filter(([key]) => key !== categoryParam)
      .flatMap(([, value]) => value.words);
  }

  const uniqueSet = new Set(pool.filter((word) => !correctWords.includes(word)));
  return Array.from(uniqueSet);
};

const distractors = collectDistractors();

if (distractors.length < 4) {
  showMessage("Для цієї категорії не вистачає слів. Оберіть іншу." , 3000);
  window.setTimeout(redirectToSelect, 3200);
  throw new Error("Недостатньо слів для гри");
}


let roundExtras = [];
let wagonItems = [];

const slots = [];
let phase = "build"; // build | quiz | finished
let dragging = null;
let quizQuestions = [];
let questionIndex = 0;
let quizScore = 0;
let memorySelection = new Set();
let audioCtx;

window.addEventListener("resize", () => {
  if (!freeInner) {
    return;
  }
  freeInner.querySelectorAll(".wagon").forEach((wagon) => {
    if (wagon.parentElement === freeInner) {
      restoreFreePosition(wagon);
    }
  });
});

const setSlotHover = (target) => {
  slots.forEach((slot) => {
    if (slot === target) {
      slot.classList.add("hover");
    } else {
      slot.classList.remove("hover");
    }
  });
};

const prepareRound = () => {
  roundExtras = shuffle(distractors).slice(0, 4);
  wagonItems = shuffle([
    ...correctWords.map((word) => ({ word, isCorrect: true })),
    ...roundExtras.map((word) => ({ word, isCorrect: false })),
  ]);
};

const initStatus = () => {
  const prefix = `Буква ${letterConfig.name}`;
  const suffix = categoryConfig.label;
  statusText.textContent = `${prefix}, тема — ${suffix}. Зберіть потяг.`;
};

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "svg"];

const buildImageSources = (word) => {
  const encodedWord = encodeURIComponent(word);
  const letterFolder = letterConfig.name.toLowerCase();
  // IMPORTANT: Use paths relative to the document (games/train/index.html)
  // Two levels up keeps us inside the repo on GitHub Pages (/gamelogo/...),
  // while three levels up would escape to the domain root and 404.
  const basePaths = [
    `../../images/words/${letterFolder}/${encodedWord}`,
    `../../images/words/${encodedWord}`,
  ];
  const sources = [];
  basePaths.forEach((base) => {
    IMAGE_EXTENSIONS.forEach((extension) => {
      sources.push(`${base}.${extension}`);
    });
  });
  return sources;
};

const ensureAudio = () => {
  if (audioCtx) {
    return audioCtx;
  }
  const Context = window.AudioContext || window.webkitAudioContext;
  if (Context) {
    audioCtx = new Context();
  }
  return audioCtx;
};

const playTone = (success) => {
  const context = ensureAudio();
  if (!context) {
    return;
  }
  if (context.state === "suspended") {
    context.resume().catch(() => {});
  }
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = success ? 880 : 220;
  gain.gain.value = 0.15;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.2);
};

const getFieldRect = () => freeInner?.getBoundingClientRect();

const clampToField = (left, top, width, height) => {
  const fieldRect = getFieldRect();
  if (!fieldRect) {
    return { left: 0, top: 0 };
  }
  const maxLeft = Math.max(0, fieldRect.width - width);
  const maxTop = Math.max(0, fieldRect.height - height);
  return {
    left: Math.min(Math.max(0, left), maxLeft),
    top: Math.min(Math.max(0, top), maxTop),
  };
};

const parseDimension = (value) => {
  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const setFreePosition = (wagon, left, top, size) => {
  if (!freeInner) {
    return;
  }
  const rect = size ?? wagon.getBoundingClientRect();
  const width = rect?.width || parseDimension(getComputedStyle(wagon).width);
  const height = rect?.height || parseDimension(getComputedStyle(wagon).height);
  const clamped = clampToField(left, top, width, height);
  wagon.dataset.freeX = String(clamped.left);
  wagon.dataset.freeY = String(clamped.top);
  wagon.style.position = "absolute";
  wagon.style.width = "";
  wagon.style.height = "";
  wagon.style.left = `${clamped.left}px`;
  wagon.style.top = `${clamped.top}px`;
  wagon.style.zIndex = "";
};

const restoreFreePosition = (wagon) => {
  if (wagon.dataset.freeX && wagon.dataset.freeY) {
    setFreePosition(wagon, Number.parseFloat(wagon.dataset.freeX), Number.parseFloat(wagon.dataset.freeY));
  } else {
    scatterWagon(wagon);
  }
};

const scatterWagon = (wagon) => {
  if (!freeInner) {
    return;
  }
  requestAnimationFrame(() => {
    const { clientWidth = 0, clientHeight = 0 } = freeInner;
    if (!clientWidth || !clientHeight) {
      window.setTimeout(() => scatterWagon(wagon), 60);
      return;
    }
    const wagonWidth = wagon.offsetWidth || 0;
    const wagonHeight = wagon.offsetHeight || 0;
    const maxX = Math.max(0, clientWidth - wagonWidth);
    const maxY = Math.max(0, clientHeight - wagonHeight);
    const others = Array.from(freeInner.querySelectorAll(".wagon"))
      .filter((other) => other !== wagon);
    const margin = 12;
    let attempt = 0;
    let left = 0;
    let top = 0;
    const overlaps = () =>
      others.some((other) => {
        const otherLeft = other.offsetLeft || 0;
        const otherTop = other.offsetTop || 0;
        const otherWidth = other.offsetWidth || 0;
        const otherHeight = other.offsetHeight || 0;
        const horizontalGap = left + wagonWidth + margin <= otherLeft || otherLeft + otherWidth + margin <= left;
        const verticalGap = top + wagonHeight + margin <= otherTop || otherTop + otherHeight + margin <= top;
        return !(horizontalGap || verticalGap);
      });

    do {
      left = Math.random() * (maxX || 1);
      top = Math.random() * (maxY || 1);
      attempt += 1;
    } while (overlaps() && attempt < 14);
    setFreePosition(wagon, left, top, { width: wagonWidth, height: wagonHeight });
  });
};

const createWagonElement = (item) => {
  const wagon = document.createElement("div");
  wagon.className = "wagon";
  wagon.dataset.word = item.word;
  wagon.dataset.correct = item.isCorrect ? "true" : "false";
  const img = document.createElement("img");
  img.alt = item.word;
  img.loading = "lazy";

  const imageSources = buildImageSources(item.word);
  const applyNextImageSource = () => {
    while (imageSources.length) {
      const candidate = imageSources.shift();
      if (candidate) {
        img.src = candidate;
        return true;
      }
    }
    return false;
  };

  const handleImageError = () => {
    if (applyNextImageSource()) {
      return;
    }
    img.removeEventListener("error", handleImageError);
    img.remove();
    const fallback = document.createElement("div");
    fallback.className = "image-placeholder";
    fallback.textContent = item.word.charAt(0).toUpperCase();
    wagon.prepend(fallback);
  };

  img.addEventListener("error", handleImageError);
  if (!applyNextImageSource()) {
    handleImageError();
  }

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = item.word;

  wagon.append(img, label);
  wagon.addEventListener("pointerdown", (event) => startDrag(event, wagon));

  return wagon;
};

const renderSlots = () => {
  slots.length = 0;
  slotWrapper.innerHTML = "";
  const locomotive = document.createElement("div");
  locomotive.className = "locomotive";
  locomotive.dataset.locomotive = "true";

  const locoImage = document.createElement("img");
  locoImage.src = "../../images/train/locomotive.png";
  locoImage.alt = "Локомотив";
  locoImage.loading = "lazy";

  const locoLabel = document.createElement("span");
  locoLabel.className = "locomotive-label";
  locoLabel.textContent = letterConfig.name;

  locomotive.append(locoImage, locoLabel);

  slotWrapper.appendChild(locomotive);

  correctWords.forEach((_, index) => {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = String(index);
    slotWrapper.appendChild(slot);
    slots.push(slot);
  });

  const totalColumns = correctWords.length + 1;
  slotWrapper.style.setProperty("--slot-count", String(totalColumns));

};

const renderWagons = () => {
  freeInner.innerHTML = "";
  wagonItems.forEach((item) => {
    const wagon = createWagonElement(item);
    freeInner.appendChild(wagon);
    scatterWagon(wagon);
  });
};

const clampPosition = (x, y) => {
  const surfaceRect = gameSurface.getBoundingClientRect();
  const wagonRect = dragging?.element?.getBoundingClientRect();
  if (!wagonRect) {
    return { x, y };
  }
  const maxX = surfaceRect.width - wagonRect.width;
  const maxY = surfaceRect.height - wagonRect.height;
  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
};

const startDrag = (event, element) => {
  if (phase !== "build") {
    return;
  }
  event.preventDefault();
  element.setPointerCapture(event.pointerId);
  element.classList.add("grabbing");
  element.classList.remove("touch-hint");
  const rect = element.getBoundingClientRect();
  const surfaceRect = gameSurface.getBoundingClientRect();
  const moveHandler = (moveEvent) => handlePointerMove(moveEvent);
  const upHandler = (upEvent) => endDrag(upEvent);
  dragging = {
    element,
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    fromSlot: element.parentElement?.classList.contains("slot") || false,
    originSlot: element.parentElement?.classList.contains("slot") ? element.parentElement : null,
    moveHandler,
    upHandler,
  };
  if (dragging.originSlot) {
    dragging.originSlot.classList.remove("filled", "correct");
  }
  element.style.position = "absolute";
  element.style.width = `${rect.width}px`;
  element.style.height = `${rect.height}px`;
  element.style.left = `${rect.left - surfaceRect.left}px`;
  element.style.top = `${rect.top - surfaceRect.top}px`;
  element.style.zIndex = "10";
  element.classList.add("dragging");
  gameSurface.appendChild(element);

  window.addEventListener("pointermove", moveHandler);
  window.addEventListener("pointerup", upHandler);
  window.addEventListener("pointercancel", upHandler);
  handlePointerMove(event);
};

const handlePointerMove = (event) => {
  if (!dragging || event.pointerId !== dragging.pointerId) {
    return;
  }
  const surfaceRect = gameSurface.getBoundingClientRect();
  const x = event.clientX - surfaceRect.left - dragging.offsetX;
  const y = event.clientY - surfaceRect.top - dragging.offsetY;
  const { x: clampedX, y: clampedY } = clampPosition(x, y);
  dragging.element.style.left = `${clampedX}px`;
  dragging.element.style.top = `${clampedY}px`;
  const hoveredSlot = slots.find((slot) => {
    const rect = slot.getBoundingClientRect();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  });
  setSlotHover(hoveredSlot);
};

const placeInFreeArea = (element, position) => {
  if (!freeInner) {
    return;
  }
  element.classList.remove("touch-hint");
  element.classList.remove("dragging");
  element.style.cursor = "grab";
  element.style.position = "absolute";
  element.style.width = "";
  element.style.height = "";
  element.style.zIndex = "";
  freeInner.appendChild(element);
  if (position) {
    setFreePosition(element, position.left, position.top, position.size);
  } else {
    restoreFreePosition(element);
  }
};

const clearSlotHighlight = () => {
  slots.forEach((slot) => {
    slot.classList.remove("correct", "hover");
  });
};

const endDrag = (event) => {
  if (!dragging || event.pointerId !== dragging.pointerId) {
    return;
  }
    const { element } = dragging;
    try {
      element.releasePointerCapture(event.pointerId);
    } catch (error) {
      // Ignore if pointer capture was already released
    }
    element.classList.remove("grabbing");
    element.classList.remove("dragging");
    if (dragging.moveHandler) {
      window.removeEventListener("pointermove", dragging.moveHandler);
    }
    if (dragging.upHandler) {
      window.removeEventListener("pointerup", dragging.upHandler);
      window.removeEventListener("pointercancel", dragging.upHandler);
    }

  const dropSlot = slots.find((slot) => {
    const rect = slot.getBoundingClientRect();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  });

  if (dropSlot) {
    if (dragging.originSlot && dragging.originSlot !== dropSlot) {
      dragging.originSlot.classList.remove("filled", "correct");
    }
    if (dropSlot.firstElementChild) {
      showMessage("Це місце вже зайняте");
      placeInFreeArea(element);
    } else {
      dropSlot.appendChild(element);
      element.style.position = "relative";
      element.style.width = "100%";
      element.style.height = "100%";
      element.style.left = "0";
      element.style.top = "0";
      element.style.zIndex = "";
      element.classList.remove("touch-hint");
      dropSlot.classList.add("filled");
      dropSlot.classList.remove("hover");
    }
  } else {
    const fieldRect = getFieldRect();
    const elementRect = element.getBoundingClientRect();
    if (fieldRect) {
      const position = {
        left: elementRect.left - fieldRect.left,
        top: elementRect.top - fieldRect.top,
        size: { width: elementRect.width, height: elementRect.height },
      };
      placeInFreeArea(element, position);
    } else {
      placeInFreeArea(element);
    }
    if (dragging.originSlot) {
      dragging.originSlot.classList.remove("filled", "correct");
    }
  }

  setSlotHover(null);
  dragging = null;
};

const verifyTrain = () => {
  if (phase !== "build") {
    return;
  }
  if (!slots.every((slot) => slot.firstElementChild)) {
    showMessage("Заповніть усі вагони перед перевіркою");
    return;
  }

  let allCorrect = true;
  slots.forEach((slot, index) => {
    const wagon = slot.firstElementChild;
    if (!wagon) {
      allCorrect = false;
      return;
    }
    const isCorrect = wagon.dataset.correct === "true";
    if (!isCorrect) {
      allCorrect = false;
      slot.classList.remove("correct");
    } else {
      slot.classList.add("correct");
    }
  });

  if (allCorrect) {
    playTone(true);
    phase = "ready";
    checkButton.classList.add("hidden");
    statusText.textContent = "Потяг готовий! Пригадаймо, що в ньому їхало.";
    window.setTimeout(() => {
      if (phase === "ready") {
        startQuiz();
      }
    }, 800);
  } else {
    playTone(false);
    showMessage("Спробуйте ще раз");
  }
};

const removeExtraWagons = () => {
  const freeWagons = Array.from(freeInner.querySelectorAll(".wagon"));
  freeWagons.forEach((wagon) => {
    if (wagon.dataset.correct !== "true") {
      wagon.remove();
    }
  });
};

const lockTrain = () => {
  slots.forEach((slot) => {
    const wagon = slot.firstElementChild;
    if (wagon) {
      wagon.classList.add("touch-hint");
      wagon.style.cursor = "default";
    }
  });
};

const buildQuestionPool = () => {
  // 1) Базуємо питання саме на зібраному потязі (слоти);
  // якщо потяг ще не зібрано, використовуємо очікуваний порядок correctWords
  const words = slots
    .map((slot) => slot.firstElementChild && slot.firstElementChild.dataset.word)
    .filter(Boolean);

  if (!words.length) {
    words.push(...correctWords);
  }

  const distractPool = [...new Set([...roundExtras, ...distractors])];

  const randomFrom = (source, count, exclude = []) => {
    const filtered = source.filter((item) => !exclude.includes(item));
    return shuffle(filtered).slice(0, count);
  };

  // Helper constructors for the three positional question types
  const makeBefore = (index) => {
    const target = words[index]; // index >=1
    const answer = words[index - 1];
    const options = shuffle([answer, ...randomFrom([...words, ...distractPool], 2, [answer, target])]);
    return {
      id: uid("q"),
      type: "single",
      text: `Який вагон їде перед словом «${target}»?`,
      answer,
      options,
    };
  };

  const makeAfter = (index) => {
    const target = words[index]; // index <= n-2
    const answer = words[index + 1];
    const options = shuffle([answer, ...randomFrom([...words, ...distractPool], 2, [answer, target])]);
    return {
      id: uid("q"),
      type: "single",
      text: `Який вагон їде після слова «${target}»?`,
      answer,
      options,
    };
  };

  const makeBetween = (index) => {
    const before = words[index - 1]; // 1..n-2
    const answer = words[index];
    const after = words[index + 1];
    const options = shuffle([answer, ...randomFrom([...words, ...distractPool], 2, [answer, before, after])]);
    return {
      id: uid("q"),
      type: "single",
      text: `Який вагон їде між словами «${before}» та «${after}»?`,
      answer,
      options,
    };
  };

  // 2) Формуємо всі допустимі кандидати з урахуванням країв
  const n = words.length;
  const beforeCandidates = n >= 2 ? Array.from({ length: n - 1 }, (_, i) => ({ kind: "before", index: i + 1 })) : [];
  const afterCandidates = n >= 2 ? Array.from({ length: n - 1 }, (_, i) => ({ kind: "after", index: i })) : [];
  const betweenCandidates = n >= 3 ? Array.from({ length: n - 2 }, (_, i) => ({ kind: "between", index: i + 1 })) : [];

  // 3) Випадково обираємо рівно 5 позиційних питань
  const positionCandidates = shuffle([...beforeCandidates, ...afterCandidates, ...betweenCandidates]);
  const positional = [];
  for (const cand of positionCandidates) {
    if (positional.length >= 5) break;
    if (cand.kind === "before") positional.push(makeBefore(cand.index));
    else if (cand.kind === "after") positional.push(makeAfter(cand.index));
    else positional.push(makeBetween(cand.index));
  }

  // На випадок дуже малих категорій (теоретично) — дублюємо різні типи ще раз
  while (positional.length < 5 && positionCandidates.length) {
    const cand = positionCandidates[positional.length % positionCandidates.length];
    if (cand.kind === "before" && cand.index >= 1) positional.push(makeBefore(cand.index));
    else if (cand.kind === "after" && cand.index <= n - 2) positional.push(makeAfter(cand.index));
    else if (cand.kind === "between" && cand.index >= 1 && cand.index <= n - 2) positional.push(makeBetween(cand.index));
  }

  // 4) Одне питання на кількість вагонів
  const countQuestion = {
    id: uid("q"),
    type: "single",
    text: "Скільки вагонів у потязі?",
    answer: String(n),
    options: shuffle([String(n), ...randomFrom(["3", "4", "5", "6", "7", "8"], 2, [String(n)])]),
  };

  // 5) Питання пам'яті — завжди наприкінці
  const memoryQuestion = {
    id: uid("q"),
    type: "memory",
    text: "Які з цих вагонів були в потязі? Оберіть усі правильні варіанти.",
    correctSet: new Set(words),
    options: shuffle([...words, ...roundExtras]),
  };

  return [...positional.slice(0, 5), countQuestion, memoryQuestion];
};

const startQuiz = () => {
  phase = "quiz";
  document.body.classList.add("quiz-mode");
  questionPanel.classList.add("active");
  freeInner.classList.add("quiz-disabled");
  quizQuestions = buildQuestionPool();
  questionIndex = 0;
  quizScore = 0;
  memorySelection = new Set();
  removeExtraWagons();
  lockTrain();
  showNextQuestion();
};

const updateQuestionCounter = () => {
  questionCounter.textContent = `${Math.min(questionIndex + 1, quizQuestions.length)}/${quizQuestions.length}`;
};

const showNextQuestion = () => {
  feedbackLabel.textContent = "";
  const question = quizQuestions[questionIndex];
  if (!question) {
    return finishQuiz();
  }
  updateQuestionCounter();
  if (question.type === "memory") {
    // На питанні пам'яті приховуємо потяг, щоб не підглядали
    document.body.classList.add("memory-hide");
    renderMemoryQuestion(question);
  } else {
    document.body.classList.remove("memory-hide");
    renderSingleChoice(question);
  }
};

const clearAnswers = () => {
  answersContainer.innerHTML = "";
  quizActionBtn.classList.add("hidden");
  quizActionBtn.disabled = true;
};

const renderSingleChoice = (question) => {
  questionTitle.textContent = question.text;
  clearAnswers();
  question.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-btn";
    btn.textContent = option;
    btn.addEventListener("click", () => handleSingleAnswer(question, option, btn));
    answersContainer.appendChild(btn);
  });
};

const handleSingleAnswer = (question, answer, button) => {
  const buttons = answersContainer.querySelectorAll(".answer-btn");
  buttons.forEach((btn) => btn.setAttribute("disabled", "true"));
  const isCorrect = answer === question.answer;
  if (isCorrect) {
    quizScore += 1;
    feedbackLabel.textContent = "Правильно!";
    button.classList.add("selected");
    playTone(true);
  } else {
    feedbackLabel.textContent = `Невірно. Правильна відповідь — «${question.answer}».`;
    playTone(false);
  }
  window.setTimeout(() => {
    questionIndex += 1;
    buttons.forEach((btn) => btn.removeAttribute("disabled"));
    showNextQuestion();
  }, 1200);
};

const renderMemoryQuestion = (question) => {
  questionTitle.textContent = question.text;
  clearAnswers();
  memorySelection.clear();
  question.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-btn";
    btn.textContent = option;
    btn.addEventListener("click", () => toggleMemoryAnswer(option, btn));
    answersContainer.appendChild(btn);
  });
  quizActionBtn.classList.remove("hidden");
  quizActionBtn.disabled = false;
  quizActionBtn.textContent = "Перевірити відповідь";
  quizActionBtn.onclick = () => finalizeMemoryAnswer(question);
};

const toggleMemoryAnswer = (option, button) => {
  if (memorySelection.has(option)) {
    memorySelection.delete(option);
    button.classList.remove("selected");
  } else {
    memorySelection.add(option);
    button.classList.add("selected");
  }
};

const finalizeMemoryAnswer = (question) => {
  const correctSet = question.correctSet;
  const selected = memorySelection;
  const options = answersContainer.querySelectorAll(".answer-btn");
  let allGood = true;
  options.forEach((btn) => {
    const value = btn.textContent;
    const shouldBeSelected = correctSet.has(value);
    const isSelected = selected.has(value);
    btn.classList.toggle("selected", isSelected);
    btn.classList.toggle("correct", shouldBeSelected && isSelected);
    btn.classList.toggle("incorrect", !shouldBeSelected && isSelected);
    if (shouldBeSelected !== isSelected) {
      allGood = false;
    }
  });

  if (allGood) {
    options.forEach((btn) => btn.setAttribute("disabled", "true"));
    quizActionBtn.setAttribute("disabled", "true");
    quizScore += 1;
    feedbackLabel.textContent = "Чудово! Ти все запам'ятав.";
    playTone(true);
    window.setTimeout(() => {
      questionIndex += 1;
      showNextQuestion();
    }, 1400);
    return;
  }

  feedbackLabel.textContent = "Не зовсім. Спробуй ще раз.";
  playTone(false);
  quizActionBtn.textContent = "Спробувати ще раз";
  quizActionBtn.removeAttribute("disabled");
  options.forEach((btn) => btn.removeAttribute("disabled"));
  window.setTimeout(() => {
    options.forEach((btn) => btn.classList.remove("incorrect", "correct"));
  }, 900);
};

const finishQuiz = () => {
  phase = "finished";
  document.body.classList.remove("memory-hide");
  document.body.classList.remove("quiz-mode");
  questionPanel.classList.remove("active");
  finalScreen.classList.add("show");
  const messages = ["Молодець!", "Чудово!", "Так тримати!"];
  finalMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
  finalScore.textContent = `Правильних відповідей: ${quizScore}/${quizQuestions.length}`;
};

const resetGame = () => {
  finalScreen.classList.remove("show");
  slots.length = 0;
  freeInner.classList.remove("quiz-disabled");
  document.body.classList.remove("quiz-mode");
  document.body.classList.remove("memory-hide");
  questionPanel.classList.remove("active");
  checkButton.classList.remove("hidden");
  phase = "build";
  clearSlotHighlight();
  slotWrapper.innerHTML = "";
  renderSlots();
  prepareRound();
  renderWagons();
  initStatus();
};

checkButton.addEventListener("click", verifyTrain);
replayBtn.addEventListener("click", resetGame);
menuBtn.addEventListener("click", () => {
  window.location.href = "../../select/index.html";
});
backBtn.addEventListener("click", () => {
  window.location.href = "../../select/index.html";
});

initStatus();
renderSlots();
prepareRound();
renderWagons();
