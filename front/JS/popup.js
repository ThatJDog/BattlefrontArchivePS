window.openPopup = function (page, params = {}) {
    const popupOverlay = document.getElementById("popupOverlay");
    const popupContent = document.getElementById("popupContent");

    // Convert params object into a URL query string
    const urlParams = new URLSearchParams(params).toString();
    const url = urlParams ? `${page}?${urlParams}` : page; // Append params only if they exist

    // Fetch and load the requested page into the popup
    fetch(url)
        .then(response => response.text())
        .then(html => {
            popupContent.innerHTML = html;
            popupOverlay.classList.add("active");
        })
        .catch((error) => console.error("Error loading page:", error));
};

window.closePopup = function () {
    document.getElementById("popupOverlay").classList.remove("active");
    document.getElementById("popupContent").innerHTML = ""; // Clear content on close
};