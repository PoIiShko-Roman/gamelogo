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

const initImageFallbacks = (selector = "img[data-fallback]") => {
	document.querySelectorAll(selector).forEach((img) => {
		const fallback = img.getAttribute("data-fallback");
		if (!fallback) {
			return;
		}
		const applyFallback = () => {
			if (img.dataset.fallbackApplied === "true") {
				return;
			}
			img.dataset.fallbackApplied = "true";
			img.src = fallback;
			img.classList.add("is-fallback");
		};
		if (img.complete && img.naturalWidth === 0) {
			applyFallback();
		}
		img.addEventListener("error", applyFallback);
	});
};

const games = {
	potyah: {
		title: "Потяг",
		status: "Доступно",
		description:
			"Обирайте літеру та тему слів, складайте вагончики у правильному порядку і переходьте до запитань на уважність.",
		rules: [
			"Натисніть «Обрати слова», щоб задати літеру та тему.",
			"Перетягніть усі правильні вагончики до потяга, а потім перевірте результат.",
			"Відповідайте на шість запитань та фінальний тест пам'яті, не поспішаючи.",
		],
		actions: [
			{
				type: "link",
				label: "Обрати слова",
				href: "select/index.html",
				primary: true,
			},
		],
	},
	letters: {
		title: "Гра в розробці",
		status: "Скоро",
		description:
			"Ми готуємо нові завдання та ілюстрації. Як тільки усе буде готово, гра з'явиться на цьому сайті.",
		rules: [
			"Стежте за оновленнями на сторінці «Про нас».",
			"Підписуйтеся на соцмережі, щоб першими отримати посилання на гру.",
		],
		actions: [
			{
				type: "link",
				label: "Деталі",
				href: "games/game2/index.html",
				primary: false,
			},
		],
	},
	rhymes: {
		title: "Гра в розробці",
		status: "Скоро",
		description:
			"Проєкт на етапі підготовки. Команда працює над аудіо супроводом і вправами для розвитку римування.",
		rules: [
			"Слідкуйте за розділом новин, щоб не пропустити реліз.",
			"Повідомте нам, які завдання хотіли б бачити — це допоможе пришвидшити старт.",
		],
		actions: [
			{
				type: "link",
				label: "Деталі",
				href: "games/game3/index.html",
				primary: false,
			},
		],
	},
};

const setupGameCards = () => {
	const triggers = document.querySelectorAll(".game-card-trigger");
	const detailsWrapper = document.querySelector("[data-game-details]");
	const detailsTitle = document.querySelector("[data-details-title]");
	const detailsDescription = document.querySelector("[data-details-description]");
	const detailsRules = document.querySelector("[data-details-rules]");
	const detailsActions = document.querySelector("[data-details-actions]");

	if (!triggers.length || !detailsWrapper) {
		return;
	}

	const clearActive = () => {
		triggers.forEach((btn) => {
			btn.classList.remove("active");
			btn.setAttribute("aria-pressed", "false");
		});
	};

	const renderGame = (id, trigger) => {
		const game = games[id];
		if (!game) {
			return;
		}
		clearActive();
		trigger.classList.add("active");
		trigger.setAttribute("aria-pressed", "true");
		detailsWrapper.hidden = false;
		detailsTitle.textContent = game.title;
		detailsDescription.textContent = game.description;
		detailsRules.innerHTML = "";

		if (Array.isArray(game.rules) && game.rules.length) {
			const list = document.createElement("ul");
			game.rules.forEach((rule) => {
				const item = document.createElement("li");
				item.textContent = rule;
				list.appendChild(item);
			});
			detailsRules.appendChild(list);
		}

		detailsActions.innerHTML = "";
		if (Array.isArray(game.actions) && game.actions.length) {
			game.actions.forEach((action) => {
				if (action.type === "link") {
					const link = document.createElement("a");
					link.href = action.href;
					link.className = action.primary ? "btn btn-primary" : "btn btn-secondary";
					link.textContent = action.label;
					detailsActions.appendChild(link);
				}
			});
		} else {
			const info = document.createElement("p");
			info.className = "feedback-label";
			info.textContent = "Гра в активній розробці. Слідкуйте за оновленнями.";
			detailsActions.appendChild(info);
		}
	};

	triggers.forEach((trigger) => {
		trigger.setAttribute("aria-pressed", "false");
		trigger.addEventListener("click", () => {
			renderGame(trigger.dataset.gameId, trigger);
		});
	});
};

document.addEventListener("DOMContentLoaded", () => {
	const theme = getPreferredTheme();
	applyTheme(theme);
	initThemeToggle();
	initMenuToggle();
	initImageFallbacks();
	setupGameCards();
});
