/** Data model representing a before-and-after grooming transformation pair. */
export interface BeforeAfterItem {
    /** Unique identifier for the transformation entry. */
    id: string | number;
    /** Image source URL illustrating the pet's condition before treatment. */
    beforeImage: string;
    /** Accessible alternative text for the before image. */
    beforeAlt?: string;
    /** Image source URL illustrating the pet's condition after treatment. */
    afterImage: string;
    /** Accessible alternative text for the after image. */
    afterAlt?: string;
}

/** Default section headline text for the BeforeAfter showcase. */
export const DEFAULT_HEADLINE = "Lihat Bagaimana Perubahan Kucing-Kucing Ini";

/** Default supporting sub-headline copy for the BeforeAfter showcase. */
export const DEFAULT_SUBHEADLINE =
    "Jangan hanya percaya kata-kata kami. Lihat transformasi dan cerita bahagia dari para Paw Parents di Malang.";

/** Default list of before-and-after grooming transformation showcases. */
export const DEFAULT_ITEMS: BeforeAfterItem[] = [
    {
        id: 1,
        beforeImage:
            "https://api.builder.io/api/v1/image/assets/TEMP/c6fcd5953097f1c1ef2cf47075ad67c4ef2bc472?width=658",
        beforeAlt: "Transformasi kucing sebelum grooming",
        afterImage:
            "https://api.builder.io/api/v1/image/assets/TEMP/023ba9531a56b6ce60863a880f0dee8b632f3390?width=658",
        afterAlt: "Transformasi kucing setelah grooming"
    },
    {
        id: 2,
        beforeImage:
            "https://api.builder.io/api/v1/image/assets/TEMP/023ba9531a56b6ce60863a880f0dee8b632f3390?width=658",
        beforeAlt: "Transformasi kucing sebelum perawatan intensif",
        afterImage:
            "https://api.builder.io/api/v1/image/assets/TEMP/c6fcd5953097f1c1ef2cf47075ad67c4ef2bc472?width=658",
        afterAlt: "Transformasi kucing setelah perawatan intensif"
    }
];
