window.addEventListener("load", () => {
    const nameOrId = Math.floor(Math.random() * 1000) + 1;
    fetchPokemons(nameOrId);
    fetchPokemonSpecies(nameOrId);
});

// searching functions
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('pokemonSearch');

searchBtn.addEventListener('click', () => handleSearch(searchInput.value.trim()));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch(searchInput.value.trim());
});

function handleSearch(nameOrId) {
    if (!nameOrId) {
        console.warn('Please enter a Pokémon name or ID');
        return;
    }
    console.log('Searching for:', nameOrId);
    fetchPokemons(nameOrId);
    fetchPokemonSpecies(nameOrId);
}


function fetchPokemons(Id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${Id}`)
    .then((res) => res.json())
    .then((data) => {
        displayPokemon(data);
        fetchLocations(data.location_area_encounters);
        //console.log(data);
        
    })
    .catch((err) => console.log(err));
}

function fetchPokemonSpecies(Id) {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${Id}/`)
    .then((res) => res.json())
    .then((data) => {
        //console.log(data);
        let evolutionChainId = data.evolution_chain.url.split("/").slice(-2, -1)[0];
        fetchEvolutions(evolutionChainId);
    })
    .catch((err) => console.log(err));
}

function fetchEvolutions(Id) {
    fetch(`https://pokeapi.co/api/v2/evolution-chain/${Id}/`)
        .then((res) => res.json())
        .then((data) => {
            displayEvolutions(data);
            //console.log(data);
        })
        .catch((err) => console.log(err));
}

function fetchLocations(url) {
    fetch(`${url}`)
    .then((res) => res.json())
    .then((data) => {
        DisplayLocations(data);
        //console.log(data);
    })
    .catch((err) => console.log(err));
}

function fetechTypes(type1, type2) {
    const requests = [
        fetch(`https://pokeapi.co/api/v2/type/${type1}/`).then(res => res.json())
    ];

    // only fetch type2 if it exists
    if (type2) {
        requests.push(fetch(`https://pokeapi.co/api/v2/type/${type2}/`).then(res => res.json()));
    }

    Promise.all(requests)
        .then(([data1, data2]) => {
            console.log("Type 1 data:", data1);
            if (data2) console.log("Type 2 data:", data2);

            DisplayStrengthWeakness(data1, data2);
        })
        .catch(err => console.error(err));
}


function displayPokemon(pokemon) {
    const pokemonName = document.getElementById("pokemonName");
    const pokemonType1 = document.getElementById("pokemonType1");
    const pokemonType2 = document.getElementById("pokemonType2");
    const container = document.getElementById("PokeImg");
    pokemonName.innerText = pokemon.name;
    //console.log(pokemon);
    fetechTypes(pokemon.types[0].type.name, pokemon.types[1]?.type.name);

    // Set the background image of the container
    if (
        pokemon.sprites &&
        pokemon.sprites.other &&
        pokemon.sprites.other["official-artwork"] &&
        pokemon.sprites.other["official-artwork"].front_default
    ) {
        container.innerHTML = `<img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="">`;  
    } 

    // Display the Pokemon types
    if (pokemon.types.length > 0) {
        pokemonType1.innerText = pokemon.types[0].type.name;
        pokemonType1.style.backgroundColor = getTypeColor(pokemon.types[0].type.name);
    } else {
        pokemonType1.innerText = "???";
        pokemonType1.style.backgroundColor = "transparent";
    }

    if (pokemon.types.length > 1) {
        pokemonType2.innerText = pokemon.types[1].type.name;
        pokemonType2.style.backgroundColor = getTypeColor(pokemon.types[1].type.name);
    } else {
        pokemonType2.innerText = "";
        pokemonType2.style.backgroundColor = "transparent";
    }
}

function displayEvolutions(data) {
    const evolutionChain = document.getElementById("evolutionChain");
    evolutionChain.innerHTML = "";

    // Build a tree where each branch carries its own evolution 'via' details
    const tree = buildTreeWithDetails(data.chain);

    // Render the full tree starting at the root
    renderEvolutionNode(tree, evolutionChain);
}

function DisplayLocations(data) {
    //console.log(data);
    const locationsDiv = document.getElementById("locations");
    locationsDiv.innerHTML = "";

    if (data == null || data.length == 0) {
        locationsDiv.innerHTML = "<p>No locations found.</p>";
    } else {
        for (let i = 0; i < data.length; i++) {

            // Assuming data[i].location_area.name contains something like "route-22"
            let rawName = data[i].location_area.name;

            // Remove hyphens and capitalize each word
            let formattedName = rawName
            .split('-') // Split by hyphen
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(' '); // Join with space

            const PokelocationsDiv = document.createElement("div");
            PokelocationsDiv.classList.add("Pokelocations");

            PokelocationsDiv.innerHTML = `
            <div">
                <h3>${formattedName}</h3>
                <p>${data[i].version_details[0].encounter_details[0].method.name}</p>
                <p>${data[i].version_details[0].encounter_details[0].chance} %</p>
                <p>${data[i].version_details[0].encounter_details[0].min_level} lvl - ${data[i].version_details[0].encounter_details[0].max_level} lvl</p>
            </div>`;
            locationsDiv.appendChild(PokelocationsDiv);
        }
    }
}

function DisplayStrengthWeakness(type1, type2) {
    const multipliersTaken = calculateTypeMultipliers(type1, type2, "from"); // damage taken
    const multipliersDealt = calculateTypeMultipliers(type1, type2, "to");   // damage dealt

    const strengths = [];
    const weaknesses = [];
    const resistances = [];

    // --- Damage taken (defense side) ---
    for (const [typeName, multiplier] of Object.entries(multipliersTaken)) {
        if (multiplier > 1) {
            weaknesses.push({ name: typeName, value: multiplier });
        } else if (multiplier < 1 && multiplier > 0) {
            resistances.push({ name: typeName, value: multiplier });
        } else if (multiplier === 0) {
            resistances.push({ name: typeName, value: "0" });
        }
    }

    // --- Damage dealt (offense side) ---
    for (const [typeName, multiplier] of Object.entries(multipliersDealt)) {
        if (multiplier > 1) {
            strengths.push({ name: typeName, value: multiplier });
        }
    }

    makeStrengthsCard(strengths);
    makeWeaknessCard(weaknesses);
    makeResistancesCard(resistances);
}

function calculateTypeMultipliers(type1, type2, mode = "from") {
    const multipliers = {};

    function applyRelations(typeData) {
        if (mode === "from") {
            // Damage taken
            typeData.damage_relations.double_damage_from.forEach(t => {
                multipliers[t.name] = (multipliers[t.name] || 1) * 2;
            });
            typeData.damage_relations.half_damage_from.forEach(t => {
                multipliers[t.name] = (multipliers[t.name] || 1) * 0.5;
            });
            typeData.damage_relations.no_damage_from.forEach(t => {
                multipliers[t.name] = 0;
            });
        } else {
            // Damage dealt
            typeData.damage_relations.double_damage_to.forEach(t => {
                multipliers[t.name] = (multipliers[t.name] || 1) * 2;
            });
            typeData.damage_relations.half_damage_to.forEach(t => {
                multipliers[t.name] = (multipliers[t.name] || 1) * 0.5;
            });
            typeData.damage_relations.no_damage_to.forEach(t => {
                multipliers[t.name] = 0;
            });
        }
    }

    applyRelations(type1);
    if (type2) applyRelations(type2);

    return multipliers;
}

function makeStrengthsCard(strengths) {
    const strengthsDiv = document.getElementById("strengthsList");
    strengthsDiv.innerHTML = "";

    if (!strengths.length) {
        strengthsDiv.innerHTML = "<p>No strengths found.</p>";
        return;
    }

    strengths.forEach(s => {
        const div = document.createElement("div");
        div.classList.add("pokemonType");
        div.innerHTML = `<p>${s.name}: ${s.value}x</p>`;
        div.style.backgroundColor = getTypeColor(s.name); // 🔹 Add color
        strengthsDiv.appendChild(div);
    });
}

function makeWeaknessCard(weaknesses) {
    const weaknessesDiv = document.getElementById("weaknessesList");
    weaknessesDiv.innerHTML = "";

    if (!weaknesses.length) {
        weaknessesDiv.innerHTML = "<p>No weaknesses found.</p>";
        return;
    }

    weaknesses.forEach(s => {
        const div = document.createElement("div");
        div.classList.add("pokemonType");
        div.innerHTML = `<p>${s.name}: ${s.value}x</p>`;
        div.style.backgroundColor = getTypeColor(s.name); // 🔹 Add color
        weaknessesDiv.appendChild(div);
    });
}

function makeResistancesCard(resistances) {
    const resistancesDiv = document.getElementById("resistancesList");
    resistancesDiv.innerHTML = "";

    if (!resistances.length) {
        resistancesDiv.innerHTML = "<p>No resistances or immunities found.</p>";
        return;
    }

    resistances.forEach(r => {
        const div = document.createElement("div");
        div.classList.add("pokemonType");
        div.innerHTML = `<p>${r.name}: ${r.value}x</p>`;
        div.style.backgroundColor = getTypeColor(r.name); // 🔹 Add color
        resistancesDiv.appendChild(div);
    });
}

function getTypeColor(type) {
    const typeColors = {
        normal: "#a8a878",
        fire: "#f08030",
        water: "#6890f0",
        electric: "#f8d030",
        grass: "#78c850",
        ice: "#98d8d8",
        fighting: "#c03028",
        poison: "#a040a0",
        ground: "#e0c068",
        flying: "#a890f0",
        psychic: "#f85888",
        bug: "#a8b820",
        rock: "#b8a038",
        ghost: "#705898",
        dragon: "#7038f8",
        dark: "#705848",
        steel: "#b8b8d0",
        fairy: "#ee99ac",
    };
    return typeColors[type] || "#68a090";
}

function buildTreeWithDetails(node) {
    // Return a tree where each child carries its own 'via' evolution details
    return {
        name: node.species.name,
        url: node.species.url,
        evolves_to: node.evolves_to.map(next => ({
            name: next.species.name,
            url: next.species.url,
            via: next.evolution_details?.at(-1) || null,
            evolves_to: buildTreeWithDetails(next).evolves_to
        }))
    };
}

function formatEvolutionMethod(details) {
    if (!details) return "";
    let evoText = "Evolves via:";
    if (details.min_level) evoText += ` Level ${details.min_level}`;
    if (details.item?.name) evoText += ` Use ${details.item.name}`;
    if (details.trigger?.name) evoText += ` (${details.trigger.name})`;
    if (details.needs_overworld_rain) evoText += " (while raining)";
    if (details.time_of_day) evoText += ` (${details.time_of_day})`;
    if (details.min_happiness) evoText += ` (Min Happiness: ${details.min_happiness})`;
    if (details.min_beauty) evoText += ` (Min Beauty: ${details.min_beauty})`;
    if (details.min_affection) evoText += ` (Min Affection: ${details.min_affection})`;
    if (details.held_item?.name) evoText += ` Hold ${details.held_item.name}`;
    if (details.known_move?.name) evoText += ` Knows move ${details.known_move.name}`;
    if (details.known_move_type?.name) evoText += ` Knows move type ${details.known_move_type.name}`;
    if (details.location?.name) evoText += ` At location ${details.location.name}`;
    if (details.party_species?.name) evoText += ` With ${details.party_species.name} in party`;
    if (details.party_type?.name) evoText += ` With type ${details.party_type.name} in party`;
    if (details.relative_physical_stats != null) evoText += ` (Relative Physical Stats: ${details.relative_physical_stats})`;
    if (details.trade_species?.name) evoText += ` Trade for ${details.trade_species.name}`;
    if (details.turn_upside_down) evoText += " (Turn device upside down)";
    if (details.gender != null) evoText += ` (Gender: ${details.gender === 1 ? "Female" : "Male"})`;
    return evoText;
}

function makePokeCard(name, url) {
    const idMatch = url.match(/\/pokemon-species\/(\d+)\//);
    const pokeId = idMatch ? idMatch[1] : null;
    const imgUrl = pokeId
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`
        : "";

    const card = document.createElement("div");
    card.className = "poke-card";

    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = name;
    img.className = "poke-card__img";

    const label = document.createElement("div");
    label.innerText = name;
    label.className = "poke-card__label";

    card.appendChild(img);
    card.appendChild(label);
    return card;
}

function renderEvolutionNode(node, container) {
    // Render this node
    const nodeWrapper = document.createElement("div");
    nodeWrapper.className = "evo-node";

    const nodeCard = makePokeCard(node.name, node.url);
    nodeWrapper.appendChild(nodeCard);

    // Render children (split evolutions)
    if (node.evolves_to && node.evolves_to.length > 0) {
        const branchContainer = document.createElement("div");
        branchContainer.className = "evo-branch";

        node.evolves_to.forEach(child => {
            const childWrapper = document.createElement("div");
            childWrapper.className = "evo-child";

            // Optional: a thin connector line
            const connector = document.createElement("div");
            connector.className = "evo-connector";

            // Evolution method text (edge label)
            const method = formatEvolutionMethod(child.via);
            if (method) {
                const methodDiv = document.createElement("div");
                methodDiv.innerText = method;
                methodDiv.className = "evo-method";
                childWrapper.appendChild(methodDiv);
            }

            childWrapper.appendChild(connector);

            // Render the child node card (recurse)
            const childNode = {
                name: child.name,
                url: child.url,
                evolves_to: child.evolves_to
            };
            renderEvolutionNode(childNode, childWrapper);

            branchContainer.appendChild(childWrapper);
        });

        nodeWrapper.appendChild(branchContainer);
    }

    container.appendChild(nodeWrapper);
}