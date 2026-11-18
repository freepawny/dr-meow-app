/**
 * Interaktivitas Carousel Before-After & Accordion FAQ (Week 3).
 */
document.addEventListener("DOMContentLoaded", () => {
    const { showcaseItems } = window.DrMeowData;
    let currentIndex = 0;

    const beforeImg = document.getElementById("beforeImg");
    const afterImg = document.getElementById("afterImg");

    function updateShowcase(nextIdx) {
        currentIndex = (nextIdx + showcaseItems.length) % showcaseItems.length;
        const item = showcaseItems[currentIndex];
        if (beforeImg) beforeImg.src = item.before;
        if (afterImg) afterImg.src = item.after;
    }

    ["prevBtn", "prevBtnMobile"].forEach((id) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener("click", () => updateShowcase(currentIndex - 1));
    });

    ["nextBtn", "nextBtnMobile"].forEach((id) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener("click", () => updateShowcase(currentIndex + 1));
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        const trigger = item.querySelector(".faq-trigger");
        if (!trigger) return;

        trigger.addEventListener("click", () => {
            const isOpen = item.classList.contains("active");
            faqItems.forEach((other) => {
                other.classList.remove("active");
                const otherBtn = other.querySelector(".faq-trigger");
                if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                item.classList.add("active");
                trigger.setAttribute("aria-expanded", "true");
            }
        });
    });
});
