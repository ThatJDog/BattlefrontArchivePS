export function loadNavbar() {
    const navbar = document.createElement('nav');
    navbar.classList.add('navbar');
    navbar.innerHTML = `
      <a href="/home">Home</a>
      <a href="/profile">Profile</a>
      <a href="/matches">Matches</a>
      <a href="/settings">Settings</a>
    `;
    document.body.prepend(navbar);
}

// Auto-load the navbar when the script is included
document.addEventListener("DOMContentLoaded", loadNavbar);