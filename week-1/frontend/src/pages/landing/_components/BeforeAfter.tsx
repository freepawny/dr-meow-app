/* ==========================================================================
   IMPORTS
   ========================================================================== */
import type { FC } from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import CardVertical from "@/components/CardVertical";
import SectionHeader from "./SectionHeader";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Data model representing a before-and-after grooming transformation pair. */
export interface BeforeAfterItem {
    /** Unique identifier for the transformation entry. */
    id: string | number;
    /** Image source URL illustrating the pet's condition before treatment. */
    beforeImage: string;
    /** Accessible alternative text for the before image. */
    beforeAlt?: string;
    /** Image source URL illustrating the pet's condition after treatment. */
    afterImage: string;
    /** Accessible alternative text for the after image. */
    afterAlt?: string;
}

/**
 * Props for the BeforeAfter section component.
 */
export interface BeforeAfterProps {
    /**
     * Primary section headline text.
     * @defaultValue "Lihat Bagaimana Perubahan Kucing-Kucing Ini"
     */
    headline?: string;
    /**
     * Supporting sub-headline descriptive copy.
     * @defaultValue "Jangan hanya percaya kata-kata kami. Lihat transformasi dan cerita bahagia dari para Paw Parents di Malang."
     */
    subHeadline?: string;
    /**
     * Collection of before-and-after transformation items to display in the carousel.
     * @defaultValue DEFAULT_ITEMS
     */
    items?: BeforeAfterItem[];
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   ATOMIC SUB-COMPONENTS
   ========================================================================== */

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/** Default list of before-and-after grooming transformation showcases. */
const DEFAULT_ITEMS: BeforeAfterItem[] = [
    {
        id: 1,
        beforeImage: "https://api.builder.io/api/v1/image/assets/TEMP/c6fcd5953097f1c1ef2cf47075ad67c4ef2bc472?width=658",
        beforeAlt: "Transformasi kucing sebelum grooming",
        afterImage: "https://api.builder.io/api/v1/image/assets/TEMP/023ba9531a56b6ce60863a880f0dee8b632f3390?width=658",
        afterAlt: "Transformasi kucing setelah grooming"
    },
    {
        id: 2,
        beforeImage: "https://api.builder.io/api/v1/image/assets/TEMP/023ba9531a56b6ce60863a880f0dee8b632f3390?width=658",
        beforeAlt: "Transformasi kucing sebelum perawatan intensif",
        afterImage: "https://api.builder.io/api/v1/image/assets/TEMP/c6fcd5953097f1c1ef2cf47075ad67c4ef2bc472?width=658",
        afterAlt: "Transformasi kucing setelah perawatan intensif"
    }
];

/**
 * Interactive before-and-after showcase section featuring stacked comparison cards and carousel navigation.
 */
export const BeforeAfter: FC<BeforeAfterProps> = ({
    headline = "Lihat Bagaimana Perubahan Kucing-Kucing Ini",
    subHeadline = "Jangan hanya percaya kata-kata kami. Lihat transformasi dan cerita bahagia dari para Paw Parents di Malang.",
    items = DEFAULT_ITEMS,
    className
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;
    const activeItem = safeItems[currentIndex % safeItems.length];

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? safeItems.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === safeItems.length - 1 ? 0 : prev + 1));
    };

    return (
        <section
            aria-label="Before After Section"
            className={cn(
                "flex w-full flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 py-8",
                className
            )}
        >
            <SectionHeader
                align="left"
                headline={headline}
                subHeadline={subHeadline}
                className="justify-center flex-1 w-full lg:max-w-[490px]"
                headlineClassName="w-full md:leading-10"
                subHeadlineClassName="w-full"
            />

            <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8 flex-shrink-0">
                <Button
                    size="giant"
                    variantStyle="filled"
                    iconOnly
                    onClick={handlePrev}
                    aria-label="Transformasi sebelumnya"
                    className="hidden sm:inline-flex rounded-xl flex-shrink-0"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </Button>

                <div className="relative w-[320px] h-[440px] sm:w-[494px] sm:h-[563px] flex-shrink-0">
                    <CardVertical
                        hasShadow
                        shadowVariant="500"
                        borderStyle="none"
                        textAlignment="left"
                        showDescription={false}
                        showButtons={false}
                        showItems={false}
                        title="BEFORE"
                        imageSrc={activeItem.beforeImage}
                        imageAlt={activeItem.beforeAlt || "Kucing sebelum perawatan"}
                        imageContainerClassName="h-[180px] sm:h-[274px] aspect-[251/209]"
                        imageClassName="-scale-x-100 group-hover:-scale-x-105"
                        contentClassName="p-4 sm:p-6"
                        className="absolute left-0 top-0 w-[210px] h-[260px] sm:w-[329px] sm:h-[360px] z-10 transition-all duration-300"
                    />
                    <CardVertical
                        hasShadow
                        shadowVariant="500"
                        borderStyle="none"
                        textAlignment="right"
                        showDescription={false}
                        showButtons={false}
                        showItems={false}
                        title="AFTER"
                        imageSrc={activeItem.afterImage}
                        imageAlt={activeItem.afterAlt || "Kucing setelah perawatan"}
                        imageContainerClassName="h-[180px] sm:h-[274px] aspect-[251/209]"
                        imageClassName="-scale-x-100 group-hover:-scale-x-105"
                        contentClassName="p-4 sm:p-6"
                        className="absolute left-[110px] top-[180px] sm:left-[165px] sm:top-[203px] w-[210px] h-[260px] sm:w-[329px] sm:h-[360px] z-20 transition-all duration-300"
                    />
                </div>

                <Button
                    size="giant"
                    variantStyle="filled"
                    iconOnly
                    onClick={handleNext}
                    aria-label="Transformasi berikutnya"
                    className="hidden sm:inline-flex rounded-xl flex-shrink-0"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </Button>

                <div className="flex items-center gap-4 sm:hidden">
                    <Button
                        size="giant"
                        variantStyle="filled"
                        iconOnly
                        onClick={handlePrev}
                        aria-label="Transformasi sebelumnya"
                        className="rounded-xl"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </Button>
                    <Button
                        size="giant"
                        variantStyle="filled"
                        iconOnly
                        onClick={handleNext}
                        aria-label="Transformasi berikutnya"
                        className="rounded-xl"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default BeforeAfter;
