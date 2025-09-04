document.addEventListener("DOMContentLoaded", () => {
    fetchNatures();
    initializeItems();
});
      
// These let make sure to both determine a variable name:
// - so the 2 pokemons are ready,
// - the natures and items are prepared,
// - the language is predeterminded
let pokemonDataOne = null;
let pokemonDataTwo = null;
let natures = [];
let items = [];
let currentLanguage = "nl";

// Add any language under here within the translations object.
// start with 2 characters like "nl" and add all the variable names with their respected translations
const translations = {
    nl: {
        language: "Taal",
        search: "Zoek Pokémon",
        random: "Willekeurige Pokémon",
        pokemon1: "Pokémon 1",
        pokemon2: "Pokémon 2",
        runTest: "Voer testwedstrijd uit",
        clear: "Wissen",
        winner: "Geschatte winnaar is:",
        tie: "Het is een gelijkspel! Kop of munt?",
        flip: "Gooi een munt op",
        finishedResults: "Afgewerkte resultaten",
        recommendation: "Aanbeveling/Uitleg",
        typeMatchups: "Type Match-Ups",
        saveMatchup: "Match-up opslaan",
        showSaved: "Opgeslagen match-ups tonen",
        savedHeader: "Opgeslagen Match-Ups",
        addItem: "Item toevoegen",
        selectedItem: "Geselecteerd item",
        addNature: "Voeg natuur toe",
        selectedNature: "Natuur toevoegen",
        emptySavedList: "Geen opgeslagen match-ups gevonden.",
        savedEntry: "Opgeslagen match-up: "
    },
    en: {
        language: "Language",
        search: "Search Pokémon",
        random: "Random Pokémon",
        pokemon1: "Pokémon 1",
        pokemon2: "Pokémon 2",
        runTest: "Run test contest",
        clear: "Clear",
        winner: "Estimated winner is:",
        tie: "It's a tie! Flip a coin?",
        flip: "Flip a coin",
        finishedResults: "Finished Results",
        recommendation: "Recommendation/Explanation",
        typeMatchups: "Type Match-Ups",
        saveMatchup: "Save Match-Up",
        showSaved: "Show saved match-ups",
        savedHeader: "Saved Match-Ups",
        addItem: "Add item",
        selectedItem: "Selected item",
        addNature: "Add nature",
        selectedNature: "Selected nature",
        emptySavedList: "No saved match-ups found.",
        savedEntry: "Saved match-up: "
    },
    de: {
        language: "Sprache",
        search: "Pokémon suchen",
        random: "Zufälliges Pokémon",
        pokemon1: "Pokémon 1",
        pokemon2: "Pokémon 2",
        runTest: "Testkampf starten",
        clear: "Löschen",
        winner: "Geschätzter Gewinner ist:",
        tie: "Unentschieden! Münze werfen?",
        flip: "Münze werfen",
        finishedResults: "Endergebnisse",
        recommendation: "Empfehlung/Erklärung",
        typeMatchups: "Typen-Vergleiche",
        saveMatchup: "Match-Up speichern",
        showSaved: "Gespeicherte Match-Ups anzeigen",
        savedHeader: "Gespeicherte Match-Ups",
        addItem: "Gegenstand hinzufügen",
        selectedItem: "Ausgewählter Gegenstand",
        addNature: "Natur hinzufügen",
        selectedNature: "Ausgewählte Natur",
        emptySavedList: "Keine gespeicherten Match-Ups gefunden.",
        savedEntry: "Gespeichertes Match-Up: "
    },
    ja: {
        language: "言語",
        search: "ポケモンを検索",
        random: "ランダムポケモン",
        pokemon1: "ポケモン 1",
        pokemon2: "ポケモン 2",
        runTest: "テストバトルを実行",
        clear: "クリア",
        winner: "予想される勝者:",
        tie: "引き分け！コインを投げる？",
        flip: "コインを投げる",
        finishedResults: "最終結果",
        recommendation: "おすすめ/説明",
        typeMatchups: "タイプ相性",
        saveMatchup: "対戦を保存",
        showSaved: "保存された対戦を表示",
        savedHeader: "保存された対戦",
        addItem: "アイテムを追加",
        selectedItem: "選択されたアイテム",
        addNature: "自然を追加",
        selectedNature: "選択した自然",
        emptySavedList: "保存された対戦は見つかりません。",
        savedEntry: "保存された対戦: "
    },
    ar: {
        language: "اللغة",
        search: "ابحث عن بوكيمون",
        random: "بوكيمون عشوائي",
        pokemon1: "بوكيمون 1",
        pokemon2: "بوكيمون 2",
        runTest: "تشغيل معركة تجريبية",
        clear: "مسح",
        winner: "الفائز المتوقع هو:",
        tie: "تعادل! هل نرمي عملة؟",
        flip: "ارمِ عملة",
        finishedResults: "النتائج النهائية",
        recommendation: "توصية/شرح",
        typeMatchups: "مواجهات الأنواع",
        saveMatchup: "حفظ المواجهة",
        showSaved: "عرض المواجهات المحفوظة",
        savedHeader: "المواجهات المحفوظة",
        addItem: "إضافة عنصر",
        selectedItem: "العنصر المحدد",
        addNature: "أضف الطبيعة",
        selectedNature: "الطبيعة المختارة",
        emptySavedList: "لم يتم العثور على مواجهات محفوظة.",
        savedEntry: "المواجهة المحفوظة: "
    },
    tr: {
        language: "Dil",
        search: "Pokémon Ara",
        random: "Rastgele Pokémon",
        pokemon1: "Pokémon 1",
        pokemon2: "Pokémon 2",
        runTest: "Test savaşı başlat",
        clear: "Temizle",
        winner: "Tahmini kazanan:",
        tie: "Berabere! Yazı tura at?",
        flip: "Yazı tura at",
        finishedResults: "Sonuçlar",
        recommendation: "Öneri/Açıklama",
        typeMatchups: "Tür Eşleşmeleri",
        saveMatchup: "Eşleşmeyi kaydet",
        showSaved: "Kayıtlı eşleşmeleri göster",
        savedHeader: "Kayıtlı Eşleşmeler",
        addItem: "Öğe ekle",
        selectedItem: "Seçilen öğe",
        addNature: "Doğa ekle",
        selectedNature: "Seçilen doğa",
        emptySavedList: "Kayıtlı eşleşme bulunamadı.",
        savedEntry: "Kayıtlı eşleşme: "
    },
    es: {
        language: "Idioma",
        search: "Buscar Pokémon",
        random: "Pokémon aleatorio",
        pokemon1: "Pokémon 1",
        pokemon2: "Pokémon 2",
        runTest: "Ejecutar batalla de prueba",
        clear: "Borrar",
        winner: "El ganador estimado es:",
        tie: "¡Es un empate! ¿Lanzar una moneda?",
        flip: "Lanzar moneda",
        finishedResults: "Resultados finales",
        recommendation: "Recomendación/Explicación",
        typeMatchups: "Enfrentamientos de tipos",
        saveMatchup: "Guardar enfrentamiento",
        showSaved: "Mostrar enfrentamientos guardados",
        savedHeader: "Enfrentamientos guardados",
        addItem: "Agregar objeto",
        selectedItem: "Objeto seleccionado",
        addNature: "Agregar naturaleza",
        selectedNature: "Naturaleza seleccionada",
        emptySavedList: "No se encontraron enfrentamientos guardados.",
        savedEntry: "Enfrentamiento guardado: "
    },
    pt: {
        language: "Idioma",
        search: "Procurar Pokémon",
        random: "Pokémon aleatório",
        pokemon1: "Pokémon 1",
        pokemon2: "Pokémon 2",
        runTest: "Executar batalha de teste",
        clear: "Limpar",
        winner: "O vencedor estimado é:",
        tie: "É um empate! Jogar uma moeda?",
        flip: "Jogar moeda",
        finishedResults: "Resultados finais",
        recommendation: "Recomendação/Explicação",
        typeMatchups: "Combinações de tipos",
        saveMatchup: "Salvar confronto",
        showSaved: "Mostrar confrontos salvos",
        savedHeader: "Confrontos Salvos",
        addItem: "Adicionar item",
        selectedItem: "Item selecionado",
        addNature: "Adicionar natureza",
        selectedNature: "Natureza selecionada",
        emptySavedList: "Nenhum confronto salvo encontrado.",
        savedEntry: "Confronto salvo: "
    }
};

// Note the use of stats for the pokemon
const statMapping = {
    'attack': 'atk',
    'defense': 'def',
    'special-attack': 'spAtk',
    'special-defense': 'spDef',
    'speed': 'speed'
};

// Both applyLanguage and changeLanguage functions are used to manage language changes
function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

function changeLanguage(lang) {
    applyLanguage(lang);
}

// Little dropdown for all the languages
function toggleLanguageDropdown() {
    const dropdown = document.getElementById("languageDropdown");
    dropdown.classList.toggle("hidden");
}

window.addEventListener("load", () => {
    const savedLang = localStorage.getItem('language') || 'nl';
    applyLanguage(savedLang);
    document.getElementById('languageSelect').value = savedLang;
});

// Fetch natures from the API and map them to our required format and possible stat changes
async function fetchNatures() {
    try {
        const res = await fetch('https://pokeapi.co/api/v2/nature?limit=100');
        const data = await res.json();
        const natureDetails = await Promise.all(data.results.map(n =>
            fetch(n.url).then(r => r.json())
        ));
        natures = natureDetails.map(n => ({
            id: n.name,
            name: n.name,
            increasedStat: n.increased_stat ? statMapping[n.increased_stat.name] : null,
            decreasedStat: n.decreased_stat ? statMapping[n.decreased_stat.name] : null
        }));
    } catch (error) {
        console.error("Failed to fetch natures:", error);
    }
}

// Fetch items from the function and map them to our required format and possible stat changes
// To add more items, follow the same structure and check getEffectiveStat and itemEffects later in this code
function initializeItems() {
    const itemEffectsMapping = {
        'choice-scarf': { speedMul: 1.25 },
        'quick-claw': { quickClaw: true },
        'focus-sash': { focusSash: true },
        'life-orb': { atkMul: 1.5, spAtkMul: 1.2, recoil: 0.1 },
        'assault-vest': { spDefMul: 1.2 },
        'iron-ball': { speedMul: 0.5 }, 
        // Iron-ball moet eigenlijk de tegenstander vertragen en de helft van die pokemon maken
        'lagging-tail': { alwaysLast: true },
        'choice-band': { atkMul: 1.5 },
        'wise-glasses': { spAtkMul: 1.8 },
        'eviolite': { defMul: 2.0, spDefMul: 2.0 },
        'power-herb': { atkMul: 1.5, defMul: 1.5 },
        'toxic-orb': { spAtkMul: 1.5, spDefMul: 0.5 },
        'sticky-barb': { atkMul: 1.2, speedDebuffOpponent: 0.7 },
        'flame-orb': { burn: true },
        'mach-bike': { speedMul: 1.8 },
        'charcoal': { fireTypeBoost: 2.0 },
        'mystic-water': { waterTypeBoost: 2.0 },
        'miracle-seed': { grassTypeBoost: 2.0 },
        'never-melt-ice': { iceTypeBoost: 2.0 },
        'sharp-beak': { flyingTypeBoost: 2.0 },
        'magnet': { electricTypeBoost: 2.0 },
        'soft-sand': { groundTypeBoost: 2.0 },
        'black-belt': { fightingTypeBoost: 2.0 },
        'poison-barb': { poisonTypeBoost: 2.0 },
        'silver-powder': { bugTypeBoost: 2.0 },
        'hard-stone': { rockTypeBoost: 2.0 },
        'spell-tag': { ghostTypeBoost: 2.0 },
        'twisted-spoon': { psychicTypeBoost: 2.0 },
        'dragon-fang': { dragonTypeBoost: 2.0 },
        'black-glasses': { darkTypeBoost: 2.0 },
        'metal-coat': { steelTypeBoost: 2.0 },
        'silk-scarf': { normalTypeBoost: 2.0 },
        'pink-bow': { normalTypeBoost: 2.0 },
        'bright-powder': { evasionBoost: true },
        'scyther-wing': { flyingTypeBoost: 2.0 },
        'thick-club': { specialAttackBoost: 2.0 },
        'light-ball': { specialAttackBoost: 2.0 },
        'quick-powder': { speedBoost: 2.0 }
    };

    // Start with a default item and effects
    items = [{
        id: "none",
        name: "None",
        effects: {}
    }];

    for (const [key, effects] of Object.entries(itemEffectsMapping)) {
        const name = key.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        items.push({
            id: key,
            name: name,
            effects: effects
        });
    }

    console.log("Items initialized from hardcoded list:", items);
}

// As it says, it renders the stats. 
// It also check for changes in stats
function renderStats(stats, types, containerId, side, selectedItemId, selectedNatureId) {
    const container = document.getElementById(containerId);
    const item = items.find(i => i.id === selectedItemId);
    const itemEffects = item ? item.effects : {};
    const nature = natures.find(n => n.id === selectedNatureId);
    const natureEffects = {
        increased: nature ?.increasedStat,
        decreased: nature ?.decreasedStat
    };

    const formatStatValue = (statName, baseValue) => {
        let value = baseValue;
        let className = '';

        const mappedStatName = statMapping[statName];
        if (mappedStatName) {
            if (natureEffects.increased === mappedStatName) {
                value = Math.round(baseValue * 1.1);
                className = 'green-stat';
            } else if (natureEffects.decreased === mappedStatName) {
                value = Math.round(baseValue * 0.9);
                className = 'red-stat';
            }
        }

        // Apply item effects of the items
        if (itemEffects.speedMul && statName === 'speed') value = Math.round(value * itemEffects.speedMul);
        if (itemEffects.atkMul && statName === 'attack') value = Math.round(value * itemEffects.atkMul);
        if (itemEffects.spAtkMul && statName === 'special-attack') value = Math.round(value * itemEffects.spAtkMul);
        if (itemEffects.defMul && statName === 'defense') value = Math.round(value * itemEffects.defMul);
        if (itemEffects.spDefMul && statName === 'special-defense') value = Math.round(value * itemEffects.spDefMul);

        // Apply opponent item effects.
        // This part still needs some work!!!! Not functional yet
        const opponentSide = side === 'one' ? 'two' : 'one';
        const opponentItem = items.find(i => i.id === document.getElementById(`selectedItem-${opponentSide}`).dataset.item);
        if (opponentItem ?.effects ?.speedDebuffOpponent && statName === 'speed') {
            value = Math.round(value * opponentItem.effects.speedDebuffOpponent);
            className = 'red-stat';
        }

        // Higher than base stat = green/ lower than base stat = red
        if (value > baseValue && !className.includes('green')) className += ' green-stat';
        if (value < baseValue && !className.includes('red')) className += ' red-stat';

        return `<td class="${className.trim()}">${value}</td>`;
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
            stats: stats,
            types: types,
            itemId: selectedItemId,
            natureId: selectedNatureId
        };
    } else {
        pokemonDataTwo = {
            stats: stats,
            types: types,
            itemId: selectedItemId,
            natureId: selectedNatureId
        };
    }
}

// Searches and fetches from the API to get information about the pokemon in order to display it
async function searchPokemon(inputId, nameId, statsId, imgId, side) {
    const name = document.getElementById(inputId).value.toLowerCase();
    if (!name) return;
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) throw new Error("Pokémon not found");
        const data = await res.json();
        document.getElementById(nameId).innerText = data.name;
        document.getElementById(imgId).src = data.sprites.front_default;

        const selectedItemId = document.getElementById(`selectedItem-${side}`).dataset.item;
        const selectedNatureId = document.getElementById(`selectedNature-${side}`).dataset.nature;
        renderStats(data.stats, data.types, statsId, side, selectedItemId, selectedNatureId);
    } catch (error) {
        alert("Pokémon niet gevonden!");
    }
}

// Chooses pokemon randomly from API
async function getRandomPokemon(nameId, statsId, imgId, side) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await res.json();
    document.getElementById(nameId).innerText = data.name;
    document.getElementById(imgId).src = data.sprites.front_default;

    const selectedItemId = document.getElementById(`selectedItem-${side}`).dataset.item;
    const selectedNatureId = document.getElementById(`selectedNature-${side}`).dataset.nature;
    renderStats(data.stats, data.types, statsId, side, selectedItemId, selectedNatureId);
}
// This part clears the chosen pokemon(s) 
// This part also needs some improvements, because it doesn't reset the selected item and nature
document.querySelector(".clearMatchUps").addEventListener("click", () => {
    document.querySelectorAll('.item-dropdown, .nature-dropdown').forEach(dropdown => dropdown.remove());
    document.getElementById("searchOneInput").value = "";
    document.getElementById("searchTwoInput").value = "";
    document.getElementById("pokemonOneName").innerText = "Pokemon 1";
    document.getElementById("pokemonTwoName").innerText = "Pokemon 2";
    document.getElementById("pokemonOneNameImg").src = "";
    document.getElementById("pokemonTwoNameImg").src = "";
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
});

// This part puts the 2 pokemon against each other to compare the stats
document.querySelector(".runTest").addEventListener("click", async () => {
    // Make sure there are 2 pokemon present in order to simulate a battle
    if (!pokemonDataOne || !pokemonDataTwo) {
        alert("Selecteer eerst beide Pokémon.");
        return;
    }

    document.getElementById("tieArea").classList.add("hidden");
    document.getElementById("coinResult").innerText = "";

    const nameOne = document.getElementById("pokemonOneName").innerText;
    const nameTwo = document.getElementById("pokemonTwoName").innerText;
    const statsOne = pokemonDataOne.stats;
    const statsTwo = pokemonDataTwo.stats;
    const typesOne = pokemonDataOne.types;
    const typesTwo = pokemonDataTwo.types;
    const itemOne = document.getElementById('selectedItem-one').dataset.item;
    const itemTwo = document.getElementById('selectedItem-two').dataset.item;
    const natureOneId = document.getElementById('selectedNature-one').dataset.nature;
    const natureTwoId = document.getElementById('selectedNature-two').dataset.nature;

    const natureOne = natures.find(n => n.id === natureOneId);
    const natureTwo = natures.find(n => n.id === natureTwoId);

    let recommendation = "";

    const typeDataOne = await Promise.all(typesOne.map(t => fetch(t.type.url).then(res => res.json())));
    const typeDataTwo = await Promise.all(typesTwo.map(t => fetch(t.type.url).then(res => res.json())));

    const getEffectiveStat = (baseStats, nature, item, statName) => {
        let statValue = baseStats.find(s => s.stat.name === statName).base_stat;
        const mappedStatName = statMapping[statName];
        if (nature ?.increasedStat === mappedStatName) statValue *= 1.1;
        if (nature ?.decreasedStat === mappedStatName) statValue *= 0.9;

        if (item ?.effects) {
            if (item.effects.speedMul && statName === 'speed') statValue *= item.effects.speedMul;
            if (item.effects.atkMul && statName === 'attack') statValue *= item.effects.atkMul;
            if (item.effects.spAtkMul && statName === 'special-attack') statValue *= item.effects.spAtkMul;
            if (item.effects.defMul && statName === 'defense') statValue *= item.effects.defMul;
            if (item.effects.spDefMul && statName === 'special-defense') statValue *= item.effects.spDefMul;
        }
        return statValue;
    };

    let actualSpeedOne = getEffectiveStat(statsOne, natureOne, items.find(i => i.id === itemOne), 'speed');
    let actualSpeedTwo = getEffectiveStat(statsTwo, natureTwo, items.find(i => i.id === itemTwo), 'speed');

    const itemEffectOne = items.find(i => i.id === itemOne).effects;
    const itemEffectTwo = items.find(i => i.id === itemTwo).effects;

    if (itemEffectTwo.speedDebuffOpponent) {
        actualSpeedOne *= itemEffectTwo.speedDebuffOpponent;
        recommendation += `${nameOne}'s snelheid wordt verlaagd door het item van ${nameTwo}. `
    }
    if (itemEffectOne.speedDebuffOpponent) {
        actualSpeedTwo *= itemEffectOne.speedDebuffOpponent;
        recommendation += `${nameTwo}'s snelheid wordt verlaagd door het item van ${nameOne}. `
    }

    let firstAttacker = "";

    if (itemEffectOne.alwaysLast) {
        firstAttacker = nameTwo;
        recommendation += `${nameTwo} mag als eerste aanvallen omdat ${nameOne} het item **Lagging Tail** draagt. `;
    } else if (itemEffectTwo.alwaysLast) {
        firstAttacker = nameOne;
        recommendation += `${nameOne} mag als eerste aanvallen omdat ${nameTwo} het item **Lagging Tail** draagt. `;
    } else if (itemEffectOne.quickClaw || itemEffectTwo.quickClaw) {
        if (itemEffectOne.quickClaw && Math.random() < 0.2) {
            firstAttacker = nameOne;
            recommendation += `${nameOne} mag als eerste aanvallen dankzij de **Quick Claw**. `
        } else if (itemEffectTwo.quickClaw && Math.random() < 0.2) {
            firstAttacker = nameTwo;
            recommendation += `${nameTwo} mag als eerste aanvallen dankzij de **Quick Claw**. `
        }
    }

    // This check purely determines the first attacker, but I would like it to do more
    if (!firstAttacker) {
        if (actualSpeedOne > actualSpeedTwo) {
            firstAttacker = nameOne;
            recommendation += `${nameOne} valt als eerste aan omdat het sneller is dan ${nameTwo}. `
        } else if (actualSpeedTwo > actualSpeedOne) {
            firstAttacker = nameTwo;
            recommendation += `${nameTwo} valt als eerste aan omdat het sneller is dan ${nameOne}. `
        } else {
            recommendation += "De Pokémon zijn even snel, de aanvalsvolgorde is willekeurig. "
            firstAttacker = Math.random() < 0.5 ? nameOne : nameTwo;
        }
    }

    const attackOne = getEffectiveStat(statsOne, natureOne, items.find(i => i.id === itemOne), 'attack');
    const spAttackOne = getEffectiveStat(statsOne, natureOne, items.find(i => i.id === itemOne), 'special-attack');
    const defenseTwo = getEffectiveStat(statsTwo, natureTwo, items.find(i => i.id === itemTwo), 'defense');
    const spDefenseTwo = getEffectiveStat(statsTwo, natureTwo, items.find(i => i.id === itemTwo), 'special-defense');

    const attackTwo = getEffectiveStat(statsTwo, natureTwo, items.find(i => i.id === itemTwo), 'attack');
    const spAttackTwo = getEffectiveStat(statsTwo, natureTwo, items.find(i => i.id === itemTwo), 'special-attack');
    const defenseOne = getEffectiveStat(statsOne, natureOne, items.find(i => i.id === itemOne), 'defense');
    const spDefenseOne = getEffectiveStat(statsOne, natureOne, items.find(i => i.id === itemOne), 'special-defense');

    let effectivenessOne = 1;
    typeDataOne.forEach(type1 => {
        typesTwo.forEach(type2 => {
            const damageRelations = type1.damage_relations;
            if (damageRelations.double_damage_to.some(t => t.name === type2.type.name)) effectivenessOne *= 2;
            if (damageRelations.half_damage_to.some(t => t.name === type2.type.name)) effectivenessOne *= 0.5;
            if (damageRelations.no_damage_to.some(t => t.name === type2.type.name)) effectivenessOne = 0;
        });
    });

    let effectivenessTwo = 1;
    typeDataTwo.forEach(type2 => {
        typesOne.forEach(type1 => {
            const damageRelations = type2.damage_relations;
            if (damageRelations.double_damage_to.some(t => t.name === type1.type.name)) effectivenessTwo *= 2;
            if (damageRelations.half_damage_to.some(t => t.name === type1.type.name)) effectivenessTwo *= 0.5;
            if (damageRelations.no_damage_to.some(t => t.name === type1.type.name)) effectivenessTwo = 0;
        });
    });

    const damageOne = Math.max(attackOne, spAttackOne) / (Math.max(defenseTwo, spDefenseTwo)) * effectivenessOne;
    const damageTwo = Math.max(attackTwo, spAttackTwo) / (Math.max(defenseOne, spDefenseOne)) * effectivenessTwo;

    // Determine the winner based on damage calculations (it can be more thorough than it is right now)
    let winner = "";
    if (damageOne > damageTwo) {
        winner = nameOne;
        recommendation += `${nameOne} heeft een voordeel gebaseerd op de types, nature en/of items tegen ${nameTwo}. De geschatte schade van ${nameOne} is hoger dan die van ${nameTwo}.`;
    } else if (damageTwo > damageOne) {
        winner = nameTwo;
        recommendation += `${nameTwo} heeft een voordeel gebaseerd op de types, nature en/of items tegen ${nameOne}. De geschatte schade van ${nameTwo} is hoger dan die van ${nameOne}.`;
        // If there is a tie because the 2 pokemon are the same, then the winner is either left (1) or right (2)
    } else {
        winner = "tie";
        recommendation += "De Pokémon zijn op basis van onze berekening gelijk. Gooi een munt op om de winnaar te bepalen.";
        document.getElementById("tieArea").classList.remove("hidden");
    }

    document.getElementById("estimatedWinner").innerText = winner === "tie" ? "" : winner;
    document.getElementById("recommendationText").innerText = recommendation;

    const currentMatchup = {
        pokemonOne: {
            name: nameOne,
            stats: statsOne,
            types: typesOne,
            img: document.getElementById("pokemonOneNameImg").src,
            itemId: itemOne,
            natureId: natureOneId
        },
        pokemonTwo: {
            name: nameTwo,
            stats: statsTwo,
            types: typesTwo,
            img: document.getElementById("pokemonTwoNameImg").src,
            itemId: itemTwo,
            natureId: natureTwoId
        }
    };
    localStorage.setItem('currentMatchup', JSON.stringify(currentMatchup));
});

// This checks which pokemon gets what item
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

// This checks which pokemon gets what nature
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
    selectedItemSpan.innerText = item.name;
    selectedItemSpan.dataset.item = itemId;
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
    selectedNatureSpan.innerText = nature.name;
    selectedNatureSpan.dataset.nature = natureId;
    const dropdown = document.querySelector(`.pokemon${side === 'one' ? 'One' : 'Two'} .nature-dropdown`);
    if (dropdown) dropdown.remove();

    if (side === 'one' && pokemonDataOne) {
        renderStats(pokemonDataOne.stats, pokemonDataOne.types, 'displayStatsOne', 'one', pokemonDataOne.itemId, natureId);
    }
    if (side === 'two' && pokemonDataTwo) {
        renderStats(pokemonDataTwo.stats, pokemonDataTwo.types, 'displayStatsTwo', 'two', pokemonDataTwo.itemId, natureId);
    }
}

// In case of a tie, the winner will be decided on a toin coss
function flipCoin() {
    const winner = Math.random() < 0.5 ? document.getElementById("pokemonOneName").innerText : document.getElementById("pokemonTwoName").innerText;
    document.getElementById("coinResult").innerText = `${winner} wint!`;
}

// If you want to save certain match ups or just keep them as a reminder you can by saving them in a localStorage
function saveMatchUp() {
    const name1 = document.getElementById("pokemonOneName").innerText;
    const name2 = document.getElementById("pokemonTwoName").innerText;
    if (name1 === "Pokemon 1" || name2 === "Pokemon 2") {
        alert("Selecteer eerst beide Pokémon om op te slaan.");
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
    alert("Match-up opgeslagen!");
}

// Makes sure that the saved match-ups are displayed
function renderSavedMatchUps() {
    const savedList = document.getElementById("savedList");
    savedList.innerHTML = "";
    const savedMatchups = JSON.parse(localStorage.getItem('savedMatchups')) || [];

    if (savedMatchups.length === 0) {
        savedList.innerHTML = `<p>${translations[currentLanguage].emptySavedList}</p>`;
        return;
    }

    savedMatchups.forEach((matchup, index) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <p><strong>${translations[currentLanguage].savedEntry}</strong> ${matchup.name1} (${matchup.nature1}) vs ${matchup.name2} (${matchup.nature2})</p>
            <p><strong>Winnaar:</strong> ${matchup.winner}</p>
            <p><small>${matchup.date}</small></p>
            <button onclick="deleteMatchUp(${index})"> 🗑️ Verwijder</button>
        `;
        savedList.appendChild(div);
    });
}

// If you don't want the saved match-up anymore, you can delete the save by pressing the deleteMatchUp button
function deleteMatchUp(index) {
    let savedMatchups = JSON.parse(localStorage.getItem('savedMatchups')) || [];
    savedMatchups.splice(index, 1);
    localStorage.setItem('savedMatchups', JSON.stringify(savedMatchups));
    renderSavedMatchUps();
}

// This makes the list of saved match-ups hidden until being told otherwise
function toggleSaved() {
    const container4 = document.getElementById("container4");
    container4.classList.toggle("hidden");
    if (!container4.classList.contains("hidden")) {
        renderSavedMatchUps();
    }
}

// Shows a little type match-up to show who is strong and weak against one other 
function showAllTypeMatchUps() {
    fetch("https://pokeapi.co/api/v2/type")
        .then(res => res.json())
        .then(data => {
            const types = data.results.map(t => t.name);
            return Promise.all(types.map(type =>
                fetch(`https://pokeapi.co/api/v2/type/${type}`).then(res => res.json())
            ));
        })
        .then(typeData => {
            let output = "";
            typeData.forEach(t => {
                output += `Type: ${t.name}\n`;
                output += `   ➕ Sterk tegen: ${t.damage_relations.double_damage_to.map(d => d.name).join(", ")}\n`;
                output += `   ➖ Zwak tegen: ${t.damage_relations.double_damage_from.map(d => d.name).join(", ")}\n\n`;
            });
            alert(output);
        });
}