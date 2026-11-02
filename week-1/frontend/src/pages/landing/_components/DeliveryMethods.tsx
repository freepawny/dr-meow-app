/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import { cn } from "@/lib/utils";
import CardVertical from "@/components/CardVertical";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface DeliveryMethodItem {
    id: string | number;
    imageSrc?: string;
    title: string;
    description: string;
}

export interface DeliveryMethodsProps {
    headline?: string;
    subHeadline?: string;
    methods?: DeliveryMethodItem[];
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
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
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <h2 className="font-nunito text-h2 font-black text-primary-700 leading-tight whitespace-pre-line">
                    {headline}
                </h2>
                <p className="max-w-[618px] font-nunito text-b1 text-primary-700 leading-normal">
                    {subHeadline}
                </p>
            </div>

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
