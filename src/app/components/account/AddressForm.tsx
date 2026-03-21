import { FormField } from "../auth/FormField";
import { SubmitButton } from "../auth/SubmitButton";
import type { CustomerAddress } from "../../types/shopify";

interface AddressFormProps {
  action: (prev: unknown, fd: FormData) => Promise<unknown>;
  defaultValues?: Partial<CustomerAddress>;
  addressId?: string;
  onCancel: () => void;
  submitLabel: string;
  pendingLabel: string;
}

export function AddressForm({
  action,
  defaultValues,
  addressId,
  onCancel,
  submitLabel,
  pendingLabel,
}: AddressFormProps) {
  return (
    // @ts-expect-error – useActionState action is compatible
    <form action={action} className="space-y-4">
      {addressId && (
        <input type="hidden" name="addressId" value={addressId} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="addr-firstName" name="firstName" label="Vorname"
          placeholder="Max"
          defaultValue={defaultValues?.firstName ?? ""}
        />
        <FormField
          id="addr-lastName" name="lastName" label="Nachname"
          placeholder="Mustermann"
          defaultValue={defaultValues?.lastName ?? ""}
        />
      </div>

      <FormField
        id="addr-address1" name="address1" label="Adresse"
        placeholder="Musterstraße 1"
        defaultValue={defaultValues?.address1 ?? ""}
        required
      />
      <FormField
        id="addr-address2" name="address2" label="Adresszusatz (optional)"
        placeholder="Apartment, Etage, …"
        defaultValue={defaultValues?.address2 ?? ""}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="addr-zip" name="zip" label="PLZ"
          placeholder="12345"
          defaultValue={defaultValues?.zip ?? ""}
          required
        />
        <FormField
          id="addr-city" name="city" label="Stadt"
          placeholder="Berlin"
          defaultValue={defaultValues?.city ?? ""}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="addr-country" name="country" label="Land"
          placeholder="Deutschland"
          defaultValue={defaultValues?.country ?? "Deutschland"}
          required
        />
        <FormField
          id="addr-phone" name="phone" label="Telefon (optional)"
          type="tel" placeholder="+49 123 456789"
          defaultValue={defaultValues?.phone ?? ""}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <SubmitButton label={submitLabel} pendingLabel={pendingLabel} className="flex-1" />
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 rounded-sm text-sm font-medium text-stone dark:text-muted border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors duration-150"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
