/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import { cn } from "@/lib/utils";
import CardVertical from "@/components/CardVertical";
import SectionHeader from "./SectionHeader";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Descriptor for an individual service delivery method option. */
export interface DeliveryMethodItem {
    /** Unique identifier for the delivery method. */
    id: string | number;
    /** Image URL illustrating the fulfillment method. */
    imageSrc?: string;
    /** Title of the fulfillment method. */
    title: string;
    /** Short description of the service flow. */
    description: string;
}

/**
 * Props for the DeliveryMethods section component.
 */
export interface DeliveryMethodsProps {
    /**
     * Primary section headline text.
     * @defaultValue "Empat Cara Untuk\nMembuat Kucing Menawan"
     */
    headline?: string;
    /**
     * Supporting sub-headline descriptive copy.
     * @defaultValue "Reservasi slot Kamu dalam hitungan menit. Pilih 1 dari 4 cara pemenuhan layanan yang paling pas dengan jadwal sibuk Anda."
     */
    subHeadline?: string;
    /**
     * List of delivery method entries to display.
     * @defaultValue DEFAULT_METHODS
     */
    methods?: DeliveryMethodItem[];
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/** Default fallback list of delivery methods. */
const DEFAULT_METHODS: DeliveryMethodItem[] = [
    {
        id: 1,
        imageSrc:
            "https://api.builder.io/api/v1/image/assets/TEMP/defb56e6e7f9bdfb282014073fe29a0b487ffb1b?width=534",
        title: "Antar-Jemput (Pick-up)",
        description: "Biar kurir terlatih kami yang jemput ke rumah."
    },
    {
        id: 2,
        imageSrc:
            "https://api.builder.io/api/v1/image/assets/TEMP/defb56e6e7f9bdfb282014073fe29a0b487ffb1b?width=534",
        title: "Home Service",
        description: "Groomer kami datang, kucing tetap tenang di teras Anda."
    },
    {
        id: 3,
        imageSrc:
            "https://api.builder.io/api/v1/image/assets/TEMP/defb56e6e7f9bdfb282014073fe29a0b487ffb1b?width=534",
        title: "Drop-off",
        description: "Tinggal kucingnya sebelum kerja, ambil saat sudah wangi."
    },
    {
        id: 4,
        imageSrc:
            "https://api.builder.io/api/v1/image/assets/TEMP/defb56e6e7f9bdfb282014073fe29a0b487ffb1b?width=534",
        title: "Ditunggu",
        description: "Bersantai di ruang tunggu indoor/outdoor kami."
    }
];

/**
 * Landing page section showcasing the four available service fulfillment methods.
 */
export const DeliveryMethods: React.FC<DeliveryMethodsProps> = ({
    headline = "Empat Cara Untuk\nMembuat Kucing Menawan",
    subHeadline = "Reservasi slot Kamu dalam hitungan menit. Pilih 1 dari 4 cara pemenuhan layanan yang paling pas dengan jadwal sibuk Anda.",
    methods = DEFAULT_METHODS,
    className
}) => {
    return (
        <section
            aria-label="Delivery Methods Section"
            className={cn(
                "flex w-full flex-col items-center justify-center gap-8 py-8 px-4 md:px-8 overflow-hidden",
                className
            )}
        >
            {/* Header */}
            <SectionHeader
                headline={headline}
                subHeadline={subHeadline}
                subHeadlineClassName="leading-normal"
            />

            {/* Cards Grid */}
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {methods.map((method) => (
                    <CardVertical
                        key={method.id}
                        hasShadow={false}
                        borderStyle="none"
                        textAlignment="center"
                        showButtons={false}
                        showItems={false}
                        showImage={true}
                        imageSrc={method.imageSrc}
                        imageAlt={method.title}
                        title={method.title}
                        description={method.description}
                    />
                ))}
            </div>
        </section>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export { DeliveryMethods as FourMethodServices };
export default DeliveryMethods;
