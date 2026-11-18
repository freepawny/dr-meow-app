/**
 * Navigasi interaktif: toggle menu mobile & highlight tab aktif (Week 3).
 */
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const mobileDropdown = document.getElementById("mobileDropdown");
    const navLinks = document.querySelectorAll(".navbar-nav .tab-pill, .mobile-dropdown .tab-pill");

    if (mobileMenuToggle && mobileDropdown) {
        mobileMenuToggle.addEventListener("click", () => {
            const isOpen = mobileDropdown.classList.toggle("open");
            mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
            mobileMenuToggle.textContent = isOpen ? "✕" : "☰";
        });

        mobileDropdown.querySelectorAll("a, button").forEach((item) => {
            item.addEventListener("click", () => {
                mobileDropdown.classList.remove("open");
                mobileMenuToggle.setAttribute("aria-expanded", "false");
                mobileMenuToggle.textContent = "☰";
            });
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const targetHref = link.getAttribute("href");
            navLinks.forEach((other) => {
                const match = other.getAttribute("href") === targetHref;
                other.classList.toggle("active", match);
                if (other.hasAttribute("aria-selected")) {
                    other.setAttribute("aria-selected", String(match));
                }
            });
        });
    });
});
