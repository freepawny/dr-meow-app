/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import CardVertical from "@/components/CardVertical";
import SectionHeader from "./SectionHeader";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Feature entry detailing a key service differentiator. */
export interface FeatureData {
    /** Unique identifier for the feature. */
    id: string | number;
    /** Title of the feature differentiator. */
    title: string;
    /** Detailed explanation of the feature. */
    description: string;
}

/**
 * Props for the FeaturesSection component.
 */
export interface FeaturesSectionProps {
    /**
     * Primary section headline text.
     * @defaultValue "Kenapa DR. MEOWW Berbeda?"
     */
    headline?: string;
    /**
     * Secondary sub-headline descriptive text.
     * @defaultValue "Kami tidak sembarangan memandikan kucing. Kami menerapkan protokol kesehatan berlapis untuk memastikan anabul pulang dalam keadaan cantik, sehat, dan bebas stres."
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
/** Default list of standout service features and safety guarantees. */
const DEFAULT_FEATURES: FeatureData[] = [
    {
        id: 1,
        title: "Skrining Suhu &\nFisik Wajib",
        description:
            "Setiap kucing wajib lolos cek suhu vital (37,8°C – 39,2°C). Jika terindikasi sakit, perawatan ditunda demi mencegah penularan silang. Lingkungan steril dan aman."
    },
    {
        id: 2,
        title: "Ditangani Paramedis Veteriner",
        description:
            "Bukan sekadar groomer biasa. Tim kami paham anatomi, sabar menghadapi kucing penakut, dan punya teknik khusus untuk kucing yang agresif."
    },
    {
        id: 3,
        title: "Laporan Kesehatan Digital",
        description:
            "Setelah pengerjaan selesai, Anda akan menerima laporan rekam medis digital (suhu, temuan fisik/jamur) beserta bukti foto Before-After langsung ke WhatsApp Anda."
    }
];

/**
 * Landing page section highlighting clinical standards and unique service advantages.
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
    headline = "Kenapa DR. MEOWW Berbeda?",
    subHeadline = "Kami tidak sembarangan memandikan kucing. Kami menerapkan protokol kesehatan berlapis untuk memastikan anabul pulang dalam keadaan cantik, sehat, dan bebas stres.",
    features = DEFAULT_FEATURES,
    className
}) => {
    return (
        <section
            aria-label="Features Section"
            className={cn(
                "relative w-full flex flex-col items-center justify-center py-16 md:py-[64px]",
                className
            )}
        >
            {/* Main Content Container */}
            <div className="relative z-10 w-full px-4 md:px-8 flex flex-col items-center justify-center gap-8 md:gap-12">
                {/* Header Block */}
                <SectionHeader
                    headline={headline}
                    subHeadline={subHeadline}
                    className="gap-6 max-w-[810px] mx-auto"
                    headlineClassName="md:leading-[40px]"
                />

                {/* Cards Grid */}
                <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap justify-center items-start gap-6 w-full">
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
                            className="md:w-1/3 lg:max-w-[350px] bg-surface-white"
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
