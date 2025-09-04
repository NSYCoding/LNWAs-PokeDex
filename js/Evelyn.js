import { fetchPokemon, fetchNatures, fetchTypeData, getEffectiveStat, initializeItems, natures, items, translations, statMapping } from './pokemonApi.js';
import { runCombat } from './combatSimulator.js';
import { applyLanguage, toggleLanguageDropdown, changeLanguage } from './i18n.js';

let pokemonDataOne = null;
let pokemonDataTwo = null;

// Functie om de stat-waarden te renderen
function renderStats(stats, types, containerId, side) {
    const container = document.getElementById(containerId);
    const selectedItemId = document.getElementById(`selectedItem-${side}`).dataset.item;
    const selectedNatureId = document.getElementById(`selectedNature-${side}`).dataset.nature;

    const item = items.find(i => i.id === selectedItemId);
    const nature = natures.find(n => n.id === selectedNatureId);

    const formatStatValue = (statName, baseValue) => {
        const effectiveValue = getEffectiveStat(baseValue, statName, nature, item);
        const className = effectiveValue > baseValue ? 'green-stat' : effectiveValue < baseValue ? 'red-stat' : '';
        return `<td class="${className.trim()}">${Math.round(effectiveValue)}</td>`;
    };

    container.innerHTML = `
        <h3>Types: ${types.map(t => t.type.name).join(', ')}</h3>
        <table>
            <tr><th>Stat</th><th>Base Value</th><th>Effective Value</th></tr>
            ${stats.map(stat => `
                <tr>
                    <td>${stat.stat.name}</td>
                    <td>${stat.base_stat}</td>
                    ${formatStatValue(stat.stat.name, stat.base_stat)}
                </tr>
            `).join('')}
        </table>
    `;

    if (side === 'one') {
        pokemonDataOne = {
            name: document.getElementById('pokemonOneName').innerText,
            stats: stats,
            types: types,
            img: document.getElementById('pokemonOneNameImg').src,
            itemId: selectedItemId,
            natureId: selectedNatureId
        };
    } else {
        pokemonDataTwo = {
            name: document.getElementById('pokemonTwoName').innerText,
            stats: stats,
            types: types,
            img: document.getElementById('pokemonTwoNameImg').src,
            itemId: selectedItemId,
            natureId: selectedNatureId
        };
    }
}

// Functie om Pokémon te zoeken
async function searchPokemon(inputId, nameId, statsId, imgId, side) {
    const name = document.getElementById(inputId).value.toLowerCase();
    if (!name) return;
    try {
        const data = await fetchPokemon(name);
        document.getElementById(nameId).innerText = data.name;
        document.getElementById(imgId).src = data.sprites.front_default;
        renderStats(data.stats, data.types, statsId, side);
    } catch (error) {
        alert(translations[localStorage.getItem('language') || 'nl'].pokemonNotFound);
        console.error(error);
    }
}

// Functie om een willekeurige Pokémon te kiezen
async function getRandomPokemon(nameId, statsId, imgId, side) {
    try {
        const data = await fetchPokemon();
        document.getElementById(nameId).innerText = data.name;
        document.getElementById(imgId).src = data.sprites.front_default;
        renderStats(data.stats, data.types, statsId, side);
    } catch (error) {
        alert("Kon geen willekeurige Pokémon ophalen.");
        console.error(error);
    }
}

// Functie voor de "Clear" knop
function clearMatchUps() {
    document.querySelectorAll('.item-dropdown, .nature-dropdown').forEach(dropdown => dropdown.remove());
    document.getElementById("searchOneInput").value = "";
    document.getElementById("searchTwoInput").value = "";
    document.getElementById("pokemonOneName").innerText = "Pokemon 1";
    document.getElementById("pokemonTwoName").innerText = "Pokemon 2";
    document.getElementById("pokemonOneNameImg").src = "../images/pokeball_pokedex.png";
    document.getElementById("pokemonTwoNameImg").src = "../images/pokeball_pokedex.png";
    document.getElementById("displayStatsOne").innerHTML = "";
    document.getElementById("displayStatsTwo").innerHTML = "";
    document.getElementById("estimatedWinner").innerText = "";
    document.getElementById("recommendationText").innerText = "";
    document.getElementById("tieArea").classList.add("hidden");
    document.getElementById("coinResult").innerText = "";
    setItem('one', 'none');
    setItem('two', 'none');
    setNature('one', 'hardy');
    setNature('two', 'hardy');
    pokemonDataOne = null;
    pokemonDataTwo = null;
    localStorage.removeItem('currentMatchup');
}

// Functie om items weer te geven
function toggleItemMenu(side) {
    const itemRow = document.querySelector(`.pokemon${side === 'one' ? 'One' : 'Two'} .itemRow`);
    let dropdown = itemRow.querySelector('.item-dropdown');

    if (dropdown) {
        dropdown.remove();
        return;
    }

    dropdown = document.createElement('div');
    dropdown.classList.add('item-dropdown');

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item-dropdown-item');
        itemElement.textContent = item.name;
        itemElement.dataset.itemId = item.id;
        itemElement.onclick = () => setItem(side, item.id);
        dropdown.appendChild(itemElement);
    });

    itemRow.appendChild(dropdown);
}

// Functie om natures weer te geven
function toggleNatureMenu(side) {
    const natureRow = document.querySelector(`.pokemon${side === 'one' ? 'One' : 'Two'} .natureRow`);
    let dropdown = natureRow.querySelector('.nature-dropdown');

    if (dropdown) {
        dropdown.remove();
        return;
    }

    dropdown = document.createElement('div');
    dropdown.classList.add('nature-dropdown');

    natures.forEach(nature => {
        const natureElement = document.createElement('div');
        natureElement.classList.add('nature-dropdown-item');
        natureElement.textContent = nature.name;
        natureElement.dataset.natureId = nature.id;
        natureElement.onclick = () => setNature(side, nature.id);
        dropdown.appendChild(natureElement);
    });

    natureRow.appendChild(dropdown);
}

// Display of the chosen item
function setItem(side, itemId) {
    const selectedItemSpan = document.getElementById(`selectedItem-${side}`);
    const item = items.find(i => i.id === itemId);
selectedItemSpan.querySelector('strong').innerText = item.name;    selectedItemSpan.dataset.item = itemId;
    const dropdown = document.querySelector(`.pokemon${side === 'one' ? 'One' : 'Two'} .item-dropdown`);
    if (dropdown) dropdown.remove();

    if (side === 'one' && pokemonDataOne) {
        renderStats(pokemonDataOne.stats, pokemonDataOne.types, 'displayStatsOne', 'one', itemId, pokemonDataOne.natureId);
    }
    if (side === 'two' && pokemonDataTwo) {
        renderStats(pokemonDataTwo.stats, pokemonDataTwo.types, 'displayStatsTwo', 'two', itemId, pokemonDataTwo.natureId);
    }
}

// Display of the chosen nature
function setNature(side, natureId) {
    const selectedNatureSpan = document.getElementById(`selectedNature-${side}`);
    const nature = natures.find(n => n.id === natureId);
selectedNatureSpan.querySelector('strong').innerText = nature.name;    selectedNatureSpan.dataset.nature = natureId;
    const dropdown = document.querySelector(`.pokemon${side === 'one' ? 'One' : 'Two'} .nature-dropdown`);
    if (dropdown) dropdown.remove();

    if (side === 'one' && pokemonDataOne) {
        renderStats(pokemonDataOne.stats, pokemonDataOne.types, 'displayStatsOne', 'one', pokemonDataOne.itemId, natureId);
    }
    if (side === 'two' && pokemonDataTwo) {
        renderStats(pokemonDataTwo.stats, pokemonDataTwo.types, 'displayStatsTwo', 'two', pokemonDataTwo.itemId, natureId);
    }
}

// Functie voor de muntflip bij gelijkspel
function flipCoin() {
    const winner = Math.random() < 0.5 ? document.getElementById("pokemonOneName").innerText : document.getElementById("pokemonTwoName").innerText;
    document.getElementById("coinResult").innerText = `${winner} wint!`;
}

// Functie voor het opslaan van match-ups
function saveMatchUp() {
    const name1 = document.getElementById("pokemonOneName").innerText;
    const name2 = document.getElementById("pokemonTwoName").innerText;
    if (name1 === "Pokemon 1" || name2 === "Pokemon 2") {
        alert(translations[localStorage.getItem('language') || 'nl'].selectPokemonToSave);
        return;
    }
    const matchup = {
        name1: name1,
        name2: name2,
        winner: document.getElementById("estimatedWinner").innerText || (document.getElementById("coinResult").innerText.split(" ")[0]),
        nature1: document.getElementById('selectedNature-one').dataset.nature,
        nature2: document.getElementById('selectedNature-two').dataset.nature,
        date: new Date().toLocaleString()
    };

    let savedMatchups = JSON.parse(localStorage.getItem('savedMatchups')) || [];
    savedMatchups.push(matchup);
    localStorage.setItem('savedMatchups', JSON.stringify(savedMatchups));
    alert(translations[localStorage.getItem('language') || 'nl'].matchupSaved);
}

// Functie voor het weergeven van opgeslagen match-ups
function renderSavedMatchUps() {
    const savedList = document.getElementById("savedList");
    savedList.innerHTML = "";
    const savedMatchups = JSON.parse(localStorage.getItem('savedMatchups')) || [];

    if (savedMatchups.length === 0) {
        savedList.innerHTML = `<p>${translations[localStorage.getItem('language') || 'nl'].emptySavedList}</p>`;
        return;
    }

    savedMatchups.forEach((matchup, index) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <p><strong>${translations[localStorage.getItem('language') || 'nl'].savedEntry}</strong> ${matchup.name1} (${matchup.nature1}) vs ${matchup.name2} (${matchup.nature2})</p>
            <p><strong>Winnaar:</strong> ${matchup.winner}</p>
            <p><small>${matchup.date}</small></p>
            <button onclick="deleteMatchUp(${index})"> 🗑️ ${translations[localStorage.getItem('language') || 'nl'].deleteBtn}</button>
        `;
        savedList.appendChild(div);
    });
}

// Functie voor het verwijderen van een opgeslagen match-up
function deleteMatchUp(index) {
    let savedMatchups = JSON.parse(localStorage.getItem('savedMatchups')) || [];
    savedMatchups.splice(index, 1);
    localStorage.setItem('savedMatchups', JSON.stringify(savedMatchups));
    renderSavedMatchUps();
}

// Functie voor het tonen/verbergen van de opgeslagen lijst
function toggleSaved() {
    const container4 = document.getElementById("container4");
    container4.classList.toggle("hidden");
    if (!container4.classList.contains("hidden")) {
        renderSavedMatchUps();
    }
}

// Functie voor het tonen van type match-ups
function showAllTypeMatchUps() {
    fetchTypeData().then(typeData => {
        let output = "";
        typeData.forEach(t => {
            output += `Type: ${t.name}\n`;
            output += `   ➕ Sterk tegen: ${t.damage_relations.double_damage_to.map(d => d.name).join(", ")}\n`;
            output += `   ➖ Zwak tegen: ${t.damage_relations.double_damage_from.map(d => d.name).join(", ")}\n\n`;
        });
        alert(output);
    });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchNatures();
    initializeItems();

    const savedLang = localStorage.getItem('language') || 'nl';
    applyLanguage(savedLang);
    document.getElementById('languageSelect').value = savedLang;
});

document.getElementById('runBtn').addEventListener('click', async () => {
    if (!pokemonDataOne || !pokemonDataTwo) {
        alert(translations[localStorage.getItem('language') || 'nl'].selectBothPokemon);
        return;
    }
    const result = await runCombat(pokemonDataOne, pokemonDataTwo);
    document.getElementById("estimatedWinner").innerText = result.winner;
    document.getElementById("recommendationText").innerText = result.recommendation;
    if (result.winner === 'tie') {
        document.getElementById("tieArea").classList.remove("hidden");
    } else {
        document.getElementById("tieArea").classList.add("hidden");
    }
});

document.getElementById('clearBtn').addEventListener('click', clearMatchUps);
window.showAllTypeMatchUps = showAllTypeMatchUps;
window.toggleSaved = toggleSaved;
window.saveMatchUp = saveMatchUp;
window.deleteMatchUp = deleteMatchUp;
window.flipCoin = flipCoin;
window.toggleItemMenu = toggleItemMenu;
window.toggleNatureMenu = toggleNatureMenu;
window.setItem = setItem;
window.setNature = setNature;
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.changeLanguage = changeLanguage;
window.searchPokemon = searchPokemon;
window.getRandomPokemon = getRandomPokemon;