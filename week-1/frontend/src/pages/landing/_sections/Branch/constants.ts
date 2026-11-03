/** Clinical branch location descriptor and metadata. */
export interface BranchItem {
    /** Unique identifier for the branch. */
    id: string | number;
    /** Region or geographical area badge label. */
    tag: string;
    /** Daily operational schedule text. */
    operatingHours: string;
    /** Brand prefix for the branch heading. */
    titlePrefix: string;
    /** Highlighted branch name text. */
    titleHighlight: string;
    /** Street and building address line. */
    addressRoad: string;
    /** District and city address line. */
    addressDistrict: string;
    /** List of available branch amenities and medical services. */
    facilities: string[];
    /** Google Maps or external navigation link URL. */
    mapUrl: string;
    /**
     * Label text for the map navigation action button.
     * @defaultValue "Buka di Google Maps"
     */
    mapButtonText?: string;
}

export const DEFAULT_HEADLINE = "Kunjungi Cabang DR. MEOWW Terdekat";

export const DEFAULT_SUBHEADLINE =
    "Buka setiap hari (kecuali hari Jumat) pukul 08.00 – 17.00 WIB.";

export const DEFAULT_LOGO_SRC =
    "https://api.builder.io/api/v1/image/assets/TEMP/32566a6f6b486523f5a80de70ce749e97c0e95af?width=516";

/** Default fallback list of operating physical clinic and salon branches. */
export const DEFAULT_BRANCHES: BranchItem[] = [
    {
        id: "sukun",
        tag: "Cabang Malang Selatan / Barat",
        operatingHours: "08.00 – 17.00 WIB",
        titlePrefix: "DR. MEOWW —",
        titleHighlight: "Cabang Sukun",
        addressRoad: "Perumahan La Vella 29",
        addressDistrict: "Kec. Sukun, Kota Malang",
        facilities: [
            "Ruang tunggu Indoor/Outdoor nyaman",
            "Instalasi Grooming Medis",
            "Kandang Penitipan Steril."
        ],
        mapUrl: "https://maps.google.com/?q=DR.+MEOWW+Cabang+Sukun",
        mapButtonText: "Buka di Google Maps"
    },
    {
        id: "pakis",
        tag: "Cabang Malang Timur",
        operatingHours: "08.00 – 17.00 WIB",
        titlePrefix: "DR. MEOWW —",
        titleHighlight: "Cabang Pakis",
        addressRoad: "Perumahan Kota Mandala A10",
        addressDistrict: "Pakis, Malang",
        facilities: [
            "Ruang tunggu Indoor/Outdoor nyaman",
            "Layanan Antar-Jemput Kurir",
            "Grooming Medis Lengkap."
        ],
        mapUrl: "https://maps.google.com/?q=DR.+MEOWW+Cabang+Pakis",
        mapButtonText: "Buka di Google Maps"
    }
];
