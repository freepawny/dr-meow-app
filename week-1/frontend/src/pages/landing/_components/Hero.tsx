/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { MessageCircle } from "lucide-react";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface HeroSectionProps {
    /** Judul baris pertama dan kedua */
    titlePrefix?: string;
    /** Teks sorotan dengan warna aksen kuning/oranye */
    titleHighlight?: string;
    /** Deskripsi penjelasan hero */
    description?: string;
    /** Teks tombol CTA utama */
    bookingText?: string;
    /** URL / Handler tombol Booking */
    bookingHref?: string;
    onBookingClick?: () => void;
    /** Teks tombol CTA WhatsApp */
    whatsappText?: string;
    /** URL / Handler tombol WhatsApp */
    whatsappHref?: string;
    onWhatsappClick?: () => void;
    /** URL gambar jejak kaki kucing dekoratif kiri */
    leftPawSrc?: string;
    /** URL gambar jejak kaki kucing dekoratif kanan */
    rightPawSrc?: string;
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
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
                "relative w-full min-h-[640px] md:min-h-[754px] flex items-center justify-center overflow-hidden bg-surface-white px-4 py-16 md:py-28",
                className
            )}
        >

            {/* Main Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center justify-center max-w-[626px] gap-6">
                    {/* Main Headline */}
                    <h1 className="font-nunito font-black text-3xl sm:text-4xl md:text-h1 md:leading-[58px] tracking-tight whitespace-pre-line text-primary-700">
                        {titlePrefix}
                        <span className="text-text-accent">{titleHighlight}</span>
                    </h1>

                    {/* Subtitle / Paragraph */}
                    <p className="font-nunito font-normal text-sm sm:text-base leading-6 text-secondary-dark max-w-[566px]">
                        {description}
                    </p>

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
export default HeroSection;
