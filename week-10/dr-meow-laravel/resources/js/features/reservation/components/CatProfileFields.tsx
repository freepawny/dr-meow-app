/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC } from "react";
import { Cat } from "lucide-react";
import ChoiceChip from "@/components/ChoiceChip";
import SelectField from "@/components/SelectField";
import TextField from "@/components/TextField";
import {
    CAT_BREED_OPTIONS,
    MEDICAL_CONDITION_OPTIONS,
    TEMPERAMENT_OPTIONS,
    WEIGHT_PRESET_OPTIONS
} from "../constants";
import type {
    ReservationFormErrors,
    ReservationFormValues,
    ReservationWeightTier,
    UpdateReservationFieldFn
} from "../types";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Props for the CatProfileFields sub-component. */
export interface CatProfileFieldsProps {
    /** Current form field values. */
    values: ReservationFormValues;
    /** Current form validation errors. */
    errors: ReservationFormErrors;
    /** Current weight bracket identifier matching active cat weight. */
    currentWeightTier: ReservationWeightTier;
    /** Callback to update a single form field value. */
    onUpdateField: UpdateReservationFieldFn;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Renders cat identity, breed, weight tier + numeric input, temperament, and medical condition fields.
 */
export const CatProfileFields: FC<CatProfileFieldsProps> = ({
    values,
    errors,
    currentWeightTier,
    onUpdateField
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <TextField
                    label="Nama Kucing (Anabul)"
                    required
                    placeholder="Contoh: Mochi"
                    leftIcon={<Cat className="h-4 w-4" />}
                    value={values.catName}
                    onChange={(e) => onUpdateField("catName", e.target.value)}
                    errorMessage={errors.catName}
                />

                <SelectField
                    label="Ras Kucing"
                    required
                    options={CAT_BREED_OPTIONS}
                    value={values.catBreed}
                    onChange={(e) => onUpdateField("catBreed", e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2">
                <span className="font-quicksand text-b3 font-bold text-primary-700">
                    Ukuran & Berat Badan Kucing{" "}
                    <span className="text-text-error" aria-hidden="true">
                        *
                    </span>
                </span>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {WEIGHT_PRESET_OPTIONS.map((preset) => (
                        <ChoiceChip
                            key={preset.tier}
                            label={preset.label}
                            subLabel={preset.subLabel}
                            isSelected={currentWeightTier === preset.tier}
                            onClick={() =>
                                onUpdateField("catWeight", preset.defaultWeight)
                            }
                            className="py-2"
                        />
                    ))}
                </div>

                <TextField
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="25"
                    placeholder="1.5"
                    rightAddon="kg"
                    value={values.catWeight}
                    onChange={(e) => onUpdateField("catWeight", e.target.value)}
                    helperText="Klik kategori di atas atau sesuaikan angka berat presisi (kg)."
                    errorMessage={errors.catWeight}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <span className="font-quicksand text-b3 font-bold text-primary-700">
                    Karakter / Temperamen Anabul
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {TEMPERAMENT_OPTIONS.map((temp) => (
                        <ChoiceChip
                            key={temp.value}
                            label={temp.label}
                            subLabel={temp.subLabel}
                            isSelected={values.catTemperament === temp.value}
                            onClick={() =>
                                onUpdateField("catTemperament", temp.value)
                            }
                            className="px-3 py-2"
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <span className="font-quicksand text-b3 font-bold text-primary-700">
                    Kondisi Fisik / Keluhan Saat Ini
                </span>
                <div className="grid grid-cols-2 gap-2">
                    {MEDICAL_CONDITION_OPTIONS.map((cond) => (
                        <ChoiceChip
                            key={cond.value}
                            label={cond.label}
                            isSelected={values.medicalHistory === cond.value}
                            onClick={() =>
                                onUpdateField("medicalHistory", cond.value)
                            }
                            className="px-3 py-2"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default CatProfileFields;
