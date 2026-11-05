/* ==========================================================================
   IMPORTS
   ========================================================================== */
import type { FC } from "react";
import { cn } from "@/lib/utils";
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

export interface BeforeAfterProps {
    headline?: string;
    subHeadline?: string;
    items?: BeforeAfterItem[];
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Static before-and-after transformation showcase section (Sprint 01).
 */
export const BeforeAfter: FC<BeforeAfterProps> = ({
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
    items = DEFAULT_ITEMS,
    className
}) => {
    const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;
    const activeItem = safeItems[0];

    return (
        <section
            aria-label="Before After Section"
            className={cn(
                "flex w-full flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12",
                className
            )}
        >
            <SectionHeader
                align="left"
                headline={headline}
                subHeadline={subHeadline}
            />

            <div className="flex flex-col items-center flex-shrink-0">
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
                        className="absolute left-0 top-0 w-[210px] h-[260px] sm:w-[329px] sm:h-[360px] z-10"
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
                        className="absolute left-[110px] top-[180px] sm:left-[165px] sm:top-[203px] w-[210px] h-[260px] sm:w-[329px] sm:h-[360px] z-20"
                    />
                </div>
            </div>
        </section>
    );
};

export default BeforeAfter;
