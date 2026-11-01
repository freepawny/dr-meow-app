/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import CardVertical from "@/components/CardVertical";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface FeatureData {
    id: string | number;
    title: string;
    description: string;
}

export interface FeaturesSectionProps {
    /** Judul utama section */
    headline?: string;
    /** Teks sub-judul atau deskripsi section */
    subHeadline?: string;
    /** Data array untuk merender fitur (CardVertical) */
    features?: FeatureData[];
    className?: string;
}

/* ==========================================================================
   ATOMIC SUB-COMPONENTS (LOCAL DECORATIVE BACKGROUND)
   ========================================================================== */
const BackgroundPattern: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={cn("absolute pointer-events-none -z-10", className)}
        viewBox="0 0 1441 1407"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
    >
        <path
            d="M0 44H2.3924C24.2988 244.212 193.956 400 400 400H1041C1247.04 400 1416.7 244.212 1438.61 44H1441V1395C1441 1174.09 1261.91 995 1041 995H400C179.086 995 0 1174.09 0 1395V44Z"
            fill="currentColor"
        />
    </svg>
);

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
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
                "relative w-full flex flex-col items-center justify-center min-h-[562px] py-16 md:py-[64px]",
                className
            )}
        >
            {
                //<BackgroundPattern className="text-surface-accent absolute left-1/2 -translate-x-1/2 -top-[422px] w-[100vw] h-auto z-0 pointer-events-none" />
            }

            {/* Main Content Container */}
            <div className="relative z-10 w-full px-4 md:px-8 flex flex-col items-center justify-center gap-8 md:gap-12">
                {/* Header Block */}
                <div className="flex flex-col justify-center items-center gap-6 max-w-[810px] mx-auto">
                    <h2 className="text-primary-700 text-center font-nunito font-black text-3xl md:text-[40px] md:leading-[40px]">
                        {headline}
                    </h2>
                    <p className="text-primary-700 text-center font-nunito font-normal text-base leading-6">
                        {subHeadline}
                    </p>
                </div>

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
                            className="md:w-1/3 lg:max-w-[350px] !bg-surface-white"
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
export default FeaturesSection;
