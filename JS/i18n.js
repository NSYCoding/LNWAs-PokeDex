import { translations } from './pokemonApi.js';

export function applyLanguage(lang) {
    const currentLanguage = translations[lang] || translations.nl;
    localStorage.setItem('language', lang);
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (currentLanguage[key]) {
            element.textContent = currentLanguage[key];
        }
    });
}

export function toggleLanguageDropdown() {
    const dropdown = document.getElementById("languageDropdown");
    dropdown.classList.toggle("hidden");
}

export function changeLanguage(lang) {
    applyLanguage(lang);
}