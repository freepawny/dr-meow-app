/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import Badge from "@/components/Badge";
import { Check } from "lucide-react";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface PricingFeature {
    id: string | number;
    text: string;
}

export type PricingCardVariant = "default" | "popular" | string;

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: PricingCardVariant;
    badgeLabel?: string;
    subCategory?: string;
    category: string;
    price: string;
    priceUnit?: string;
    description: string;
    features: PricingFeature[];
    buttonLabel?: string;
    onButtonClick?: () => void;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
export const PricingCard: React.FC<PricingCardProps> = ({
    variant = "default",
    badgeLabel = "Label",
    subCategory = "Text",
    category,
    price,
    priceUnit = "/ pcs",
    description,
    features,
    buttonLabel = "Choose This Category",
    onButtonClick,
    className,
    ...props
}) => {
    const isPopular = variant === "popular";

    return (
        <div
            className={cn(
                // Base styles
                "relative flex w-full flex-col items-center rounded-[12px] bg-white shadow-500 transition-all duration-300",
                "md:max-w-[415px]",
                "hover:scale-[1.02] hover:shadow-600 hover:z-10",
                "focus-within:ring-2 focus-within:ring-primary-400 focus-within:ring-offset-2",
                isPopular && "border-4 border-yellow-300 ",
                className
            )}
            {...props}
        >
            {/* BADGE for POPULAR variant */}
            {isPopular && (
                <div className="absolute left-1/2 -top-4 -translate-x-1/2">
                    <Badge
                        size="medium"
                        badgeState="warning"
                        variantStyle="filled"
                        label="Paling Populer"
                        showText={true}
                        className="bg-yellow-300 text-white shadow-md"
                    />
                </div>
            )}

            <div className="flex w-full flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex w-full flex-col gap-6">
                    <div className="flex w-full items-center justify-between">
                        <Badge
                            size="small"
                            badgeState="default"
                            variantStyle="outline"
                            label={badgeLabel}
                        />
                        <span className="font-nunito text-c1 text-grey-400">{subCategory}</span>
                    </div>

                    <div className="flex flex-col items-start gap-4">
                        <h3 className="font-nunito text-h5 font-black text-primary-700">
                            {category}
                        </h3>
                        <div className="flex items-end gap-4">
                            <span className="font-nunito text-h4 font-black text-text-accent">
                                {price}
                            </span>
                            <span className="mb-1 font-nunito text-b1 text-grey-400">
                                {priceUnit}
                            </span>
                        </div>
                        <p className="font-nunito text-b1 text-primary-700">{description}</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex w-full justify-center py-1">
                    <div className="h-px w-full max-w-[256px] bg-[#D9D9D9]" />
                </div>

                {/* Features List */}
                <div className="flex w-full flex-col gap-4">
                    {features.map((feature) => (
                        <div key={feature.id} className="flex items-start gap-2">
                            <Check className="mt-0.5 size-6 shrink-0 text-text-success" />
                            <span className="flex-1 font-nunito text-c1 text-primary-700">
                                {feature.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <div className="mt-2 flex w-full flex-col">
                    <Button
                        size="large"
                        variantStyle="filled"
                        onClick={onButtonClick}
                        className="w-full focus:ring-offset-2" // ensures button focus state is visible
                    >
                        {buttonLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default PricingCard;
