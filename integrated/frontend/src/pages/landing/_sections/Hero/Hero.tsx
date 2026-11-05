/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { MessageCircle } from "lucide-react";
import SectionHeader from "../../_components/SectionHeader";
import {
    DEFAULT_TITLE_PREFIX,
    DEFAULT_TITLE_HIGHLIGHT,
    DEFAULT_DESCRIPTION,
    DEFAULT_BOOKING_TEXT,
    DEFAULT_BOOKING_HREF,
    DEFAULT_WHATSAPP_TEXT,
    DEFAULT_WHATSAPP_HREF
} from "./constants";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the HeroSection component.
 */
export interface HeroSectionProps {
    /**
     * Leading prefix text for the primary headline.
     * @defaultValue DEFAULT_TITLE_PREFIX
     */
    titlePrefix?: string;
    /**
     * Highlighted accent text in the primary headline.
     * @defaultValue DEFAULT_TITLE_HIGHLIGHT
     */
    titleHighlight?: string;
    /**
     * Supporting paragraph describing clinical grooming benefits.
     * @defaultValue DEFAULT_DESCRIPTION
     */
    description?: string;
    /**
     * Label text for the primary booking CTA button.
     * @defaultValue DEFAULT_BOOKING_TEXT
     */
    bookingText?: string;
    /**
     * Target anchor href for booking navigation.
     * @defaultValue DEFAULT_BOOKING_HREF
     */
    bookingHref?: string;
    /** Callback triggered when the booking button is clicked. */
    onBookingClick?: () => void;
    /**
     * Label text for the secondary WhatsApp CTA button.
     * @defaultValue DEFAULT_WHATSAPP_TEXT
     */
    whatsappText?: string;
    /**
     * Target WhatsApp link or telephone URL.
     * @defaultValue DEFAULT_WHATSAPP_HREF
     */
    whatsappHref?: string;
    /** Callback triggered when the WhatsApp button is clicked. */
    onWhatsappClick?: () => void;
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Hero header banner component for the landing page with value propositions and primary CTAs.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
    titlePrefix = DEFAULT_TITLE_PREFIX,
    titleHighlight = DEFAULT_TITLE_HIGHLIGHT,
    description = DEFAULT_DESCRIPTION,
    bookingText = DEFAULT_BOOKING_TEXT,
    bookingHref = DEFAULT_BOOKING_HREF,
    onBookingClick,
    whatsappText = DEFAULT_WHATSAPP_TEXT,
    whatsappHref = DEFAULT_WHATSAPP_HREF,
    onWhatsappClick,
    className
}) => {
    return (
        <section
            aria-label="Hero Section"
            className={cn(
                "relative w-full flex items-center justify-center overflow-hidden bg-surface-white",
                className
            )}
        >

            {/* Main Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center justify-center max-w-[626px] gap-6">
                    {/* Main Headline & Subtitle */}
                    <SectionHeader
                        headline={
                            <>
                                {titlePrefix}
                                <div className="text-text-accent">{titleHighlight}</div>
                            </>
                        }
                        subHeadline={description}
                    />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-2 w-full sm:w-auto">
                        <Button
                            size="giant"
                            variantStyle="filled"
                            showRightIcon
                            href={bookingHref}
                            onClick={onBookingClick}
                            className="rounded-[12px] px-6 py-4 w-full sm:w-auto"
                        >
                            {bookingText}
                        </Button>

                        {/* Secondary Action Button (WhatsApp) */}
                        <Button
                            size="giant"
                            variantStyle="outline"
                            rightIcon={<MessageCircle className="w-6 h-6 flex-shrink-0" />}
                            href={whatsappHref}
                            onClick={onWhatsappClick}
                            className="rounded-[12px] px-6 py-4 w-full sm:w-auto border-[1.5px]"
                        >
                            {whatsappText}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export { HeroSection as Hero };
export default HeroSection;
