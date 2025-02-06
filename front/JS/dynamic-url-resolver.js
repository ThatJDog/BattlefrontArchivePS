document.addEventListener("DOMContentLoaded", () => {
    const isLocal = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1");
    const baseHref = isLocal ? "/" : "/BattlefrontArchivePS/"; // Adjust for GitHub Pages

    let baseTag = document.querySelector("base");
    if (!baseTag) {
        baseTag = document.createElement("base");
        document.head.prepend(baseTag);
    }
    baseTag.href = baseHref;

    console.log("Set base href:", baseTag.href);
});