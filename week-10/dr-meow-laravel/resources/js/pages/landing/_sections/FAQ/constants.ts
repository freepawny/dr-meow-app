/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * FAQ entry detailing a customer question and its corresponding answer.
 */
export interface FAQItemData {
    /** Unique identifier for the FAQ item. */
    id: string | number;
    /** The FAQ question copy. */
    question: string;
    /** Detailed explanatory answer copy. */
    answer: string;
}

/* ==========================================================================
   DEFAULT CONSTANTS & MOCK DATA
   ========================================================================== */
/** Default section headline text for the FAQ section. */
export const DEFAULT_HEADLINE = "Pertanyaan yang Sering Diajukan (FAQ)";

/** Default supporting sub-headline copy for the FAQ section. */
export const DEFAULT_SUBHEADLINE =
    "Punya pertanyaan seputar layanan dan fasilitas kami? Klik pertanyaan di bawah untuk melihat jawaban lengkapnya.";

/** Default placeholder message displayed while FAQ items are in preparation. */
export const DEFAULT_PLACEHOLDER_TEXT = "Daftar Pertanyaan & Jawaban Segera Hadir";

/** Default collection of FAQ items. */
export const DEFAULT_FAQ_ITEMS: FAQItemData[] = [
    {
        id: 1,
        question:
            "Apakah kucing saya harus sudah divaksin sebelum grooming atau penitipan?",
        answer:
            "Untuk keamanan dan kesehatan seluruh anabul, kami sangat menyarankan kucing sudah divaksinasi. Namun jika belum atau jadwal vaksin terlambat, paramedis veteriner kami akan melakukan skrining suhu tubuh vital (37,8°C – 39,2°C) serta cek fisik menyeluruh terlebih dahulu. Jika kucing dalam kondisi fit dan tidak bergejala menular, perawatan tetap dapat dilakukan secara aman."
    },
    {
        id: 2,
        question: "Berapa lama rata-rata durasi pengerjaan grooming per ekor?",
        answer:
            "Rata-rata pengerjaan membutuhkan waktu sekitar 60 hingga 90 menit per ekor. Durasi ini mencakup skrining suhu dan fisik awal, potong kuku, pembersihan telinga, proses mandi terapeutik sesuai paket, pengeringan dengan blower bersuhu hangat terkontrol, serta penyisiran bulu dan trimming paw."
    },
    {
        id: 3,
        question:
            "Bagaimana jika kucing saya galak, penakut, atau mudah stres saat dimandikan?",
        answer:
            "Tenang, seluruh proses ditangani langsung oleh paramedis veteriner berpengalaman yang terlatih teknik low-stress handling. Kami tidak pernah menggunakan kekerasan, bentakan, maupun obat bius atau sedasi. Kami mendekati kucing secara bertahap, memberikan rasa aman, dan beristirahat sejenak jika anabul membutuhkan jeda."
    },
    {
        id: 4,
        question: "Bagaimana cara kerja layanan Antar-Jemput (Pick-up)?",
        answer:
            "Cukup pilih metode Antar-Jemput saat reservasi. Kurir terlatih DR. MEOWW akan datang ke alamat Anda membawa pet carrier steril dalam armada ber-AC. Setelah grooming selesai dan Digital Health Report terbit, anabul akan langsung diantar kembali ke rumah dengan selamat, wangi, dan segar."
    },
    {
        id: 5,
        question:
            "Apa perbedaan paket Grooming Komplit dengan Grooming Hair & Skin?",
        answer:
            "Paket Grooming Hair & Skin ditujukan untuk perawatan rutin, menghaluskan bulu kusam/rontok, serta mengurai gimbal dengan formula bernutrisi dan pilihan 4 varian sampo. Sedangkan Grooming Komplit merupakan terapi medis klinis untuk membasmi kutu (sampo Fipronil) serta jamur dan scabies (sampo Mikonazol & Klorheksidin + bilas Lime Sulfur)."
    },
    {
        id: 6,
        question:
            "Apa saja fasilitas dan syarat untuk layanan Penitipan Kucing (Cat Boarding)?",
        answer:
            "Kucing wajib dalam keadaan sehat dan bebas dari parasit menular aktif. Fasilitas mencakup kandang steril individual, ruangan ber-AC yang tenang, pembersihan kandang dan cuci wadah rutin harian, ganti pasir, pemantauan kesehatan berkala oleh paramedis veteriner, serta laporan harian berupa foto/video ke WhatsApp Anda."
    }
];
