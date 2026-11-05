/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import CardVertical from "@/components/CardVertical";
import SectionHeader from "../../_components/SectionHeader";
import BackgroundPattern from "../../_components/BackgroundPattern";
import {
    type FeatureData,
    DEFAULT_FEATURES,
    DEFAULT_HEADLINE,
    DEFAULT_SUBHEADLINE
} from "./constants";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export type { FeatureData };

/**
 * Props for the FeaturesSection component.
 */
export interface FeaturesSectionProps {
    /**
     * Primary section headline text.
     * @defaultValue DEFAULT_HEADLINE
     */
    headline?: string;
    /**
     * Secondary sub-headline descriptive text.
     * @defaultValue DEFAULT_SUBHEADLINE
     */
    subHeadline?: string;
    /**
     * Collection of feature items to render.
     * @defaultValue DEFAULT_FEATURES
     */
    features?: FeatureData[];
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Landing page section highlighting clinical standards and unique service advantages.
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
    features = DEFAULT_FEATURES,
    className
}) => {
    return (
        <section
            aria-label="Features Section"
            className={cn("relative w-full flex flex-col items-center justify-center ", className)}
        >
            <BackgroundPattern color="yellow" minDistance="min-h-[1200px] lg:min-h-[650px]" />
            
            {/* Main Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center gap-8 md:gap-12">
                {/* Header Block */}
                <SectionHeader headline={headline} subHeadline={subHeadline} />

                {/* Cards Container */}
                <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap justify-between items-stretch gap-6 w-full">
                    {features.map((feature) => (
                        <CardVertical
                            key={feature.id}
                            hasShadow={false}
                            showImage={false}
                            showButtons={false}
                            showItems={false}
                            title={
                                <span className="whitespace-pre-line text-center w-full block">
                                    {feature.title}
                                </span>
                            }
                            description={
                                <span className="text-center w-full block text-primary-700">
                                    {feature.description}
                                </span>
                            }
                            className="w-full md:w-[calc(50%-12px)] lg:w-auto lg:flex-1 bg-surface-white"
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
export { FeaturesSection as Features };
export default FeaturesSection;
