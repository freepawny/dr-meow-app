/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TabContainer, TabPill } from "@/components/TabPill";
import PricingCard from "@/components/PricingCard";
import SizeCard from "./SizeCard";
import SectionHeader from "./SectionHeader";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the Pricing section component.
 */
export interface PricingProps {
    /**
     * Primary section headline text or node.
     */
    headline?: React.ReactNode;
    /**
     * Supporting sub-headline descriptive copy.
     */
    subHeadline?: React.ReactNode;
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Interactive pricing section featuring category tabs, cat size selectors, and tiered package cards.
 */
export const Pricing: React.FC<PricingProps> = ({
    headline = (
        <>
            Solusi Perawatan Tepat
            <br />
            untuk Setiap Kondisi
        </>
    ),
    subHeadline = "Tidak ada biaya tersembunyi. Tarif dihitung secara adil berdasarkan rentang berat badan atau kebutuhan kapasitas kucingmu.",
    className
}) => {
    const [activeTab, setActiveTab] = useState<"grooming" | "penitipan">("grooming");
    const [selectedSizeGrooming, setSelectedSizeGrooming] = useState<"<2" | ">2" | ">5">("<2");

    const groomingPricing = {
        hairSkin: { "<2": "Rp 55.000", ">2": "Rp 60.000", ">5": "Rp 65.000" },
        complete: { "<2": "Rp 55.000", ">2": "Rp 60.000", ">5": "Rp 65.000" },
        sensitive: { "<2": "Rp 60.000", ">2": "Rp 65.000", ">5": "Rp 70.000" }
    };

    const groomingData = [
        {
            id: "hair-skin",
            badgeLabel: "Perawatan Rutin & Bulu",
            subCategory:
                selectedSizeGrooming === "<2"
                    ? "Kecil (< 2 kg)"
                    : selectedSizeGrooming === ">2"
                      ? "Sedang (> 2 kg)"
                      : "Besar (> 5 kg)",
            category: "Grooming Hair & Skin",
            price: groomingPricing.hairSkin[selectedSizeGrooming],
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
            subCategory:
                selectedSizeGrooming === "<2"
                    ? "Kecil (< 2 kg)"
                    : selectedSizeGrooming === ">2"
                      ? "Sedang (> 2 kg)"
                      : "Besar (> 5 kg)",
            category: "Grooming Komplit",
            price: groomingPricing.complete[selectedSizeGrooming],
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
            subCategory:
                selectedSizeGrooming === "<2"
                    ? "Kecil (< 2 kg)"
                    : selectedSizeGrooming === ">2"
                      ? "Sedang (> 2 kg)"
                      : "Besar (> 5 kg)",
            category: "Grooming Sensitive Skin",
            price: groomingPricing.sensitive[selectedSizeGrooming],
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

    const penitipanData = [
        {
            id: "kandang-standar",
            badgeLabel: "Kapasitas 1 Kucing",
            subCategory: "70 x 70 cm",
            category: "Kandang Standar",
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
            subCategory: "100 x 70 x 70 cm",
            category: "Kandang Besar",
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
            subCategory: "170 x 70 x 90 cm",
            category: "Kandang Ekstra Besar",
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

    return (
        <section
            aria-label="Pricing Section"
            className={cn(
                "flex w-full flex-col items-center gap-8 py-8 px-4 md:px-8",
                className
            )}
        >
            {/* Header */}
            <SectionHeader
                headline={headline}
                subHeadline={subHeadline}
                subHeadlineClassName="max-w-[810px]"
            />

            {/* Tabs */}
            <TabContainer variant="capsule">
                <TabPill
                    label="Paket Grooming"
                    isSelected={activeTab === "grooming"}
                    onClick={() => setActiveTab("grooming")}
                />
                <TabPill
                    label="Penitipan Kucing"
                    isSelected={activeTab === "penitipan"}
                    onClick={() => setActiveTab("penitipan")}
                />
            </TabContainer>

            {/* Content wrapper */}
            <div className="flex w-full flex-col items-center justify-center gap-8">
                {activeTab === "grooming" && (
                    <div className="flex w-full flex-wrap justify-center gap-6">
                        <SizeCard
                            sizeTitle="Berat < 2 kg"
                            description="Kucing kecil / Anak kucing"
                            isSelected={selectedSizeGrooming === "<2"}
                            onClick={() => setSelectedSizeGrooming("<2")}
                        />
                        <SizeCard
                            sizeTitle="Berat > 2 kg"
                            description="Kucing remaja / Dewasa sedang"
                            isSelected={selectedSizeGrooming === ">2"}
                            onClick={() => setSelectedSizeGrooming(">2")}
                        />
                        <SizeCard
                            sizeTitle="Berat > 5 kg"
                            description="Kucing raksasa / Jumbo"
                            isSelected={selectedSizeGrooming === ">5"}
                            onClick={() => setSelectedSizeGrooming(">5")}
                        />
                    </div>
                )}

                {/* Pricing Cards Grid */}
                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {activeTab === "grooming"
                        ? groomingData.map((plan) => (
                              <PricingCard
                                  key={plan.id}
                                  badgeLabel={plan.badgeLabel}
                                  variant={plan.variant}
                                  subCategory={plan.subCategory}
                                  category={plan.category}
                                  price={plan.price}
                                  priceUnit="/ ekor"
                                  description={plan.description}
                                  features={plan.features}
                                  buttonLabel={plan.buttonLabel}
                              />
                          ))
                        : penitipanData.map((plan) => (
                              <PricingCard
                                  key={plan.id}
                                  badgeLabel={plan.badgeLabel}
                                  subCategory={plan.subCategory}
                                  category={plan.category}
                                  price={plan.price}
                                  priceUnit={plan.priceUnit}
                                  description={plan.description}
                                  features={plan.features}
                                  buttonLabel={plan.buttonLabel}
                              />
                          ))}
                </div>
            </div>
        </section>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default Pricing;
