/** Feature entry detailing a key service differentiator. */
export interface FeatureData {
    /** Unique identifier for the feature. */
    id: string | number;
    /** Title of the feature differentiator. */
    title: string;
    /** Detailed explanation of the feature. */
    description: string;
}

/** Default section headline text for the Features section. */
export const DEFAULT_HEADLINE = "Kenapa DR. MEOWW Berbeda?";

/** Default supporting sub-headline copy for the Features section. */
export const DEFAULT_SUBHEADLINE =
    "Kami tidak sembarangan memandikan kucing. Kami menerapkan protokol kesehatan berlapis untuk memastikan anabul pulang dalam keadaan cantik, sehat, dan bebas stres.";

/** Default list of standout service features and safety guarantees. */
export const DEFAULT_FEATURES: FeatureData[] = [
    {
        id: 1,
        title: "Skrining Suhu &\nFisik Wajib",
        description:
            "Setiap kucing wajib lolos cek suhu vital (37,8°C – 39,2°C). Jika terindikasi sakit, perawatan ditunda demi mencegah penularan silang. Lingkungan steril dan aman."
    },
    {
        id: 2,
        title: "Ditangani Paramedis Veteriner",
        description:
            "Bukan sekadar groomer biasa. Tim kami paham anatomi, sabar menghadapi kucing penakut, dan punya teknik khusus untuk kucing yang agresif."
    },
    {
        id: 3,
        title: "Laporan Kesehatan Digital",
        description:
            "Setelah pengerjaan selesai, Anda akan menerima laporan rekam medis digital (suhu, temuan fisik/jamur) beserta bukti foto Before-After langsung ke WhatsApp Anda."
    }
];
