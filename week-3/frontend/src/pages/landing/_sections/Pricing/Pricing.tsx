/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React, { useState } from "react";
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

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export type { CatSizeTier };

/**
 * Props for the Pricing section component.
 */
export interface PricingProps {
    headline?: React.ReactNode;
    subHeadline?: React.ReactNode;
    /** Callback triggered when user clicks a package CTA button. */
    onSelectPlan?: (planId: string, selectedSize: CatSizeTier) => void;
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Interactive pricing section featuring category tabs, cat size selectors,
 * and dynamic local pricing calculation (Sprint 02 — Pre-API).
 */
export const Pricing: React.FC<PricingProps> = ({
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
    onSelectPlan,
    className
}) => {
    const [activeTab, setActiveTab] = useState<"grooming" | "penitipan">("grooming");
    const [selectedSizeGrooming, setSelectedSizeGrooming] = useState<CatSizeTier>("<2");

    const currentGroomingData: PricingPlanItem[] = getGroomingData(selectedSizeGrooming);

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
            </div>
        </section>
    );
};

export default Pricing;
