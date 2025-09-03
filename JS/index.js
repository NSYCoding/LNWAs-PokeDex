const brockLink = document.getElementById("brockSelected");
const mistyLink = document.getElementById("mistySelected");
const oakLink = document.getElementById("oakSelected");
const evelynLink = document.getElementById("evelynSelected");

// Add event links
const links = [brockLink, oakLink, mistyLink, evelynLink];

links.forEach(link => {
    if (link) {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.setItem("selectedLink", link.textContent);
            window.location.href = "../pages/Loading.html";
        });
    }
});

document.addEventListener("keydown", (event) => {
    const currentIndex = links.findIndex(link => link === document.activeElement);
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % links.length;
    } else if (event.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + links.length) % links.length;
    } else {
        return;
    }

    links[nextIndex].focus();
    links.forEach(link => link.classList.remove("active"));
    links[nextIndex].classList.add("active");
    localStorage.setItem("selectedLink", links[nextIndex].innerText);
    updateImage();
});

const selectedImage = document.getElementById("selectedImage");
function updateImage() {
    const selectedLink = localStorage.getItem("selectedLink");
    if (selectedLink) {
        selectedImage.src = `./images/${selectedLink}.png`;
        selectedImage.alt = selectedLink;
    }
}

updateImage();