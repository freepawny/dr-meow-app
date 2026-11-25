/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface Section1CatPawsProps {
    className?: string;
}

/* ==========================================================================
   ATOMIC SUB-COMPONENTS
   ========================================================================== */

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
const Section1CatPaws: FC<Section1CatPawsProps> = ({ className }) => {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "pointer-events-none select-none absolute inset-x-0 top-14 mx-auto h-[369px] w-full max-w-[910px] z-0 overflow-hidden sm:overflow-visible",
                className
            )}
        >
            <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/10529d59a5b49171325281ba957db574a97df643?width=390"
                alt=""
                className="absolute left-0 top-[132px] h-[168px] w-[195px] aspect-[187/161] -scale-x-100 rotate-[-26.22deg] opacity-50 object-contain"
            />
            <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/0538b461a22e9a9910e37644e09cd6572214a11c?width=257"
                alt=""
                className="absolute right-0 sm:right-[39px] lg:left-[742px] top-0 h-[111px] w-[129px] aspect-[128.5/110.64] -scale-x-100 rotate-[32.12deg] opacity-50 object-contain"
            />
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export { Section1CatPaws };
export default Section1CatPaws;
