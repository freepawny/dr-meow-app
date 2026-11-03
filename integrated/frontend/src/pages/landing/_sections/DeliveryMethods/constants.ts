/** Descriptor for an individual service delivery method option. */
export interface DeliveryMethodItem {
    /** Unique identifier for the delivery method. */
    id: string | number;
    /** Image URL illustrating the fulfillment method. */
    imageSrc?: string;
    /** Title of the fulfillment method. */
    title: string;
    /** Short description of the service flow. */
    description: string;
}

/** Default section headline text for the DeliveryMethods section. */
export const DEFAULT_HEADLINE = "Empat Cara Untuk\nMembuat Kucing Menawan";

/** Default supporting sub-headline copy for the DeliveryMethods section. */
export const DEFAULT_SUBHEADLINE =
    "Reservasi slot Kamu dalam hitungan menit. Pilih 1 dari 4 cara pemenuhan layanan yang paling pas dengan jadwal sibuk Anda.";

/** Default fallback list of delivery methods. */
export const DEFAULT_METHODS: DeliveryMethodItem[] = [
    {
        id: 1,
        imageSrc:
            "https://api.builder.io/api/v1/image/assets/TEMP/defb56e6e7f9bdfb282014073fe29a0b487ffb1b?width=534",
        title: "Antar-Jemput (Pick-up)",
        description: "Biar kurir terlatih kami yang jemput ke rumah."
    },
    {
        id: 2,
        imageSrc:
            "https://api.builder.io/api/v1/image/assets/TEMP/defb56e6e7f9bdfb282014073fe29a0b487ffb1b?width=534",
        title: "Home Service",
        description: "Groomer kami datang, kucing tetap tenang di teras Anda."
    },
    {
        id: 3,
        imageSrc:
            "https://api.builder.io/api/v1/image/assets/TEMP/defb56e6e7f9bdfb282014073fe29a0b487ffb1b?width=534",
        title: "Drop-off",
        description: "Tinggal kucingnya sebelum kerja, ambil saat sudah wangi."
    },
    {
        id: 4,
        imageSrc:
            "https://api.builder.io/api/v1/image/assets/TEMP/defb56e6e7f9bdfb282014073fe29a0b487ffb1b?width=534",
        title: "Ditunggu",
        description: "Bersantai di ruang tunggu indoor/outdoor kami."
    }
];
