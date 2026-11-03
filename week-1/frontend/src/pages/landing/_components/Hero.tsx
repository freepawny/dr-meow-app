/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { MessageCircle } from "lucide-react";
import SectionHeader from "./SectionHeader";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the HeroSection component.
 */
export interface HeroSectionProps {
    /**
     * Leading prefix text for the primary headline.
     * @defaultValue "Gak Sekadar Bersih!\nGrooming Kucing Standar "
     */
    titlePrefix?: string;
    /**
     * Highlighted accent text in the primary headline.
     * @defaultValue "Medis Veteriner"
     */
    titleHighlight?: string;
    /**
     * Supporting paragraph describing clinical grooming benefits.
     * @defaultValue "Rawat kucing kesayangan lebih praktis dan higienis dengan formula hypoallergenic bebas SLS/SLES yang aman untuk kulit sensitif. Tersedia layanan jemput ke rumah atau kunjungi langsung cabang Sukun dan Pakis!"
     */
    description?: string;
    /**
     * Label text for the primary booking CTA button.
     * @defaultValue "BOOKING"
     */
    bookingText?: string;
    /**
     * Target anchor href for booking navigation.
     * @defaultValue "#booking"
     */
    bookingHref?: string;
    /** Callback triggered when the booking button is clicked. */
    onBookingClick?: () => void;
    /**
     * Label text for the secondary WhatsApp CTA button.
     * @defaultValue "Konsultasi via Whatsapp"
     */
    whatsappText?: string;
    /**
     * Target WhatsApp link or telephone URL.
     * @defaultValue "https://wa.me/"
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
    titlePrefix = "Gak Sekadar Bersih!\nGrooming Kucing Standar ",
    titleHighlight = "Medis Veteriner",
    description = "Rawat kucing kesayangan lebih praktis dan higienis dengan formula hypoallergenic bebas SLS/SLES yang aman untuk kulit sensitif. Tersedia layanan jemput ke rumah atau kunjungi langsung cabang Sukun dan Pakis!",
    bookingText = "BOOKING",
    bookingHref = "#booking",
    onBookingClick,
    whatsappText = "Konsultasi via Whatsapp",
    whatsappHref = "https://wa.me/",
    onWhatsappClick,
    className
}) => {
    return (
        <section
            aria-label="Hero Section"
            className={cn(
                "relative w-full flex items-center justify-center overflow-hidden bg-surface-white px-4 py-16 md:py-28",
                className
            )}
        >

            {/* Main Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center justify-center max-w-[626px] gap-6">
                    {/* Main Headline & Subtitle */}
                    <SectionHeader
                        as="h1"
                        headline={
                            <>
                                {titlePrefix}
                                <span className="text-text-accent">{titleHighlight}</span>
                            </>
                        }
                        subHeadline={description}
                        headlineClassName="sm:text-4xl md:text-h1 md:leading-[58px] tracking-tight"
                        subHeadlineClassName="text-sm sm:text-base leading-6 text-secondary-dark max-w-[566px]"
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
