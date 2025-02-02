function toggleDarkMode() {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
}

// Check and apply stored theme preference
document.addEventListener("DOMContentLoaded", () => {

    if (false) toggleDarkMode();

    return; // TMP
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
    }
});