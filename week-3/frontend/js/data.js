/**
 * Data statis & helper kalkulasi tarif DR. MEOWW (Week 3 — Sprint 02).
 */
window.DrMeowData = {
    selectedSizeTier: "<2",

    pricingMatrix: {
        "hair-skin": { name: "Grooming Hair & Skin", "<2": 55000, ">2": 60000, ">5": 65000 },
        "complete": { name: "Grooming Komplit", "<2": 55000, ">2": 60000, ">5": 65000 },
        "sensitive": { name: "Grooming Sensitive Skin", "<2": 60000, ">2": 65000, ">5": 70000 }
    },

    sizeLabelMap: {
        "<2": "Kecil (< 2 kg)",
        ">2": "Sedang (> 2 kg)",
        ">5": "Besar (> 5 kg)"
    },

    showcaseItems: [
        {
            before: "https://api.builder.io/api/v1/image/assets/TEMP/c6fcd5953097f1c1ef2cf47075ad67c4ef2bc472?width=658",
            after: "https://api.builder.io/api/v1/image/assets/TEMP/023ba9531a56b6ce60863a880f0dee8b632f3390?width=658"
        },
        {
            before: "https://api.builder.io/api/v1/image/assets/TEMP/023ba9531a56b6ce60863a880f0dee8b632f3390?width=658",
            after: "https://api.builder.io/api/v1/image/assets/TEMP/c6fcd5953097f1c1ef2cf47075ad67c4ef2bc472?width=658"
        }
    ],

    resolveTierByWeight(weightKg) {
        if (weightKg < 2) return "<2";
        if (weightKg <= 5) return ">2";
        return ">5";
    },

    formatRupiah(amount) {
        return "Rp " + Number(amount).toLocaleString("id-ID");
    },

    buildWhatsappUrl(booking) {
        const lines = [
            `Halo Admin DR. MEOWW! Saya ingin konfirmasi reservasi *${booking.code}*:`,
            `• Nama: ${booking.customerName} (${booking.phone})`,
            `• Anabul: ${booking.catName} (${booking.weight} kg)`,
            `• Paket: ${booking.serviceName}`,
            `• Metode: ${booking.method}`,
            `• Jadwal: ${booking.date} (${booking.time} WIB)`,
            `• Lokasi: ${booking.address}`,
            `• Estimasi Biaya: ${this.formatRupiah(booking.totalBill)}`
        ];
        return "https://wa.me/6281234567890?text=" + encodeURIComponent(lines.join("\n"));
    }
};
