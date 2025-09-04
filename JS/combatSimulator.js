import { getEffectiveStat, translations, natures, items } from './pokemonApi.js';

// Functie voor het ophalen van type-data van de API
const fetchTypeData = async (types) => {
    return Promise.all(types.map(t =>
        fetch(t.type.url).then(res => res.json())
    ));
};

// Functie voor het berekenen van de effectiviteit van aanvallen op basis van types
const getTypeEffectiveness = (attackerTypes, defenderTypes, allTypeData) => {
    let effectiveness = 1;
    attackerTypes.forEach(attType => {
        const attackerTypeData = allTypeData.find(t => t.name === attType.type.name);
        if (!attackerTypeData) return;

        defenderTypes.forEach(defType => {
            const damageRelations = attackerTypeData.damage_relations;
            if (damageRelations.double_damage_to.some(t => t.name === defType.type.name)) effectiveness *= 2;
            if (damageRelations.half_damage_to.some(t => t.name === defType.type.name)) effectiveness *= 0.5;
            if (damageRelations.no_damage_to.some(t => t.name === defType.type.name)) effectiveness = 0;
        });
    });
    return effectiveness;
};

// Functie voor de schadeberekening per aanval
const calculateDamage = (attacker, defender, allTypeData) => {
    const attackerItem = items.find(i => i.id === attacker.itemId);
    const defenderItem = items.find(i => i.id === defender.itemId);
    const attackerNature = natures.find(n => n.id === attacker.natureId);
    const defenderNature = natures.find(n => n.id === defender.natureId);

    // Bepaal aanvals- en verdedigingsstatistieken
    const attack = getEffectiveStat(attacker.stats.find(s => s.stat.name === 'attack').base_stat, 'attack', attackerNature, attackerItem);
    const spAttack = getEffectiveStat(attacker.stats.find(s => s.stat.name === 'special-attack').base_stat, 'special-attack', attackerNature, attackerItem);
    const defense = getEffectiveStat(defender.stats.find(s => s.stat.name === 'defense').base_stat, 'defense', defenderNature, defenderItem);
    const spDefense = getEffectiveStat(defender.stats.find(s => s.stat.name === 'special-defense').base_stat, 'special-defense', defenderNature, defenderItem);
    
    // Simpele aanname: de hoogste aanval-stat wordt gebruikt
    const finalAttack = Math.max(attack, spAttack);
    const finalDefense = (finalAttack === attack) ? defense : spDefense;

    // Type-effectiviteit
    const typeEffectiveness = getTypeEffectiveness(attacker.types, defender.types, allTypeData);
    
    // Type-specifieke item-boosts
    let typeBoost = 1;
    if (attackerItem && attackerItem.effects) {
        if (attackerItem.effects.fireTypeBoost && attacker.types.some(t => t.type.name === 'fire')) typeBoost = attackerItem.effects.fireTypeBoost;
        if (attackerItem.effects.waterTypeBoost && attacker.types.some(t => t.type.name === 'water')) typeBoost = attackerItem.effects.waterTypeBoost;
        // Voeg hier meer type-boosts toe...
    }

    // Bereken de schade
    // Een vereenvoudigde formule, maar meer diepgaand dan alleen vergelijken
    const baseDamage = 0.5 * (finalAttack / finalDefense);
    const damage = baseDamage * typeEffectiveness * typeBoost;

    return damage;
};

// Hoofdfunctie voor het simuleren van het gevecht
export const runCombat = async (pokemonOne, pokemonTwo) => {
    let recommendation = "";
    
    const allTypeData = await fetchTypeData([...pokemonOne.types, ...pokemonTwo.types]);

    // Bereken de effectieve snelheid inclusief nature en items
    const natureOne = natures.find(n => n.id === pokemonOne.natureId);
    const natureTwo = natures.find(n => n.id === pokemonTwo.natureId);
    const itemOne = items.find(i => i.id === pokemonOne.itemId);
    const itemTwo = items.find(i => i.id === pokemonTwo.itemId);

    let speedOne = getEffectiveStat(pokemonOne.stats.find(s => s.stat.name === 'speed').base_stat, 'speed', natureOne, itemOne);
    let speedTwo = getEffectiveStat(pokemonTwo.stats.find(s => s.stat.name === 'speed').base_stat, 'speed', natureTwo, itemTwo);

    // Verwerk snelheid-gerelateerde item-effecten
    if (itemTwo.effects.speedDebuffOpponent) {
        speedOne *= itemTwo.effects.speedDebuffOpponent;
        recommendation += `${pokemonOne.name}'s snelheid is verlaagd door het item van ${pokemonTwo.name}. `;
    }
    if (itemOne.effects.speedDebuffOpponent) {
        speedTwo *= itemOne.effects.speedDebuffOpponent;
        recommendation += `${pokemonTwo.name}'s snelheid is verlaagd door het item van ${pokemonOne.name}. `;
    }

    let firstAttacker = null;
    let secondAttacker = null;

    // Check voor 'altijd laatste' items zoals Lagging Tail
    if (itemOne.effects.alwaysLast && !itemTwo.effects.alwaysLast) {
        firstAttacker = pokemonTwo;
        secondAttacker = pokemonOne;
        recommendation += `${pokemonTwo.name} valt als eerste aan omdat ${pokemonOne.name} het item **Lagging Tail** draagt. `;
    } else if (itemTwo.effects.alwaysLast && !itemOne.effects.alwaysLast) {
        firstAttacker = pokemonOne;
        secondAttacker = pokemonTwo;
        recommendation += `${pokemonOne.name} valt als eerste aan omdat ${pokemonTwo.name} het item **Lagging Tail** draagt. `;
    } 
    // Check voor 'kans-gebaseerde' items zoals Quick Claw
    else if (itemOne.effects.quickClaw && Math.random() < 0.2) {
        firstAttacker = pokemonOne;
        secondAttacker = pokemonTwo;
        recommendation += `${pokemonOne.name} mag als eerste aanvallen dankzij de **Quick Claw** (20% kans). `;
    } else if (itemTwo.effects.quickClaw && Math.random() < 0.2) {
        firstAttacker = pokemonTwo;
        secondAttacker = pokemonOne;
        recommendation += `${pokemonTwo.name} mag als eerste aanvallen dankzij de **Quick Claw** (20% kans). `;
    } 
    // Val terug op de snelheid-stat als geen van de speciale item-effecten van toepassing is
    else {
        if (speedOne > speedTwo) {
            firstAttacker = pokemonOne;
            secondAttacker = pokemonTwo;
            recommendation += `${pokemonOne.name} valt als eerste aan omdat het sneller is dan ${pokemonTwo.name}. `;
        } else if (speedTwo > speedOne) {
            firstAttacker = pokemonTwo;
            secondAttacker = pokemonOne;
            recommendation += `${pokemonTwo.name} valt als eerste aan omdat het sneller is dan ${pokemonOne.name}. `;
        } else {
            recommendation += "De Pokémon zijn even snel, de aanvalsvolgorde is willekeurig. ";
            firstAttacker = Math.random() < 0.5 ? pokemonOne : pokemonTwo;
            secondAttacker = (firstAttacker === pokemonOne) ? pokemonTwo : pokemonOne;
        }
    }

    // Simuleer het gevecht ronde per ronde
    let currentHP_One = pokemonOne.stats.find(s => s.stat.name === 'hp').base_stat;
    let currentHP_Two = pokemonTwo.stats.find(s => s.stat.name === 'hp').base_stat;
    let winner = null;
    
    // Check voor Focus Sash, die een aanval overleeft met 1HP
    const hasFocusSashOne = itemOne.effects.focusSash;
    const hasFocusSashTwo = itemTwo.effects.focusSash;

    // Bereken schade in rondes
    const damageOne = calculateDamage(pokemonOne, pokemonTwo, allTypeData);
    const damageTwo = calculateDamage(pokemonTwo, pokemonOne, allTypeData);
    
    let round = 1;

    while (winner === null && round < 100) { // Max 100 rondes om oneindige loops te voorkomen
        // Eerste aanvaller
        if (firstAttacker === pokemonOne) {
            currentHP_Two -= damageOne;
            recommendation += `\nRonde ${round}: ${pokemonOne.name} valt aan en doet ${damageOne.toFixed(2)} schade. ${pokemonTwo.name} heeft nog ${Math.max(0, currentHP_Two).toFixed(2)} HP over.`;

            if (currentHP_Two <= 0) {
                if (hasFocusSashTwo && currentHP_Two <= 0) {
                    currentHP_Two = 1;
                    recommendation += ` Maar ${pokemonTwo.name} overleeft dankzij de **Focus Sash**!`;
                } else {
                    winner = pokemonOne.name;
                    break;
                }
            }

            // Tweede aanvaller
            currentHP_One -= damageTwo;
            recommendation += `\n${pokemonTwo.name} valt aan en doet ${damageTwo.toFixed(2)} schade. ${pokemonOne.name} heeft nog ${Math.max(0, currentHP_One).toFixed(2)} HP over.`;
            if (currentHP_One <= 0) {
                if (hasFocusSashOne && currentHP_One <= 0) {
                    currentHP_One = 1;
                    recommendation += ` Maar ${pokemonOne.name} overleeft dankzij de **Focus Sash**!`;
                } else {
                    winner = pokemonTwo.name;
                    break;
                }
            }
        } else { // Eerste aanvaller is pokemonTwo
            currentHP_One -= damageTwo;
            recommendation += `\nRonde ${round}: ${pokemonTwo.name} valt aan en doet ${damageTwo.toFixed(2)} schade. ${pokemonOne.name} heeft nog ${Math.max(0, currentHP_One).toFixed(2)} HP over.`;
            if (currentHP_One <= 0) {
                if (hasFocusSashOne && currentHP_One <= 0) {
                    currentHP_One = 1;
                    recommendation += ` Maar ${pokemonOne.name} overleeft dankzij de **Focus Sash**!`;
                } else {
                    winner = pokemonTwo.name;
                    break;
                }
            }
            
            currentHP_Two -= damageOne;
            recommendation += `\n${pokemonOne.name} valt aan en doet ${damageOne.toFixed(2)} schade. ${pokemonTwo.name} heeft nog ${Math.max(0, currentHP_Two).toFixed(2)} HP over.`;
            if (currentHP_Two <= 0) {
                if (hasFocusSashTwo && currentHP_Two <= 0) {
                    currentHP_Two = 1;
                    recommendation += ` Maar ${pokemonTwo.name} overleeft dankzij de **Focus Sash**!`;
                } else {
                    winner = pokemonOne.name;
                    break;
                }
            }
        }

        // Breek de loop als er een winnaar is
        if (winner) break;

        // Als er geen winnaar is en de HP's niet dalen, is het een gelijkspel
        if (damageOne === 0 && damageTwo === 0) {
            winner = 'tie';
            recommendation += `\nBeide Pokémon kunnen geen schade aan elkaar toebrengen, het is een gelijkspel.`;
            break;
        }

        round++;
    }

    if (!winner) {
        winner = 'tie';
        recommendation += `\nDe gevechtssimulatie bereikte de maximale rondes, wat duidt op een zeer langdurig gevecht of een patstelling.`;
    }

    return { winner: winner, recommendation: recommendation };
};