class WaterPokeDex {
    constructor() {
        this.waterPokemon = [];
        this.allPokemon = [];
        this.habitatData = {};
        this.colorData = {};
        this.currentFilter = {
            habitat: '',
            color: '',
            form: '',
            search: ''
        };
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadWaterTypePokemon();
        this.updateStats();
        this.scrollToSection();
    }

    setupEventListeners() {
        // searching functions
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('pokemon-search');
        
        searchBtn?.addEventListener('click', () => this.handleSearch());
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // filtering functions
        const habitatFilter = document.getElementById('habitat-filter');
        const colorFilter = document.getElementById('color-filter');
        const formFilter = document.getElementById('form-filter');

        habitatFilter?.addEventListener('change', (e) => {
            this.currentFilter.habitat = e.target.value;
            this.filterPokemon();
        });

        colorFilter?.addEventListener('change', (e) => {
            this.currentFilter.color = e.target.value;
            this.filterPokemon();
        });

        formFilter?.addEventListener('change', (e) => {
            this.currentFilter.form = e.target.value;
            this.filterPokemon();
        });

    
        const modal = document.getElementById('pokemon-modal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn?.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // habitat card
        document.querySelectorAll('.habitat-card').forEach(card => {
            card.addEventListener('click', () => {
                const habitat = card.dataset.habitat;
                document.getElementById('habitat-filter').value = habitat;
                this.currentFilter.habitat = habitat;
                this.filterPokemon();
                document.getElementById('pokedex').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    scrollToSection() {
        // smoother scrolling with navigating
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    async loadWaterTypePokemon() {
        try {
            
        
            const waterTypeResponse = await fetch('https://pokeapi.co/api/v2/type/water');
            const waterTypeData = await waterTypeResponse.json();
            
            // fetch first 50 pokemons > better performance(voor nu)
            const pokemonUrls = waterTypeData.pokemon.slice(0).map(p => p.pokemon.url);
            
            const pokemonPromises = pokemonUrls.map(url => this.fetchPokemonDetails(url));
            const pokemonResults = await Promise.all(pokemonPromises);
            
            // filter out the failed requests
            this.waterPokemon = pokemonResults.filter(pokemon => pokemon !== null);
            this.allPokemon = [...this.waterPokemon];
            
            console.log(`Loaded ${this.waterPokemon.length} water-type Pokémon`);
            
            await this.enrichPokemonData();
            this.displayPokemon(this.waterPokemon);
            this.updateHabitatCounts();
            
        } catch (error) {
            console.error('Error loading water-type Pokémon:', error);
            this.showError('Failed to load Pokémon data.');
        }
    }

    async fetchPokemonDetails(url) {

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch');
            
            const pokemon = await response.json();
            
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.other['official-artwork']?.front_default || 
                       pokemon.sprites.front_default,
                types: pokemon.types.map(t => t.type.name),
                height: pokemon.height,
                weight: pokemon.weight,
                abilities: pokemon.abilities.map(a => a.ability.name),
                stats: pokemon.stats,
                species_url: pokemon.species.url
            };
        } catch (error) {
            console.error(`Error fetching Pokémon from ${url}:`, error);
            return null;
        }
    }


    async enrichPokemonData() {
        
        const enrichPromises = this.waterPokemon.map(async (pokemon) => {
            try {
                // get pokemon data for habitat and color
                const speciesResponse = await fetch(pokemon.species_url);
                const speciesData = await speciesResponse.json();
                
                pokemon.color = speciesData.color?.name || 'unknown';
                pokemon.habitat = speciesData.habitat?.name || 'unknown';
                
                // add form variations
                pokemon.forms = await this.getPokemonForms(pokemon.name);
                
                // track data for the statistics
                this.trackHabitatData(pokemon.habitat);
                this.trackColorData(pokemon.color);
                
                return pokemon;
            } catch (error) {
                console.error(`Error enriching data for ${pokemon.name}:`, error);
                pokemon.color = 'unknown';
                pokemon.habitat = 'unknown';
                pokemon.forms = ['normal'];
                return pokemon;
            }
        });
        
        await Promise.all(enrichPromises);
        console.log('Pokemon data enrichment for studies complete');
    }

    async getPokemonForms(pokemonName) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const data = await response.json();
            
            const forms = ['normal'];
            
            // checking for common form variations
            if (pokemonName.includes('alolan')) forms.push('alolan');
            if (pokemonName.includes('galarian')) forms.push('galarian');
            if (pokemonName.includes('mega')) forms.push('mega');
            
            return forms;
        } catch (error) {
            return ['normal'];
        }
    }

    trackHabitatData(habitat) {
        if (!this.habitatData[habitat]) {
            this.habitatData[habitat] = 0;
        }
        this.habitatData[habitat]++;
    }

    trackColorData(color) {
        if (!this.colorData[color]) {
            this.colorData[color] = 0;
        }
        this.colorData[color]++;
    }

    displayPokemon(pokemonList) {
        const grid = document.getElementById('pokemon-grid');
        if (!grid) return;

        if (pokemonList.length === 0) {
            grid.innerHTML = '<div class="loading">No Pokemon matching the criteria found.</div>';
            return;
        }

        grid.innerHTML = pokemonList.map(pokemon => this.createPokemonCard(pokemon)).join('');
        
        grid.querySelectorAll('.pokemon-card').forEach((card, index) => {
            card.addEventListener('click', () => this.showPokemonDetails(pokemonList[index]));
        });
    }

    createPokemonCard(pokemon) {
        const typesBadges = pokemon.types.map(type => 
            `<span class="type-badge type-${type}">${type}</span>`
        ).join('');

        return `
            <div class="pokemon-card" data-id="${pokemon.id}">
                <img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-image" loading="lazy">
                <h3 class="pokemon-name">${this.capitalizeName(pokemon.name)}</h3>
                <p class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</p>
                <div class="pokemon-types">${typesBadges}</div>
                <div class="pokemon-info">
                    <span class="pokemon-habitat">${this.capitalizeName(pokemon.habitat)}</span>
                    <span class="pokemon-color">${this.capitalizeName(pokemon.color)}</span>
                </div>
            </div>
        `;
    }

    showPokemonDetails(pokemon) {
        const modal = document.getElementById('pokemon-modal');
        const detailsContainer = document.getElementById('pokemon-details');
        
        if (!modal || !detailsContainer) return;

        const typesBadges = pokemon.types.map(type => 
            `<span class="type-badge type-${type}">${type}</span>`
        ).join('');

        const abilitiesList = pokemon.abilities.map(ability => 
            `<li>${this.capitalizeName(ability)}</li>`
        ).join('');

        const statsList = pokemon.stats.map(stat => 
            `<div class="stat-row">
                <span class="stat-name">${this.capitalizeName(stat.stat.name)}:</span>
                <span class="stat-value">${stat.base_stat}</span>
                <div class="stat-bar">
                    <div class="stat-fill" style="width: ${(stat.base_stat / 200) * 100}%"></div>
                </div>
            </div>`
        ).join('');

        detailsContainer.innerHTML = `
            <div class="pokemon-detail-content">
                <div class="pokemon-detail-header">
                    <img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-detail-image">
                    <div class="pokemon-detail-info">
                        <h2>${this.capitalizeName(pokemon.name)}</h2>
                        <p class="pokemon-detail-id">#${pokemon.id.toString().padStart(3, '0')}</p>
                        <div class="pokemon-types">${typesBadges}</div>
                    </div>
                </div>
                
                <div class="pokemon-detail-body">
                    <div class="detail-section">
                        <h3>Physical Characteristics</h3>
                        <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
                        <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
                        <p><strong>Color:</strong> ${this.capitalizeName(pokemon.color)}</p>
                        <p><strong>Habitat:</strong> ${this.capitalizeName(pokemon.habitat)}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Abilities</h3>
                        <ul class="abilities-list">${abilitiesList}</ul>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Base Stats</h3>
                        <div class="stats-container">${statsList}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Conservation Notes</h3>
                        <p>This ${this.capitalizeName(pokemon.habitat)} dwelling Pokémon plays a crucial role in maintaining aquatic ecosystem balance. Conservation efforts focus on protecting their natural habitat and ensuring sustainable water quality.</p>
                    </div>
                </div>
            </div>
        `;

        // styles voor modal
        this.addModalStyles();
        modal.style.display = 'block';
    }

    addModalStyles() {
        if (!document.getElementById('modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                .pokemon-detail-content {
                    max-width: 100%;
                }
                
                .pokemon-detail-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #f0f0f0;
                }
                
                .pokemon-detail-image {
                    width: 150px;
                    height: 150px;
                    object-fit: contain;
                }
                
                .pokemon-detail-info h2 {
                    margin: 0 0 10px 0;
                    color: #333;
                    font-size: 2rem;
                }
                
                .pokemon-detail-id {
                    color: #666;
                    font-size: 1.2rem;
                    margin-bottom: 15px;
                }
                
                .detail-section {
                    margin-bottom: 25px;
                }
                
                .detail-section h3 {
                    color: #4682B4;
                    margin-bottom: 15px;
                    font-size: 1.3rem;
                }
                
                .abilities-list {
                    list-style: none;
                    padding: 0;
                }
                
                .abilities-list li {
                    background: #f0f8ff;
                    padding: 8px 15px;
                    margin: 5px 0;
                    border-radius: 15px;
                    display: inline-block;
                    margin-right: 10px;
                }
                
                .stat-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    gap: 15px;
                }
                
                .stat-name {
                    min-width: 120px;
                    font-weight: bold;
                }
                
                .stat-value {
                    min-width: 40px;
                    text-align: right;
                    font-weight: bold;
                    color: #4682B4;
                }
                
                .stat-bar {
                    flex: 1;
                    height: 20px;
                    background: #e0e0e0;
                    border-radius: 10px;
                    overflow: hidden;
                }
                
                .stat-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4FC3F7, #29B6F6);
                    transition: width 0.3s ease;
                }
                
                @media (max-width: 600px) {
                    .pokemon-detail-header {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .stat-row {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .stat-name, .stat-value {
                        text-align: center;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    handleSearch() {
        const searchInput = document.getElementById('pokemon-search');
        if (!searchInput) return;

        this.currentFilter.search = searchInput.value.toLowerCase().trim();
        this.filterPokemon();
    }

    // filtering functions
    filterPokemon() {
        let filteredPokemon = [...this.allPokemon];

        if (this.currentFilter.search) {
            filteredPokemon = filteredPokemon.filter(pokemon => 
                pokemon.name.toLowerCase().includes(this.currentFilter.search) ||
                pokemon.id.toString().includes(this.currentFilter.search)
            );
        }

        if (this.currentFilter.habitat) {
            filteredPokemon = filteredPokemon.filter(pokemon => 
                pokemon.habitat === this.currentFilter.habitat
            );
        }

        if (this.currentFilter.color) {
            filteredPokemon = filteredPokemon.filter(pokemon => 
                pokemon.color === this.currentFilter.color
            );
        }

        if (this.currentFilter.form && this.currentFilter.form !== 'normal') {
            filteredPokemon = filteredPokemon.filter(pokemon => 
                pokemon.forms && pokemon.forms.includes(this.currentFilter.form)
            );
        }

        this.displayPokemon(filteredPokemon);
    }

    updateHabitatCounts() {
        //   updating habitat card counts
        document.querySelectorAll('.habitat-card').forEach(card => {
            const habitat = card.dataset.habitat;
            const count = this.habitatData[habitat] || 0;
            const countElement = card.querySelector('.pokemon-count');
            if (countElement) {
                countElement.textContent = `${count} Pokémon`;
            }
        });
    }

    updateStats() {
        // update statistics dashboard
        const totalWaterPokemon = document.getElementById('total-water-pokemon');
        const habitatsStudied = document.getElementById('habitats-studied');
        const colorVariations = document.getElementById('color-variations');

        if (totalWaterPokemon) {
            totalWaterPokemon.textContent = this.waterPokemon.length;
        }

        if (habitatsStudied) {
            habitatsStudied.textContent = Object.keys(this.habitatData).length;
        }

        if (colorVariations) {
            colorVariations.textContent = Object.keys(this.colorData).length;
        }

        //  animeerd de nummers in dashboard
        this.animateNumbers();
    }

    animateNumbers() {
        document.querySelectorAll('.stat-number').forEach(element => {
            const finalValue = parseInt(element.textContent);
            let currentValue = 0;
            const increment = Math.ceil(finalValue / 50);
            
            const updateNumber = () => {
                if (currentValue < finalValue) {
                    currentValue += increment;
                    if (currentValue > finalValue) currentValue = finalValue;
                    element.textContent = currentValue;
                    setTimeout(updateNumber, 50);
                }
            };
            
            element.textContent = '0';
            updateNumber();
        });
    }

    capitalizeName(name) {
        if (!name || name === 'unknown') return 'Unknown';
        return name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    showError(message) {
        const grid = document.getElementById('pokemon-grid');
        if (grid) {
            grid.innerHTML = `<div class="loading" style="color: #ff6b6b;">${message}</div>`;
        }
    }
}


// Initialize the PokeDex when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('check ');
    new WaterPokeDex();
});
