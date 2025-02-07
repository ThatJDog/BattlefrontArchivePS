export function loadNavbar() {
    const navbar = document.createElement('nav');
    navbar.classList.add('navbar');
    navbar.innerHTML = `
      <a href="/BattlefrontArchivePS/front/HTML/home.html">Home</a>
      <a >Gallery</a>
      <a href="/BattlefrontArchivePS/front/HTML/season-lookup.html">Data</a>
      <a href="/BattlefrontArchivePS/front/HTML/settings.html">Settings</a>
      <a href="/BattlefrontArchivePS/front/HTML/credits.html">Credits</a>
    `;
    document.body.prepend(navbar);
}

export function loadListNavbar(containerId, menuItems) {

  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  // Create navbar wrapper
  const navbar = document.createElement("div");
  navbar.classList.add("secondary-navbar");

  // Generate menu items
  menuItems.forEach((item, index) => {
    // Create link
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.title;

    // Apply active class if specified
    if (item.active) {
      link.classList.add("active");
    }

    // Append link to navbar
    navbar.appendChild(link);

    // Add separator if not the last item
    if (index < menuItems.length - 1) {
      const separator = document.createElement("span");
      separator.textContent = "/";
      navbar.appendChild(separator);
    }
  });

  // Append the navbar to the container
  container.appendChild(navbar);
}

// Auto-load the navbar when the script is included
document.addEventListener("DOMContentLoaded", loadNavbar);