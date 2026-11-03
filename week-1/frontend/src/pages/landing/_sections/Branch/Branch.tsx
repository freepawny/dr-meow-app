/* ==========================================================================
   IMPORTS
   ========================================================================== */
import type { FC } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import CardVertical from "@/components/CardVertical";
import SectionHeader from "../../_components/SectionHeader";
import {
    type BranchItem,
    DEFAULT_BRANCHES,
    DEFAULT_HEADLINE,
    DEFAULT_SUBHEADLINE,
    DEFAULT_LOGO_SRC
} from "./constants";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export type { BranchItem };

/**
 * Props for the Branch section component.
 */
export interface BranchProps {
    /**
     * Primary section headline text.
     * @defaultValue DEFAULT_HEADLINE
     */
    headline?: string;
    /**
     * Supporting operational sub-headline descriptive copy.
     * @defaultValue DEFAULT_SUBHEADLINE
     */
    subHeadline?: string;
    /**
     * Brand logo image source URL.
     * @defaultValue DEFAULT_LOGO_SRC
     */
    logoSrc?: string;
    /**
     * Collection of branch location items to display.
     * @defaultValue DEFAULT_BRANCHES
     */
    branches?: BranchItem[];
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Landing page section displaying physical clinic and salon branch locations with operational details.
 */
export const Branch: FC<BranchProps> = ({
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
    logoSrc = DEFAULT_LOGO_SRC,
    branches = DEFAULT_BRANCHES,
    className
}) => {
    const branchList = branches.length > 0 ? branches : DEFAULT_BRANCHES;

    return (
        <section
            aria-label="Branch Section"
            className={cn("flex w-full flex-col items-center justify-center gap-8", className)}
        >
            <SectionHeader headline={headline} subHeadline={subHeadline} />

            <div className="flex w-full max-w-[978px] flex-col items-center">
                <div className="relative hidden h-[190px] w-[520px] md:flex flex-col items-center drop-shadow-[0_6px_14px_rgba(19,25,39,0.12)] drop-shadow-[0_10px_32px_rgba(19,25,39,0.10)]">
                    <svg
                        className="absolute left-0 top-[97px]"
                        width="520"
                        height="93"
                        viewBox="0 0 520 93"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M0 93C0 46.611 -0.000136951 46.611 129.579 46.611C259.159 46.611 259.72 46.389 259.72 0M520 93C520 46.611 520 46.611 390.421 46.611C260.841 46.611 260.28 46.389 260.28 0"
                            stroke="white"
                            strokeWidth="8"
                        />
                    </svg>
                    <div className="absolute left-[120px] top-0 flex h-[110px] w-[282px] items-center justify-center rounded-[32px] bg-white">
                        <img
                            src={logoSrc}
                            alt="DR. MEOWW Logo"
                            className="h-[84px] w-[258px] object-contain"
                        />
                    </div>
                </div>

                <div
                    className={cn(
                        "mb-6 flex md:hidden items-center justify-center rounded-[32px] bg-white p-4 shadow-500",
                        "hover:scale-[1.02] hover:shadow-600 hover:z-10"
                    )}
                >
                    <img
                        src={logoSrc}
                        alt="DR. MEOWW Logo"
                        className="h-14 w-auto object-contain"
                    />
                </div>

                <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {branchList.map((branch) => (
                        <CardVertical
                            key={branch.id}
                            hasShadow
                            shadowVariant="500"
                            borderStyle="none"
                            showImage={false}
                            showTextBlock={false}
                            showButtons={false}
                            showItems={false}
                            contentClassName="p-6 items-start justify-between"
                            className="w-full max-w-none flex-1 rounded-xl"
                        >
                            <div className="flex w-full flex-col items-start gap-4">
                                <div className="flex w-full items-center justify-between gap-2">
                                    <Badge
                                        size="small"
                                        variantStyle="outline"
                                        label={branch.tag}
                                        className="h-8 rounded-lg border-[1.5px] border-primary-500 bg-primary-50 px-3 text-primary-700 font-quicksand font-bold text-label"
                                    />
                                    <span className="font-nunito text-b3 font-bold text-green-600">
                                        {branch.operatingHours}
                                    </span>
                                </div>

                                <h3 className="w-full font-nunito text-h5 font-black leading-7 text-primary-700">
                                    {branch.titlePrefix}{" "}
                                    <span className="text-yellow-500">{branch.titleHighlight}</span>
                                </h3>

                                <div className="flex w-full items-start gap-2 text-grey-600 font-nunito text-b1 leading-6">
                                    <MapPin className="h-6 w-6 shrink-0 text-blue-700 mt-0.5" />
                                    <p>
                                        <strong className="font-black">
                                            {branch.addressRoad},{" "}
                                        </strong>
                                        <span className="font-normal">
                                            {branch.addressDistrict}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex w-full flex-col font-nunito text-c1 text-grey-600 leading-4">
                                    <span className="font-normal">Tersedia:</span>
                                    {branch.facilities.map((facility, index) => (
                                        <span key={index}>{facility}</span>
                                    ))}
                                </div>

                                <Button
                                    size="giant"
                                    variantStyle="outline"
                                    href={branch.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full rounded-xl border-[1.5px] border-primary-500 font-quicksand font-bold text-button-gnt text-primary-700 hover:bg-primary-50 active:scale-95"
                                >
                                    {branch.mapButtonText || "Buka di Google Maps"}
                                </Button>
                            </div>
                        </CardVertical>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default Branch;
