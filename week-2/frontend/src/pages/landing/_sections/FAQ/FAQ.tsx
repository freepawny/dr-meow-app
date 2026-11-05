/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import SectionHeader from "../../_components/SectionHeader";
import FAQItem from "./FAQItem";
import {
    type FAQItemData,
    DEFAULT_HEADLINE,
    DEFAULT_SUBHEADLINE,
    DEFAULT_FAQ_ITEMS
} from "./constants";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export type { FAQItemData };

export interface FAQProps {
    headline?: ReactNode;
    subHeadline?: ReactNode;
    items?: FAQItemData[];
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Static FAQ section displaying questions and answers semantically (Sprint 01).
 */
export const FAQ: FC<FAQProps> = ({
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
    items = DEFAULT_FAQ_ITEMS,
    className
}) => {
    return (
        <section
            id="faq"
            aria-label="FAQ Section"
            className={cn(
                "flex w-full flex-col items-center justify-center gap-8 py-4",
                className
            )}
        >
            <SectionHeader headline={headline} subHeadline={subHeadline} />

            <div className="flex w-full max-w-[860px] flex-col gap-4">
                {items.map((item, index) => (
                    <FAQItem
                        key={item.id}
                        itemNumber={index + 1}
                        question={item.question}
                        answer={item.answer}
                    />
                ))}
            </div>
        </section>
    );
};

export default FAQ;
