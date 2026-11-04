/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TabContainer, TabPill } from "@/components/TabPill";
import PricingCard from "./PricingCard";
import SizeCard from "./SizeCard";
import SectionHeader from "../../_components/SectionHeader";
import {
    type CatSizeTier,
    type PricingPlanItem,
    DEFAULT_HEADLINE,
    DEFAULT_SUBHEADLINE,
    getGroomingData,
    PENITIPAN_DATA
} from "./constants";
import { getServices } from "@/services/serviceApi";
import type { BackendService } from "@/services/types";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export type { CatSizeTier };

/**
 * Props for the Pricing section component.
 */
export interface PricingProps {
    /**
     * Primary section headline text or node.
     * @defaultValue DEFAULT_HEADLINE
     */
    headline?: React.ReactNode;
    /**
     * Supporting sub-headline descriptive copy.
     * @defaultValue DEFAULT_SUBHEADLINE
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
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
    className
}) => {
    const [activeTab, setActiveTab] = useState<"grooming" | "penitipan">("grooming");
    const [selectedSizeGrooming, setSelectedSizeGrooming] = useState<CatSizeTier>("<2");

    const [backendServices, setBackendServices] = useState<BackendService[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getServices(true);
            if (response.data && Array.isArray(response.data)) {
                setBackendServices(response.data);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Gagal memuat data dari backend";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const mapBackendServiceToPlan = (
        service: BackendService,
        selectedSize: CatSizeTier
    ): PricingPlanItem => {
        const sizeLabel =
            selectedSize === "<2"
                ? "Kecil (< 2 kg)"
                : selectedSize === ">2"
                  ? "Sedang (> 2 kg)"
                  : "Besar (> 5 kg)";

        const price = service.prices?.[selectedSize] || service.price;

        return {
            id: service.id,
            badgeLabel: service.badgeLabel,
            variant: service.variant,
            size: sizeLabel,
            name: service.name,
            price: price,
            priceUnit: service.priceUnit || "/ ekor",
            description: service.description,
            features: service.features || [],
            buttonLabel: service.buttonLabel
        };
    };

    const currentGroomingData: PricingPlanItem[] =
        backendServices.length > 0
            ? backendServices.map((service) =>
                  mapBackendServiceToPlan(service, selectedSizeGrooming)
              )
            : getGroomingData(selectedSizeGrooming);

    return (
        <section
            aria-label="Pricing Section"
            className={cn("flex w-full flex-col items-center gap-8 ", className)}
        >
            {/* Header */}
            <SectionHeader headline={headline} subHeadline={subHeadline} />

            {/* Status Koneksi Backend API */}
            <div className="flex items-center justify-center -mt-2">
                {loading ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-grey-100 text-grey-600">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menghubungkan ke
                        Backend...
                    </span>
                ) : !error && backendServices.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Terhubung ke Backend API ({backendServices.length} paket live)
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Mode Offline (Data Dummy)
                        <button
                            onClick={fetchServices}
                            className="ml-1 inline-flex items-center gap-1 underline font-semibold hover:text-amber-900 transition"
                            title="Klik untuk mencoba menghubungkan kembali"
                        >
                            <RefreshCw className="w-3 h-3" /> Coba Hubungkan
                        </button>
                    </span>
                )}
            </div>

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
                            sizeTitle="Kecil (< 2 kg)"
                            description="Kucing anakan / ras kecil"
                            isSelected={selectedSizeGrooming === "<2"}
                            onClick={() => setSelectedSizeGrooming("<2")}
                        />
                        <SizeCard
                            sizeTitle="Sedang (> 2 kg)"
                            description="Kucing dewasa standar"
                            isSelected={selectedSizeGrooming === ">2"}
                            onClick={() => setSelectedSizeGrooming(">2")}
                        />
                        <SizeCard
                            sizeTitle="Besar (> 5 kg)"
                            description="Kucing ras besar (Maine Coon, dll)"
                            isSelected={selectedSizeGrooming === ">5"}
                            onClick={() => setSelectedSizeGrooming(">5")}
                        />
                    </div>
                )}

                {/* Pricing Cards Grid */}
                {loading && activeTab === "grooming" ? (
                    <div className="flex w-full flex-wrap md:flex-nowrap justify-center items-stretch gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex w-full md:max-w-[415px] flex-col rounded-[12px] bg-white p-6 shadow-500 animate-pulse gap-4 min-h-[360px]"
                            >
                                <div className="h-6 w-1/3 bg-grey-200 rounded-full" />
                                <div className="h-8 w-2/3 bg-grey-200 rounded-md mt-2" />
                                <div className="h-10 w-1/2 bg-grey-300 rounded-md" />
                                <div className="h-16 w-full bg-grey-100 rounded-md mt-2" />
                                <div className="space-y-2 mt-4 flex-1">
                                    <div className="h-4 w-full bg-grey-100 rounded" />
                                    <div className="h-4 w-4/5 bg-grey-100 rounded" />
                                </div>
                                <div className="h-12 w-full bg-grey-200 rounded-lg mt-4" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex w-full flex-wrap md:flex-nowrap justify-center items-stretch gap-6">
                        {activeTab === "grooming"
                            ? currentGroomingData.map((plan) => (
                                  <PricingCard
                                      key={plan.id}
                                      badgeLabel={plan.badgeLabel}
                                      variant={plan.variant}
                                      subCategory={plan.size}
                                      category={plan.name}
                                      price={plan.price}
                                      priceUnit="/ ekor"
                                      description={plan.description}
                                      features={plan.features}
                                      buttonLabel={plan.buttonLabel}
                                  />
                              ))
                            : PENITIPAN_DATA.map((plan) => (
                                  <PricingCard
                                      key={plan.id}
                                      badgeLabel={plan.badgeLabel}
                                      subCategory={plan.size}
                                      category={plan.name}
                                      price={plan.price}
                                      priceUnit={plan.priceUnit}
                                      description={plan.description}
                                      features={plan.features}
                                      buttonLabel={plan.buttonLabel}
                                  />
                              ))}
                    </div>
                )}
            </div>
        </section>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default Pricing;
