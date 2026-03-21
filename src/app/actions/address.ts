"use server";

import { revalidatePath } from "next/cache";
import { getSessionToken } from "../lib/session";
import {
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  type AddressInput,
} from "../services/shopifyCustomer";

export interface AddressActionResult {
  error?: string;
  success?: boolean;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function requireToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) throw new Error("Nicht angemeldet.");
  return token;
}

function formDataToAddress(fd: FormData): AddressInput {
  const get = (k: string) => (fd.get(k) as string | null)?.trim() || undefined;
  return {
    firstName: get("firstName"),
    lastName:  get("lastName"),
    address1:  get("address1"),
    address2:  get("address2"),
    city:      get("city"),
    province:  get("province"),
    zip:       get("zip"),
    country:   get("country"),
    phone:     get("phone"),
  };
}

// ─── Adresse hinzufügen ───────────────────────────────────────────────────────

export async function addAddressAction(
  _prev: AddressActionResult,
  formData: FormData
): Promise<AddressActionResult> {
  try {
    const token = await requireToken();
    const { errors } = await createCustomerAddress(token, formDataToAddress(formData));
    if (errors.length > 0) return { error: errors[0].message };
    revalidatePath("/pages/account");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Fehler beim Hinzufügen." };
  }
}

// ─── Adresse bearbeiten ───────────────────────────────────────────────────────

export async function updateAddressAction(
  _prev: AddressActionResult,
  formData: FormData
): Promise<AddressActionResult> {
  const id = formData.get("addressId") as string | null;
  if (!id) return { error: "Adress-ID fehlt." };

  try {
    const token = await requireToken();
    const { errors } = await updateCustomerAddress(token, id, formDataToAddress(formData));
    if (errors.length > 0) return { error: errors[0].message };
    revalidatePath("/pages/account");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Fehler beim Bearbeiten." };
  }
}

// ─── Adresse löschen ─────────────────────────────────────────────────────────

export async function deleteAddressAction(
  _prev: AddressActionResult,
  formData: FormData
): Promise<AddressActionResult> {
  const id = formData.get("addressId") as string | null;
  if (!id) return { error: "Adress-ID fehlt." };

  try {
    const token = await requireToken();
    const { errors } = await deleteCustomerAddress(token, id);
    if (errors.length > 0) return { error: errors[0].message };
    revalidatePath("/pages/account");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Fehler beim Löschen." };
  }
}
