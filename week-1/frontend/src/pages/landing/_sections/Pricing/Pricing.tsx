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

    const groomingData = getGroomingData(selectedSizeGrooming);

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
                <div className="flex w-full flex-wrap justify-center items-stretch gap-6">
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
                        : PENITIPAN_DATA.map((plan) => (
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
