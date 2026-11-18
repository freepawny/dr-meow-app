/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { PricingFeature, PricingCardVariant } from "./PricingCard";

/* ==========================================================================
   CONSTANTS & CONFIG
   ========================================================================== */
/** Default section headline text for the Pricing section. */
export const DEFAULT_HEADLINE = "Solusi Perawatan Tepat\nuntuk Setiap Kondisi";

/** Default supporting sub-headline copy for the Pricing section. */
export const DEFAULT_SUBHEADLINE =
    "Tidak ada biaya tersembunyi. Tarif dihitung secara adil berdasarkan rentang berat badan atau kebutuhan kapasitas kucingmu.";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Supported cat size weight tiers for dynamic grooming plan pricing. */
export type CatSizeTier = "<2" | ">2" | ">5";

/** Data model representing a single pricing package plan item. */
export interface PricingPlanItem {
    /** Unique identifier for the pricing plan. */
    id: string;
    /** Header badge text indicating category or package intent. */
    badgeLabel: string;
    /** Optional visual prominence variant for highlighted tiers. */
    variant?: PricingCardVariant;
    /** Target cat size or room dimension specification. */
    size: string;
    /** Name of the service or accommodation plan. */
    name: string;
    /** Formatted price string. */
    price: string;
    /** Billing frequency or unit suffix. */
    priceUnit?: string;
    /** Brief description of clinical or boarding care provided. */
    description: string;
    /** List of included features and treatments. */
    features: PricingFeature[];
    /** Label text for the call-to-action button. */
    buttonLabel: string;
}

/* ==========================================================================
   PRICING DATA LOOKUP
   ========================================================================== */
/** Base pricing lookup matrix organized by service type and weight tier. */
export const GROOMING_PRICING: Record<string, Record<CatSizeTier, string>> = {
    hairSkin: { "<2": "Rp 55.000", ">2": "Rp 60.000", ">5": "Rp 65.000" },
    complete: { "<2": "Rp 55.000", ">2": "Rp 60.000", ">5": "Rp 65.000" },
    sensitive: { "<2": "Rp 60.000", ">2": "Rp 65.000", ">5": "Rp 70.000" }
};

/* ==========================================================================
   HELPERS & GENERATORS
   ========================================================================== */
/**
 * Generates grooming tier plans tailored to the specified cat size weight bracket.
 *
 * @param selectedSize - Currently active cat size tier filter (`"<2"`, `">2"`, or `">5"`).
 * @returns Array of pricing plan items configured with dynamic rates and descriptions.
 */
export const getGroomingData = (selectedSize: CatSizeTier): PricingPlanItem[] => {
    const sizeLabel =
        selectedSize === "<2"
            ? "Kecil (< 2 kg)"
            : selectedSize === ">2"
              ? "Sedang (> 2 kg)"
              : "Besar (> 5 kg)";

    return [
        {
            id: "hair-skin",
            badgeLabel: "Perawatan Rutin & Bulu",
            size: sizeLabel,
            name: "Grooming Hair & Skin",
            price: GROOMING_PRICING.hairSkin[selectedSize],
            description:
                "Direkomendasikan untuk kulit kering, bulu rusak, rapuh, rontok, dan kasar. Menutrisi serta melembabkan secara optimal.",
            features: [
                {
                    id: 1,
                    text: "Bebas pilih 4 varian sampo (Botanical, Shinny Black, Whitening, Sensitive Skin)"
                },
                { id: 2, text: "Bebas pilih 3 kategori aroma parfum (Segar, Manis, Powdery)" },
                {
                    id: 3,
                    text: "Termasuk potong kuku, bersihkan telinga, urai gimbal & trimming paw"
                }
            ],
            buttonLabel: "Pilih Paket: Hair & Skin"
        },
        {
            id: "complete",
            badgeLabel: "Fokus Terapi Medis",
            variant: "popular",
            size: sizeLabel,
            name: "Grooming Komplit",
            price: GROOMING_PRICING.complete[selectedSize],
            description:
                "Penanganan tuntas masalah medis kulit: membantu mengurangi kutu, serta menyembuhkan scabies dan jamur dengan bahan aktif terukur.",
            features: [
                {
                    id: 1,
                    text: "Sampo medis aktif Fipronil (kutu) / Mikonazol & Klorheksidin (jamur)"
                },
                { id: 2, text: "Terapi bilas Lime Sulfur untuk kasus jamur & scabies berat" },
                { id: 3, text: "Pemeriksaan fisik menyeluruh (suhu & BB) + Digital Health Report" }
            ],
            buttonLabel: "Pilih Paket: Komplit"
        },
        {
            id: "sensitive",
            badgeLabel: "Kulit Rentan/Alergi",
            size: sizeLabel,
            name: "Grooming Sensitive Skin",
            price: GROOMING_PRICING.sensitive[selectedSize],
            description:
                "Aman untuk kulit alergi atau dermatitis. 0% Paraben & SLS/SLES, formula ringan non-iritatif dengan pH seimbang.",
            features: [
                { id: 1, text: "Sampo Hypoallergenic diperkaya ekstrak Oatmeal, Susu, & Vit E" },
                { id: 2, text: "Menggunakan degreaser natural (mild) & minim pewangi buatan" },
                { id: 3, text: "Pengeringan low-stress dengan suhu hangat terkontrol" }
            ],
            buttonLabel: "Pilih Paket: Sensitive Skin"
        }
    ];
};

/** Default catalog of boarding and cage accommodation options. */
export const PENITIPAN_DATA: PricingPlanItem[] = [
    {
        id: "kandang-standar",
        badgeLabel: "Kapasitas 1 Kucing",
        size: "70 x 70 cm",
        name: "Kandang Standar",
        price: "Rp 30.000",
        priceUnit: "/ hari",
        description:
            "Fasilitas lengkap: pembersihan kandang, cuci wadah, pakan & minum, ganti pasir, dan laporan harian.",
        features: [
            { id: 1, text: "Monitoring kondisi kesehatan oleh paramedis veteriner" },
            { id: 2, text: "Laporan update via video atau foto harian" },
            { id: 3, text: "Ruangan bersih, aman, dan nyaman untuk kucing tunggal" }
        ],
        buttonLabel: "Pesan Kandang Standar"
    },
    {
        id: "kandang-besar",
        badgeLabel: "Kapasitas 2-3 Kucing",
        size: "100 x 70 x 70 cm",
        name: "Kandang Besar",
        price: "Rp 60.000",
        priceUnit: "/ hari",
        description:
            "Cocok untuk keluarga kucing kecil. Kucing tetap nyaman berinteraksi satu sama lain dalam satu area.",
        features: [
            { id: 1, text: "Monitoring kondisi kesehatan oleh paramedis veteriner" },
            { id: 2, text: "Laporan update via video atau foto harian" },
            { id: 3, text: "Layanan ekstra: Obat cacing (+5k/kg) / Kutu (+15k/kg) opsional" }
        ],
        buttonLabel: "Pesan Kandang Besar"
    },
    {
        id: "kandang-ekstra",
        badgeLabel: "Kapasitas 5 Kucing",
        size: "170 x 70 x 90 cm",
        name: "Kandang Ekstra Besar",
        price: "Rp 120.000",
        priceUnit: "/ hari",
        description:
            "Ruang ekstra luas untuk keluarga besar kucing. Meminimalisir stres dengan sirkulasi dan ruang gerak bebas.",
        features: [
            { id: 1, text: "Monitoring kondisi kesehatan oleh paramedis veteriner" },
            { id: 2, text: "Laporan update via video atau foto harian" },
            { id: 3, text: "Bisa tambah layanan antar jemput (mulai Rp 5.000)" }
        ],
        buttonLabel: "Pesan Kandang Ekstra"
    }
];
