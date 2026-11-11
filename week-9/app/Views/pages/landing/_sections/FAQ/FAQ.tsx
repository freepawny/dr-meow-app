/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC, ReactNode } from "react";
import { useState } from "react";
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

/**
 * Props for the FAQ section component.
 */
export interface FAQProps {
    /**
     * Primary section headline text or node.
     * @defaultValue DEFAULT_HEADLINE
     */
    headline?: ReactNode;
    /**
     * Supporting sub-headline descriptive copy text or node.
     * @defaultValue DEFAULT_SUBHEADLINE
     */
    subHeadline?: ReactNode;
    /**
     * Collection of FAQ question and answer items to display.
     * @defaultValue DEFAULT_FAQ_ITEMS
     */
    items?: FAQItemData[];
    /**
     * Identifier of the initially expanded FAQ item, or null if all closed.
     * @defaultValue DEFAULT_FAQ_ITEMS[0]?.id ?? 1
     */
    defaultOpenId?: string | number | null;
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Landing page section providing answers to frequently asked customer questions
 * via an interactive accordion.
 */
export const FAQ: FC<FAQProps> = ({
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
    items = DEFAULT_FAQ_ITEMS,
    defaultOpenId = DEFAULT_FAQ_ITEMS[0]?.id ?? 1,
    className
}) => {
    const [openId, setOpenId] = useState<string | number | null>(defaultOpenId);

    const handleToggle = (id: string | number) => {
        setOpenId((currentId) => (currentId === id ? null : id));
    };

    return (
        <section
            id="faq"
            aria-label="FAQ Section"
            className={cn(
                "flex w-full flex-col items-center justify-center gap-8 py-4",
                className
            )}
        >
            <SectionHeader
                headline={headline}
                subHeadline={subHeadline}
            />

            <div className="flex w-full max-w-[860px] flex-col gap-4">
                {items.map((item, index) => (
                    <FAQItem
                        key={item.id}
                        id={item.id}
                        itemNumber={index + 1}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openId === item.id}
                        onToggle={() => handleToggle(item.id)}
                    />
                ))}
            </div>
        </section>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default FAQ;
