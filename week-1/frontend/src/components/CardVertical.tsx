/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Button, { type ButtonProps } from "@/components/Button";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface CardVerticalProps {
    /** Menampilkan bayangan elevasi kartu (Figma Variant: Shadow=True/False) */
    hasShadow?: boolean;

    /** Media Gambar */
    imageSrc?: string;
    imageAlt?: string;
    showImage?: boolean;
    imageSlot?: React.ReactNode;

    /** Teks & Konten */
    title?: React.ReactNode;
    showTitle?: boolean;
    description?: React.ReactNode;
    showDescription?: boolean;
    showTextBlock?: boolean;

    /** Slot Tambahan (Items / Features List) */
    showItems?: boolean;
    itemsSlot?: React.ReactNode;

    /** Tombol Aksi */
    showButtons?: boolean;
    buttonsSlot?: React.ReactNode;
    primaryButtonText?: string;
    primaryButtonProps?: Record<string, any>;
    onPrimaryClick?: () => void;
    secondaryButtonText?: string;
    secondaryButtonProps?: Record<string, any>;
    onSecondaryClick?: () => void;

    className?: string;
    children?: React.ReactNode;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
export const CardVertical: React.FC<CardVerticalProps> = ({
    hasShadow = true,

    // Image Props
    imageSrc,
    imageAlt = "Card visual",
    showImage = true,
    imageSlot,

    // Text Props
    title = "Title",
    showTitle = true,
    description = "Keep your messages short, but make sure they cover everything you need to say.",
    showDescription = true,
    showTextBlock = true,

    // Items Slot
    showItems = false,
    itemsSlot,

    // Buttons Props
    showButtons = true,
    buttonsSlot,
    primaryButtonText = "Button",
    primaryButtonProps,
    onPrimaryClick,
    secondaryButtonText = "Button",
    secondaryButtonProps,
    onSecondaryClick,

    className,
    children
}) => {
    return (
        <div
            className={cn(
                "group flex flex-col w-full max-w-[350px] overflow-hidden rounded-xl bg-surface-white border border-grey-100 transition-all duration-300",
                hasShadow ? "shadow-200 hover:shadow-300" : "shadow-none",
                className
            )}
        >
            {/* 1. Header Media / Image Slot */}
            {showImage && (
                <div className="relative w-full h-[200px] bg-grey-200 overflow-hidden flex-shrink-0">
                    {imageSlot ? (
                        imageSlot
                    ) : imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={imageAlt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-grey-200 flex items-center justify-center text-text-disabled font-nunito text-sm">
                            No Image
                        </div>
                    )}
                </div>
            )}

            {/* 2. Content Container (Padding 24px, Gap 24px) */}
            <div className="flex flex-col items-center gap-6 p-6 w-full flex-grow">
                {/* Title + Description Block */}
                {showTextBlock && (
                    <div className="flex flex-col items-start gap-6 w-full">
                        {showTitle && title && (
                            <h3 className="w-full font-nunito font-black text-2xl leading-7 text-primary-700 tracking-tight">
                                {title}
                            </h3>
                        )}

                        {showDescription && description && (
                            <p className="w-full font-nunito font-normal text-base leading-6 text-secondary-dark">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                {/* Dynamic Items Slot (Figma: Show Items=false by default) */}
                {showItems && itemsSlot && (
                    <div className="w-full flex flex-col gap-3 py-2 border-y border-grey-100">
                        {itemsSlot}
                    </div>
                )}

                {/* Children Custom Injector */}
                {children}

                {/* Buttons Action Group (Figma: Size=Large, Filled + Outline) */}
                {showButtons && (
                    <div className="flex flex-col items-start gap-6 w-full mt-auto">
                        {buttonsSlot ? (
                            buttonsSlot
                        ) : (
                            <>
                                {primaryButtonText && (
                                    <Button
                                        size="large"
                                        variantStyle="filled"
                                        onClick={onPrimaryClick}
                                        className="w-full rounded-[12px]"
                                        {...primaryButtonProps}
                                    >
                                        {primaryButtonText}
                                    </Button>
                                )}

                                {secondaryButtonText && (
                                    <Button
                                        size="large"
                                        variantStyle="outline"
                                        onClick={onSecondaryClick}
                                        className="w-full rounded-[12px] border-[1.5px]"
                                        {...secondaryButtonProps}
                                    >
                                        {secondaryButtonText}
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default CardVertical;
