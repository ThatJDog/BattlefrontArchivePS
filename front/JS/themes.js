export function toggleDarkMode() {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
}

export function isDarkMode(){
    return localStorage.getItem("theme") === "dark";
}

// Check and apply stored theme preference
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
    }
});