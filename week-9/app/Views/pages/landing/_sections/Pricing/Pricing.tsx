/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
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

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export type { CatSizeTier };

export interface PricingProps {
    headline?: React.ReactNode;
    subHeadline?: React.ReactNode;
    onSelectPlan?: (planId: string, selectedSize: CatSizeTier) => void;
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Data-driven pricing section connected to REST API via Fetch API
 * with loading skeleton state and error handling UI (Sprint 03).
 */
export const Pricing: React.FC<PricingProps> = ({
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
    onSelectPlan,
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
            const msg =
                err instanceof Error
                    ? err.message
                    : "Gagal memuat data layanan dari server API.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchServices();
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

        const numericPrice =
            service.tier_prices?.[selectedSize] ?? service.base_price;

        const formattedPrice = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        })
            .format(numericPrice)
            .replace(",00", "");

        return {
            id: service.id,
            badgeLabel: service.badge_label,
            variant: service.is_popular ? "popular" : "default",
            size: sizeLabel,
            name: `Grooming ${service.name}`,
            price: formattedPrice,
            priceUnit: "/ ekor",
            description: service.description,
            features: (service.features || []).map((text, index) => ({
                id: index + 1,
                text
            })),
            buttonLabel: `Pilih Paket: ${service.name}`
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
            id="harga"
            aria-label="Pricing Section"
            className={cn("flex w-full flex-col items-center gap-8", className)}
        >
            <SectionHeader headline={headline} subHeadline={subHeadline} />

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

                {error && activeTab === "grooming" && (
                    <div
                        role="alert"
                        className="flex w-full max-w-[860px] flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-800"
                    >
                        <div className="flex items-start gap-2.5">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-text-error" />
                            <div className="font-nunito text-b3">
                                <strong className="font-extrabold">
                                    Gagal memuat data API:{" "}
                                </strong>
                                <span>{error} (menampilkan katalog cadangan).</span>
                            </div>
                        </div>
                        <Button
                            size="small"
                            variantStyle="outline"
                            onClick={() => void fetchServices()}
                            leftIcon={<RefreshCw className="h-4 w-4" />}
                            className="shrink-0 border-red-300 bg-surface-white text-red-700 hover:bg-red-50"
                        >
                            Coba Lagi
                        </Button>
                    </div>
                )}

                {loading && activeTab === "grooming" ? (
                    <div
                        aria-busy="true"
                        aria-label="Memuat daftar layanan..."
                        className="flex w-full flex-wrap md:flex-nowrap justify-center items-stretch gap-6"
                    >
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
                                      onButtonClick={() =>
                                          onSelectPlan?.(plan.id, selectedSizeGrooming)
                                      }
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
                                      onButtonClick={() =>
                                          onSelectPlan?.(plan.id, selectedSizeGrooming)
                                      }
                                  />
                              ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Pricing;
