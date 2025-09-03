document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const selectedLink = localStorage.getItem("selectedLink");
        switch (selectedLink) {
            case "Brock":
                window.location.href = "../Pages/BrockInfo.html";
                break;
            case "Misty":
                window.location.href = "../Pages/MistyInfo.html";
                break;
            case "Oak":
                window.location.href = "../Pages/OakInfo.html";
                break;
            case "Evelyn":
                window.location.href = "../Pages/EvelynInfo.html";
                break;
        }
    }, 3000);
});

