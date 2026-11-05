/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC } from "react";
import { Cat, User } from "lucide-react";
import SelectField from "@/components/SelectField";
import type { BackendCat, BackendCustomer } from "@/services/types";
import type {
    ReservationFormErrors,
    UpdateReservationFieldFn
} from "../types";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Props for the ExistingCustomerFields sub-component. */
export interface ExistingCustomerFieldsProps {
    /** List of registered customer records. */
    customers: BackendCustomer[];
    /** List of registered cats belonging to the selected customer. */
    cats: BackendCat[];
    /** Currently selected customer identifier. */
    selectedCustomerId: string;
    /** Currently selected cat identifier. */
    selectedCatId: string;
    /** Loading state indicator for customer fetch. */
    loadingCustomers: boolean;
    /** Loading state indicator for cat fetch. */
    loadingCats: boolean;
    /** Current form validation errors. */
    errors: ReservationFormErrors;
    /** Callback to update a single form field value. */
    onUpdateField: UpdateReservationFieldFn;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Dropdown selectors allowing returning customers to pick their existing profile and cat.
 */
export const ExistingCustomerFields: FC<ExistingCustomerFieldsProps> = ({
    customers,
    cats,
    selectedCustomerId,
    selectedCatId,
    loadingCustomers,
    loadingCats,
    errors,
    onUpdateField
}) => {
    return (
        <div className="flex flex-col gap-4">
            <SelectField
                label="Pilih Profil Pelanggan"
                required
                disabled={loadingCustomers || customers.length === 0}
                leftIcon={<User className="h-4 w-4" />}
                value={selectedCustomerId}
                onChange={(e) =>
                    onUpdateField("selectedCustomerId", e.target.value)
                }
                placeholder={
                    loadingCustomers
                        ? "Memuat data pelanggan..."
                        : "Belum ada pelanggan terdaftar"
                }
                options={customers.map((c) => ({
                    value: c.customer_id,
                    label: `${c.name} — ${c.phone_number}`
                }))}
                errorMessage={errors.selectedCustomerId}
                helperText={
                    customers.length === 0 && !loadingCustomers
                        ? "Belum ada data pelanggan di server. Silakan pilih tab Pelanggan Baru."
                        : undefined
                }
            />

            <SelectField
                label="Pilih Kucing Terdaftar"
                required
                disabled={loadingCats || cats.length === 0}
                leftIcon={<Cat className="h-4 w-4" />}
                value={selectedCatId}
                onChange={(e) => onUpdateField("selectedCatId", e.target.value)}
                placeholder={
                    loadingCats ? "Memuat data kucing..." : "Pilih kucing"
                }
                options={cats.map((cat) => ({
                    value: cat.cat_id,
                    label: `${cat.name} — ${cat.breeds} (${cat.weight} kg)`
                }))}
                errorMessage={errors.selectedCatId}
            />
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default ExistingCustomerFields;
