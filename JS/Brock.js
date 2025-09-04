import './navbar.js';
const findToolsButton = document.getElementById('findToolsButton');

findToolsButton.addEventListener('click', () => {
    alert('Finding tools...');
    setTimeout(() => {
        window.location.href = "../Pages/BrockTools.html";
    }, 2000);
});

