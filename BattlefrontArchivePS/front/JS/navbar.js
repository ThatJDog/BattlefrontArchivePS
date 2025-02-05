export function loadNavbar() {
    const navbar = document.createElement('nav');
    navbar.classList.add('navbar');
    navbar.innerHTML = `
      <a href="../HTML/home">Home</a>
      <a >Gallery</a>
      <a href="../HTML/series-lookup">Matches</a>
      <a href="../HTML/settings">Settings</a>
    `;
    document.body.prepend(navbar);
}

// Auto-load the navbar when the script is included
document.addEventListener("DOMContentLoaded", loadNavbar);