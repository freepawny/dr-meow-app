/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC } from "react";
import { Calendar, MapPin, Phone, User } from "lucide-react";
import ChoiceChip from "@/components/ChoiceChip";
import TextField from "@/components/TextField";
import { BRANCH_LOCATION_OPTIONS, TIME_SLOT_OPTIONS } from "../constants";
import type {
    ReservationFormErrors,
    ReservationFormValues,
    UpdateReservationFieldFn
} from "../types";
import { getNextOpenClinicDate } from "../utils/reservationHelpers";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Props for the OwnerScheduleFields sub-component. */
export interface OwnerScheduleFieldsProps {
    /** Current form field values. */
    values: ReservationFormValues;
    /** Current form validation errors. */
    errors: ReservationFormErrors;
    /** Whether the chosen fulfillment method requires a full home address. */
    requiresHomeAddress: boolean;
    /** Callback to update a single form field value. */
    onUpdateField: UpdateReservationFieldFn;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Renders owner identity, arrival date/time slot, and home/branch address inputs.
 */
export const OwnerScheduleFields: FC<OwnerScheduleFieldsProps> = ({
    values,
    errors,
    requiresHomeAddress,
    onUpdateField
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <TextField
                    label="Nama Paw Parent"
                    required
                    placeholder="Contoh: Nadia Putri"
                    leftIcon={<User className="h-4 w-4" />}
                    value={values.customerName}
                    onChange={(e) =>
                        onUpdateField("customerName", e.target.value)
                    }
                    errorMessage={errors.customerName}
                />
                <TextField
                    label="Nomor WhatsApp"
                    type="tel"
                    required
                    placeholder="081234567890"
                    leftIcon={<Phone className="h-4 w-4" />}
                    value={values.phoneNumber}
                    onChange={(e) =>
                        onUpdateField("phoneNumber", e.target.value)
                    }
                    errorMessage={errors.phoneNumber}
                />
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <TextField
                    label="Tanggal Kedatangan / Jemput"
                    type="date"
                    required
                    min={getNextOpenClinicDate()}
                    leftIcon={<Calendar className="h-4 w-4" />}
                    value={values.scheduleDate}
                    onChange={(e) =>
                        onUpdateField("scheduleDate", e.target.value)
                    }
                    helperText="Buka Sabtu–Kamis (Jumat libur)"
                    errorMessage={errors.scheduleDate}
                />

                <div className="flex flex-col gap-1.5">
                    <span className="font-quicksand text-b3 font-bold text-primary-700">
                        Pilih Sesi Jam{" "}
                        <span className="text-text-error" aria-hidden="true">
                            *
                        </span>
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                        {TIME_SLOT_OPTIONS.map((slot) => (
                            <ChoiceChip
                                key={slot.value}
                                label={slot.label}
                                isSelected={values.timeSlot === slot.value}
                                onClick={() =>
                                    onUpdateField("timeSlot", slot.value)
                                }
                                className="px-2.5 py-2"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {!requiresHomeAddress && (
                    <div className="flex flex-col gap-1.5">
                        <span className="font-quicksand text-c1 font-bold text-grey-600">
                            Pilih Cepat Cabang Tujuan (1-Klik):
                        </span>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {BRANCH_LOCATION_OPTIONS.map((branch) => (
                                <ChoiceChip
                                    key={branch.value}
                                    label={branch.label}
                                    subLabel={branch.subLabel}
                                    isSelected={values.address === branch.value}
                                    onClick={() =>
                                        onUpdateField("address", branch.value)
                                    }
                                    className="py-2"
                                />
                            ))}
                        </div>
                    </div>
                )}

                <TextField
                    label={
                        requiresHomeAddress
                            ? "Alamat Lengkap Rumah"
                            : "Cabang / Detail Alamat"
                    }
                    required
                    placeholder={
                        requiresHomeAddress
                            ? "Jl. Soekarno Hatta No. 15, Kec. Lowokwaru, Malang"
                            : "Pilih cabang di atas atau tulis alamat Anda"
                    }
                    leftIcon={<MapPin className="h-4 w-4" />}
                    value={values.address}
                    onChange={(e) => onUpdateField("address", e.target.value)}
                    errorMessage={errors.address}
                />
            </div>
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default OwnerScheduleFields;
