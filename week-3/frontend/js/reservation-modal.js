/**
 * Kontroler Modal Reservasi Interaktif: validasi form, kalkulasi biaya otomatis & bukti booking (Week 3).
 */
document.addEventListener("DOMContentLoaded", () => {
    const dataStore = window.DrMeowData;
    const modal = document.getElementById("reservationModal");
    const closeBtn = document.getElementById("closeModalBtn");
    const form = document.getElementById("reservationForm");
    const formFooter = document.getElementById("modalFormFooter");
    const successView = document.getElementById("reservationSuccessView");

    const serviceSelect = document.getElementById("resService");
    const methodSelect = document.getElementById("resMethod");
    const weightInput = document.getElementById("resCatWeight");
    const dateInput = document.getElementById("resDate");
    const addressLabel = document.getElementById("resAddressLabel");
    const billDisplay = document.getElementById("resTotalBill");
    const tierDisplay = document.getElementById("resTierLabel");

    if (!modal || !form) return;

    // Set default date = tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateInput) dateInput.value = tomorrow.toISOString().split("T")[0];

    function recalculateBill() {
        const serviceKey = serviceSelect.value || "complete";
        const weight = parseFloat(weightInput.value) || 1.5;
        const tier = dataStore.resolveTierByWeight(weight);
        const serviceInfo = dataStore.pricingMatrix[serviceKey] || dataStore.pricingMatrix["complete"];
        const price = serviceInfo[tier];

        billDisplay.textContent = dataStore.formatRupiah(price);
        tierDisplay.textContent = dataStore.sizeLabelMap[tier];
        return { price, tier, serviceName: serviceInfo.name };
    }

    function openModal(presetService) {
        form.style.display = "flex";
        formFooter.style.display = "flex";
        successView.style.display = "none";

        if (presetService && dataStore.pricingMatrix[presetService]) {
            serviceSelect.value = presetService;
        }
        const defaultWeights = { "<2": "1.5", ">2": "3.5", ">5": "5.5" };
        weightInput.value = defaultWeights[dataStore.selectedSizeTier] || "1.5";

        clearErrors();
        recalculateBill();
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("open");
        document.body.style.overflow = "";
    }

    function setFieldError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const err = document.getElementById(errorId);
        if (input) input.classList.toggle("invalid", Boolean(message));
        if (err) {
            err.textContent = message || "";
            err.classList.toggle("visible", Boolean(message));
        }
    }

    function clearErrors() {
        setFieldError("resCustomerName", "errCustomerName", "");
        setFieldError("resPhone", "errPhone", "");
        setFieldError("resCatName", "errCatName", "");
        setFieldError("resCatWeight", "errCatWeight", "");
        setFieldError("resAddress", "errAddress", "");
    }

    document.querySelectorAll("[data-open-reservation]").forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(trigger.getAttribute("data-service") || "");
        });
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    serviceSelect.addEventListener("change", recalculateBill);
    weightInput.addEventListener("input", recalculateBill);
    methodSelect.addEventListener("change", () => {
        const needsHome = methodSelect.value.includes("Antar-Jemput") || methodSelect.value.includes("Home");
        addressLabel.textContent = needsHome ? "Alamat Penjemputan / Rumah *" : "Cabang Tujuan *";
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        clearErrors();

        const customerName = document.getElementById("resCustomerName").value.trim();
        const phone = document.getElementById("resPhone").value.trim();
        const catName = document.getElementById("resCatName").value.trim();
        const weight = parseFloat(weightInput.value);
        const address = document.getElementById("resAddress").value.trim();

        let hasError = false;
        if (!customerName) { setFieldError("resCustomerName", "errCustomerName", "Nama pemilik wajib diisi."); hasError = true; }
        if (!/^\+?[0-9]{10,15}$/.test(phone)) { setFieldError("resPhone", "errPhone", "Nomor WhatsApp harus 10–15 digit angka."); hasError = true; }
        if (!catName) { setFieldError("resCatName", "errCatName", "Nama anabul wajib diisi."); hasError = true; }
        if (!weight || weight <= 0) { setFieldError("resCatWeight", "errCatWeight", "Berat badan harus lebih dari 0 kg."); hasError = true; }
        if (!address) { setFieldError("resAddress", "errAddress", "Alamat atau cabang wajib diisi."); hasError = true; }

        if (hasError) return;

        const { price, serviceName } = recalculateBill();
        const code = "RES-" + Math.random().toString(16).slice(2, 8).toUpperCase();
        const booking = {
            code,
            customerName,
            phone,
            catName,
            weight,
            serviceName,
            method: methodSelect.value,
            date: dateInput.value,
            time: document.getElementById("resTime").value,
            address,
            totalBill: price
        };

        document.getElementById("sumCode").textContent = booking.code;
        document.getElementById("sumCustomer").textContent = `${booking.customerName} (${booking.phone})`;
        document.getElementById("sumCat").textContent = `${booking.catName} (${booking.weight} kg)`;
        document.getElementById("sumService").textContent = `${booking.serviceName} — ${booking.method}`;
        document.getElementById("sumSchedule").textContent = `${booking.date} • ${booking.time} WIB`;
        document.getElementById("sumTotal").textContent = dataStore.formatRupiah(booking.totalBill);
        document.getElementById("sumWhatsappBtn").href = dataStore.buildWhatsappUrl(booking);

        form.style.display = "none";
        formFooter.style.display = "none";
        successView.style.display = "flex";
    });
});
