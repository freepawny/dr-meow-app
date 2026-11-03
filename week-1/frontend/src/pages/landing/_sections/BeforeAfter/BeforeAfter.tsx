/* ==========================================================================
   IMPORTS
   ========================================================================== */
import type { FC } from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import CardVertical from "@/components/CardVertical";
import SectionHeader from "../../_components/SectionHeader";
import {
    type BeforeAfterItem,
    DEFAULT_ITEMS,
    DEFAULT_HEADLINE,
    DEFAULT_SUBHEADLINE
} from "./constants";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export type { BeforeAfterItem };

/**
 * Props for the BeforeAfter section component.
 */
export interface BeforeAfterProps {
    /**
     * Primary section headline text.
     * @defaultValue DEFAULT_HEADLINE
     */
    headline?: string;
    /**
     * Supporting sub-headline descriptive copy.
     * @defaultValue DEFAULT_SUBHEADLINE
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
   MAIN COMPONENT
   ========================================================================== */
/**
 * Interactive before-and-after showcase section featuring stacked comparison cards and carousel navigation.
 */
export const BeforeAfter: FC<BeforeAfterProps> = ({
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
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
