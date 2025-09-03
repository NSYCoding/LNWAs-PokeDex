class Navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="navbar-content">
        <nav class="navbar">
            <div class="navbar-brand">LNWA Pokedex Deep Dive</div>
            <button class="menu-toggle">☰</button>
            <ul class="navbar-links">
            <li><a href="../index.html">Home</a></li>
            <li><a href="OakInfo.html">Oak's Laboratory</a></li>
            <li><a href="BrockInfo.html">Brock's Kitchen</a></li>
            <li><a href="MistyInfo.html">Misty's Aquarium</a></li>
            <li><a href="EvelynInfo.html">Evelyn's Training Area</a></li>
            </ul>
        </nav>
        </div>

        <link rel="stylesheet" href="../css/navbar&Footer.css">
    `;
    }
}

const footer = `
        <link rel="stylesheet" href="../css/navbar&Footer.css">
        <div id="footer-content">
            <footer class="footer">
                <p>© 2025 Pokemon Pokedex. All Rights Reserved.</p>
            </footer>
        </div>`;

class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = footer;
    }
}

customElements.define("pokemon-navbar", Navbar);
customElements.define("pokemon-footer", Footer);