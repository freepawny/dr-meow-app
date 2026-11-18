/**
 * Interaktivitas seksi Pricing: perpindahan tab kategori & kalkulasi harga ukuran kucing (Week 3).
 */
document.addEventListener("DOMContentLoaded", () => {
    const { pricingMatrix, sizeLabelMap, formatRupiah } = window.DrMeowData;

    const tabGrooming = document.getElementById("tabGrooming");
    const tabPenitipan = document.getElementById("tabPenitipan");
    const sizeSelectorContainer = document.getElementById("sizeSelectorContainer");
    const groomingCardsGrid = document.getElementById("groomingCardsGrid");
    const penitipanCardsGrid = document.getElementById("penitipanCardsGrid");

    if (tabGrooming && tabPenitipan) {
        tabGrooming.addEventListener("click", () => {
            tabGrooming.classList.add("active");
            tabGrooming.setAttribute("aria-selected", "true");
            tabPenitipan.classList.remove("active");
            tabPenitipan.setAttribute("aria-selected", "false");

            sizeSelectorContainer.style.display = "flex";
            groomingCardsGrid.style.display = "grid";
            penitipanCardsGrid.style.display = "none";
        });

        tabPenitipan.addEventListener("click", () => {
            tabPenitipan.classList.add("active");
            tabPenitipan.setAttribute("aria-selected", "true");
            tabGrooming.classList.remove("active");
            tabGrooming.setAttribute("aria-selected", "false");

            sizeSelectorContainer.style.display = "none";
            groomingCardsGrid.style.display = "none";
            penitipanCardsGrid.style.display = "grid";
        });
    }

    const sizeButtons = document.querySelectorAll(".size-card-btn");
    const priceHairSkin = document.getElementById("priceHairSkin");
    const priceComplete = document.getElementById("priceComplete");
    const priceSensitive = document.getElementById("priceSensitive");
    const sizeIndicators = document.querySelectorAll(".size-indicator");

    sizeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const tier = btn.getAttribute("data-tier");
            if (!tier || !pricingMatrix["hair-skin"][tier]) return;

            window.DrMeowData.selectedSizeTier = tier;

            sizeButtons.forEach((other) => {
                other.classList.remove("selected");
                other.setAttribute("aria-pressed", "false");
            });
            btn.classList.add("selected");
            btn.setAttribute("aria-pressed", "true");

            priceHairSkin.textContent = formatRupiah(pricingMatrix["hair-skin"][tier]);
            priceComplete.textContent = formatRupiah(pricingMatrix["complete"][tier]);
            priceSensitive.textContent = formatRupiah(pricingMatrix["sensitive"][tier]);

            sizeIndicators.forEach((el) => {
                el.textContent = sizeLabelMap[tier];
            });
        });
    });
});
