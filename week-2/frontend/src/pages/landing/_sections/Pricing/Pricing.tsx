/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import { TabContainer, TabPill } from "@/components/TabPill";
import PricingCard from "./PricingCard";
import SizeCard from "./SizeCard";
import SectionHeader from "../../_components/SectionHeader";
import {
    type CatSizeTier,
    DEFAULT_HEADLINE,
    DEFAULT_SUBHEADLINE,
    getGroomingData
} from "./constants";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export type { CatSizeTier };

export interface PricingProps {
    headline?: React.ReactNode;
    subHeadline?: React.ReactNode;
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Static responsive pricing section displaying semantic grooming package cards (Sprint 01).
 */
export const Pricing: React.FC<PricingProps> = ({
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
    className
}) => {
    const groomingPlans = getGroomingData("<2");

    return (
        <section
            id="harga"
            aria-label="Pricing Section"
            className={cn("flex w-full flex-col items-center gap-8", className)}
        >
            <SectionHeader headline={headline} subHeadline={subHeadline} />

            <TabContainer variant="capsule" aria-label="Kategori Layanan">
                <TabPill label="Paket Grooming" isSelected />
                <TabPill label="Penitipan Kucing" isSelected={false} />
            </TabContainer>

            <div className="flex w-full flex-col items-center justify-center gap-8">
                <div className="flex w-full flex-wrap justify-center gap-6">
                    <SizeCard
                        sizeTitle="Kecil (< 2 kg)"
                        description="Kucing anakan / ras kecil"
                        isSelected
                    />
                    <SizeCard
                        sizeTitle="Sedang (> 2 kg)"
                        description="Kucing dewasa standar"
                        isSelected={false}
                    />
                    <SizeCard
                        sizeTitle="Besar (> 5 kg)"
                        description="Kucing ras besar (Maine Coon, dll)"
                        isSelected={false}
                    />
                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap justify-center items-stretch gap-6">
                    {groomingPlans.map((plan) => (
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
                            buttonHref="https://wa.me/6281234567890"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
