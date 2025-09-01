let pokemonimage = ``;
const pokemonName = document.getElementById("pokemonName");
const pokemonType1 = document.getElementById("pokemonType1");
const pokemonType2 = document.getElementById("pokemonType2");
const container = document.getElementById("containerDisplay");

window.addEventListener("load", () => {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    fetchPokemons(randomId);
});

function fetchPokemons(pokemonId) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then((res) => res.json())
        .then((data) => {
            displayPokemon(data);
        })
        .catch((err) => console.log(err));
}

function displayPokemon(pokemon) {
    pokemonName.innerText = pokemon.name;

    // Set the background image of the container
    if (
        pokemon.sprites &&
        pokemon.sprites.other &&
        pokemon.sprites.other["official-artwork"] &&
        pokemon.sprites.other["official-artwork"].front_default
    ) {
        container.style.backgroundImage = `url(${pokemon.sprites.other["official-artwork"].front_default})`;
        pokemonimage = `${pokemon.sprites.other["official-artwork"].front_default}`;
    } else {
        container.style.backgroundImage = "none";
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

