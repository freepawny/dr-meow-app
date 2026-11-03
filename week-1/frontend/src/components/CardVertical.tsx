/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import Button, { type ButtonBaseProps } from "@/components/Button";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Button props forwarded directly to the card action button components. */
export type CardButtonProps = ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Horizontal text alignment options for card title and description. */
export type CardTextAlignment = "left" | "center" | "right";

/** Border style configurations matching design system variants. */
export type CardBorderStyle = "default" | "none";

/**
 * Props for the CardVertical component.
 */
export interface CardVerticalProps {
    /**
     * Toggles elevation shadow on the card container.
     * @defaultValue true
     */
    hasShadow?: boolean;

    /**
     * Shadow elevation scale matching design system tokens.
     * @defaultValue "200"
     */
    shadowVariant?: "200" | "500";

    /**
     * Border appearance style matching Figma variant specifications.
     * @defaultValue "default"
     */
    borderStyle?: CardBorderStyle;

    /**
     * Text alignment for both title and description blocks.
     * @defaultValue "left"
     */
    textAlignment?: CardTextAlignment;

    /** Image asset source URL. */
    imageSrc?: string;

    /**
     * Accessible alternative text for the card image.
     * @defaultValue "Card visual"
     */
    imageAlt?: string;

    /**
     * Controls image media container visibility.
     * @defaultValue true
     */
    showImage?: boolean;

    /** Custom slot to override default image rendering. */
    imageSlot?: React.ReactNode;

    /** Custom class name applied to the image container element. */
    imageContainerClassName?: string;

    /** Custom class name applied to the img element. */
    imageClassName?: string;

    /** Custom class name applied to the content container below the image. */
    contentClassName?: string;

    /**
     * Card heading title content.
     * @defaultValue "Title"
     */
    title?: React.ReactNode;

    /**
     * Controls title visibility.
     * @defaultValue true
     */
    showTitle?: boolean;

    /**
     * Card body description content.
     * @defaultValue "Keep your messages short, but make sure they cover everything you need to say."
     */
    description?: React.ReactNode;

    /**
     * Controls description visibility.
     * @defaultValue true
     */
    showDescription?: boolean;

    /**
     * Master toggle for the entire title and description text wrapper.
     * @defaultValue true
     */
    showTextBlock?: boolean;

    /**
     * Controls supplementary items/features slot visibility.
     * @defaultValue false
     */
    showItems?: boolean;

    /** Content slot for feature items or lists between body and action buttons. */
    itemsSlot?: React.ReactNode;

    /**
     * Controls button action group visibility.
     * @defaultValue true
     */
    showButtons?: boolean;

    /** Custom slot to replace the default action buttons layout. */
    buttonsSlot?: React.ReactNode;

    /**
     * Label text for primary action button.
     * @defaultValue "Button"
     */
    primaryButtonText?: string;

    /** Additional props forwarded directly to the primary Button component. */
    primaryButtonProps?: CardButtonProps;

    /** Click event callback for the primary button. */
    onPrimaryClick?: () => void;

    /**
     * Label text for secondary action button.
     * @defaultValue "Button"
     */
    secondaryButtonText?: string;

    /** Additional props forwarded directly to the secondary Button component. */
    secondaryButtonProps?: CardButtonProps;

    /** Click event callback for the secondary button. */
    onSecondaryClick?: () => void;

    /** Additional class names applied to the card root container. */
    className?: string;

    /** Custom React children rendered between items slot and action buttons. */
    children?: React.ReactNode;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Vertical card layout component featuring an image header, structured text block,
 * optional items slot, and action button groups aligned with design system tokens.
 */
export const CardVertical: React.FC<CardVerticalProps> = ({
    hasShadow = true,
    shadowVariant = "200",
    borderStyle = "default",
    textAlignment = "left",

    imageSrc,
    imageAlt = "Card visual",
    showImage = true,
    imageSlot,
    imageContainerClassName,
    imageClassName,
    contentClassName,

    title = "Title",
    showTitle = true,
    description = "Keep your messages short, but make sure they cover everything you need to say.",
    showDescription = true,
    showTextBlock = true,

    showItems = false,
    itemsSlot,

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
    const alignmentClasses = {
        left: "items-start text-left",
        center: "items-center text-center",
        right: "items-end text-right"
    };

    const borderClasses = {
        default: "border border-grey-100",
        none: "border-none border-transparent"
    };

    const shadowClasses = {
        "200": "shadow-200 hover:shadow-300",
        "500": "shadow-500 hover:shadow-600"
    };

    return (
        <div
            className={cn(
                "group flex flex-col w-full max-w-[350px] overflow-hidden rounded-xl bg-surface-white transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-600 hover:z-10",
                hasShadow ? shadowClasses[shadowVariant] : "shadow-none",
                borderClasses[borderStyle],
                className
            )}
        >
            {/* Section: Header Media / Image Slot */}
            {showImage && (
                <div
                    className={cn(
                        "relative w-full overflow-hidden flex-shrink-0 bg-grey-200",
                        imageContainerClassName || "h-[200px]"
                    )}
                >
                    {imageSlot ? (
                        imageSlot
                    ) : imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={imageAlt}
                            className={cn(
                                "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                                imageClassName
                            )}
                        />
                    ) : (
                        <div className="w-full h-full bg-grey-200 flex items-center justify-center text-text-disabled font-nunito text-sm">
                            No Image
                        </div>
                    )}
                </div>
            )}

            <div className={cn("flex flex-col items-center gap-6 p-6 w-full flex-grow", contentClassName)}>
                {showTextBlock && (
                    <div
                        className={cn(
                            "flex flex-col gap-6 w-full",
                            alignmentClasses[textAlignment]
                        )}
                    >
                        {showTitle && title && (
                            <h3 className="w-full font-nunito font-black text-h5 text-primary-700 tracking-tight">
                                {title}
                            </h3>
                        )}

                        {showDescription && description && (
                            <p className="w-full font-nunito font-normal text-b1 text-primary-700">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                {/* NOTE: Figma variant Show Items=false by default */}
                {showItems && itemsSlot && (
                    <div className="w-full flex flex-col gap-3 py-2 border-y border-grey-100">
                        {itemsSlot}
                    </div>
                )}

                {children}

                {/* Section: Actions Group (Figma: Large Size, Filled + Outline) */}
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
