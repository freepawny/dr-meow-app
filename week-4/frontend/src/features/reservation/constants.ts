/* ==========================================================================
   IMPORTS & TYPES
   ========================================================================== */
import type { SelectOption } from "@/components/SelectField";
import type { BackendService } from "@/services/types";
import type {
    QuickChipOption,
    ServiceMethodOption,
    WeightPresetOption
} from "./types";

/* ==========================================================================
   DEFAULT CONSTANTS & OPTIONS
   ========================================================================== */
/** Fallback grooming services mirroring backend db.json catalog. */
export const FALLBACK_SERVICES: BackendService[] = [
    {
        id: "hair-skin",
        name: "Hair & Skin",
        badge_label: "Perawatan Rutin & Bulu",
        description:
            "Direkomendasikan untuk kulit kering, bulu rusak, rapuh, rontok, dan kasar.",
        is_popular: false,
        base_price: 55000,
        tier_prices: { "<2": 55000, ">2": 60000, ">5": 65000 },
        features: [],
        is_active: true
    },
    {
        id: "complete",
        name: "Komplit",
        badge_label: "Fokus Terapi Medis",
        description:
            "Penanganan tuntas masalah medis kulit: kutu, scabies, dan jamur.",
        is_popular: true,
        base_price: 55000,
        tier_prices: { "<2": 55000, ">2": 60000, ">5": 65000 },
        features: [],
        is_active: true
    },
    {
        id: "sensitive",
        name: "Sensitive Skin",
        badge_label: "Kulit Rentan/Alergi",
        description:
            "Aman untuk kulit alergi atau dermatitis. 0% Paraben & SLS/SLES.",
        is_popular: false,
        base_price: 60000,
        tier_prices: { "<2": 60000, ">2": 65000, ">5": 70000 },
        features: [],
        is_active: true
    }
];

/** Four fulfillment methods offered by DR. MEOWW. */
export const SERVICE_METHOD_OPTIONS: ServiceMethodOption[] = [
    {
        value: "Antar-Jemput (Pick-up)",
        label: "Antar-Jemput",
        subLabel: "Dijemput kurir ke rumah",
        iconKey: "pickup",
        requiresHomeAddress: true
    },
    {
        value: "Home Service",
        label: "Home Service",
        subLabel: "Groomer datang ke rumah",
        iconKey: "home",
        requiresHomeAddress: true
    },
    {
        value: "Drop-off",
        label: "Drop-off Cabang",
        subLabel: "Titip pagi, ambil sore",
        iconKey: "dropoff",
        requiresHomeAddress: false
    },
    {
        value: "Ditunggu",
        label: "Ditunggu di Klinik",
        subLabel: "Santai di ruang tunggu",
        iconKey: "wait",
        requiresHomeAddress: false
    }
];

/** Operational arrival/pickup time slots (08.00 - 17.00 WIB). */
export const TIME_SLOT_OPTIONS: QuickChipOption[] = [
    { value: "08:00", label: "08:00 WIB", subLabel: "Sesi Pagi Awal" },
    { value: "10:00", label: "10:00 WIB", subLabel: "Sesi Pagi" },
    { value: "13:00", label: "13:00 WIB", subLabel: "Sesi Siang" },
    { value: "15:00", label: "15:00 WIB", subLabel: "Sesi Sore" }
];

/** Quick-pick clinic branch locations when customer visits directly. */
export const BRANCH_LOCATION_OPTIONS: QuickChipOption[] = [
    {
        value: "Cabang Sukun — Perumahan La Vella 29, Kec. Sukun, Kota Malang",
        label: "Cabang Sukun",
        subLabel: "Perumahan La Vella 29"
    },
    {
        value: "Cabang Pakis — Perumahan Kota Mandala A10, Pakis, Malang",
        label: "Cabang Pakis",
        subLabel: "Perumahan Kota Mandala A10"
    }
];

/** Common cat breed options for quick dropdown selection. */
export const CAT_BREED_OPTIONS: SelectOption[] = [
    { value: "Domestik", label: "Domestik / Kampung" },
    { value: "Persian", label: "Persian (Persia)" },
    { value: "Anggora", label: "Anggora" },
    { value: "British Shorthair", label: "British Shorthair (BSH)" },
    { value: "Scottish Fold", label: "Scottish Fold" },
    { value: "Maine Coon", label: "Maine Coon" },
    { value: "Ragdoll", label: "Ragdoll" },
    { value: "Himalayan", label: "Himalayan" },
    { value: "Mix / Campuran", label: "Mix / Campuran" },
    { value: "Lainnya", label: "Ras Lainnya" }
];

/** Quick weight tier buttons syncing directly with pricing tiers. */
export const WEIGHT_PRESET_OPTIONS: WeightPresetOption[] = [
    {
        tier: "<2",
        label: "Kecil (< 2 kg)",
        subLabel: "Anakan / ras kecil",
        defaultWeight: "1.5"
    },
    {
        tier: ">2",
        label: "Sedang (2–5 kg)",
        subLabel: "Dewasa standar",
        defaultWeight: "3.5"
    },
    {
        tier: ">5",
        label: "Besar (> 5 kg)",
        subLabel: "Ras besar",
        defaultWeight: "5.5"
    }
];

/** Cat temperament options fulfilling Cat entity validation. */
export const TEMPERAMENT_OPTIONS: QuickChipOption[] = [
    { value: "Friendly", label: "Friendly", subLabel: "Tenang & jinak" },
    { value: "Pemalu", label: "Pemalu", subLabel: "Penakut / sensitif suara" },
    { value: "Aktif", label: "Aktif", subLabel: "Lincah & banyak gerak" },
    { value: "Sensitif", label: "Sensitif", subLabel: "Mudah stres / defensif" }
];

/** Quick medical condition options reducing manual typing. */
export const MEDICAL_CONDITION_OPTIONS: QuickChipOption[] = [
    { value: "Tidak memiliki riwayat penyakit", label: "Sehat / Tanpa Keluhan" },
    { value: "Indikasi kutu pada bulu", label: "Ada Kutu" },
    { value: "Indikasi jamur atau scabies", label: "Jamur / Scabies" },
    { value: "Kulit sensitif atau riwayat alergi", label: "Kulit Sensitif / Alergi" }
];
