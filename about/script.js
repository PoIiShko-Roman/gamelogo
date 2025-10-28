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

	document.addEventListener("click", (event) => {
		if (!(event.target instanceof Element)) {
			return;
		}
		if (!nav.contains(event.target) && !toggle.contains(event.target)) {
			closeMenu();
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

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") {
			return;
		}
		if (toggle.getAttribute("aria-expanded") === "true") {
			closeMenu({ skipFocus: false });
		}
	});
};

document.addEventListener("DOMContentLoaded", () => {
	const theme = getPreferredTheme();
	applyTheme(theme);
	initThemeToggle();
	initMenuToggle();
});
