import type {
  Customer,
  CustomerAccessToken,
  CustomerUserError,
  Order,
  RecoverPasswordResult,
} from "../types/shopify";

// ─── Shared fetch — nie gecached ──────────────────────────────────────────────

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function customerFetch<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);

  const json = await res.json();
  if (json.errors)
    throw new Error(
      json.errors.map((e: { message: string }) => e.message).join("\n"),
    );

  return json.data as T;
}

// ─── Rückgabe-Typen ───────────────────────────────────────────────────────────

export interface LoginResult {
  accessToken: CustomerAccessToken | null;
  errors: CustomerUserError[];
}

export interface RegisterResult {
  customer: Pick<Customer, "id" | "email"> | null;
  errors: CustomerUserError[];
}

export interface CustomerDataResult {
  customer: Customer | null;
}

// ─── Login ────────────────────────────────────────────────────────────────────

const LOGIN_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export async function loginCustomer(
  email: string,
  password: string,
): Promise<LoginResult> {
  type Raw = {
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: CustomerUserError[];
    };
  };

  const data = await customerFetch<Raw>(LOGIN_MUTATION, {
    input: { email, password },
  });

  return {
    accessToken: data.customerAccessTokenCreate.customerAccessToken,
    errors: data.customerAccessTokenCreate.customerUserErrors,
  };
}

// ─── Registrierung ────────────────────────────────────────────────────────────

const REGISTER_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export async function registerCustomer(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<RegisterResult> {
  type Raw = {
    customerCreate: {
      customer: Pick<Customer, "id" | "email"> | null;
      customerUserErrors: CustomerUserError[];
    };
  };

  const data = await customerFetch<Raw>(REGISTER_MUTATION, {
    input: { firstName, lastName, email, password },
  });

  return {
    customer: data.customerCreate.customer,
    errors: data.customerCreate.customerUserErrors,
  };
}

// ─── Kundendaten abrufen ──────────────────────────────────────────────────────

const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        id firstName lastName
        address1 address2
        city province zip country phone
      }
      addresses(first: 5) {
        edges {
          node {
            id firstName lastName
            address1 address2
            city province zip country phone
          }
        }
      }
    }
  }
`;

export async function getCustomerData(
  accessToken: string,
): Promise<CustomerDataResult> {
  type Raw = { customer: Customer | null };

  const data = await customerFetch<Raw>(CUSTOMER_QUERY, {
    customerAccessToken: accessToken,
  });

  return { customer: data.customer };
}

// ─── Bestellungen abrufen ─────────────────────────────────────────────────────

export interface CustomerOrdersResult {
  orders: Order[];
}

const ORDERS_QUERY = `
  query getCustomerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            fulfillmentStatus
            financialStatus
            totalPrice { amount currencyCode }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    price { amount currencyCode }
                    image { url altText }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCustomerOrders(
  accessToken: string,
  first = 10,
): Promise<CustomerOrdersResult> {
  type Raw = {
    customer: {
      orders: { edges: Array<{ node: Order }> };
    } | null;
  };

  const data = await customerFetch<Raw>(ORDERS_QUERY, {
    customerAccessToken: accessToken,
    first,
  });

  const orders = data.customer?.orders.edges.map((e) => e.node) ?? [];
  return { orders };
}

// ─── Adress-Mutations ─────────────────────────────────────────────────────────

export interface AddressInput {
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  phone?: string;
}

export interface AddressMutationResult {
  id: string | null;
  errors: CustomerUserError[];
}

const ADDRESS_FRAGMENT = `
  id firstName lastName address1 address2 city province zip country phone
`;

export async function createCustomerAddress(
  accessToken: string,
  address: AddressInput,
): Promise<AddressMutationResult> {
  type Raw = {
    customerAddressCreate: {
      customerAddress: { id: string } | null;
      customerUserErrors: CustomerUserError[];
    };
  };
  const data = await customerFetch<Raw>(
    `
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress { ${ADDRESS_FRAGMENT} }
        customerUserErrors { field message code }
      }
    }`,
    { customerAccessToken: accessToken, address },
  );
  return {
    id: data.customerAddressCreate.customerAddress?.id ?? null,
    errors: data.customerAddressCreate.customerUserErrors,
  };
}

export async function updateCustomerAddress(
  accessToken: string,
  id: string,
  address: AddressInput,
): Promise<AddressMutationResult> {
  type Raw = {
    customerAddressUpdate: {
      customerAddress: { id: string } | null;
      customerUserErrors: CustomerUserError[];
    };
  };
  const data = await customerFetch<Raw>(
    `
    mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
      customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
        customerAddress { ${ADDRESS_FRAGMENT} }
        customerUserErrors { field message code }
      }
    }`,
    { customerAccessToken: accessToken, id, address },
  );
  return {
    id: data.customerAddressUpdate.customerAddress?.id ?? null,
    errors: data.customerAddressUpdate.customerUserErrors,
  };
}

export async function deleteCustomerAddress(
  accessToken: string,
  id: string,
): Promise<{ deletedId: string | null; errors: CustomerUserError[] }> {
  type Raw = {
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: CustomerUserError[];
    };
  };
  const data = await customerFetch<Raw>(
    `
    mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        deletedCustomerAddressId
        customerUserErrors { field message code }
      }
    }`,
    { customerAccessToken: accessToken, id },
  );
  return {
    deletedId: data.customerAddressDelete.deletedCustomerAddressId,
    errors: data.customerAddressDelete.customerUserErrors,
  };
}

// ─── Passwort zurücksetzen ────────────────────────────────────────────────────

/**
 * Weist Shopify an, die Standard-Passwort-Reset-E-Mail zu versenden.
 *
 * Sicherheitshinweis: Shopify gibt bei unbekannter E-Mail keinen Fehler zurück
 * (User-Enumeration-Schutz). `success: true` bedeutet nur, dass die Anfrage
 * technisch korrekt war — nicht dass die Adresse existiert.
 */
export async function sendPasswordResetEmail(email: string) {
  const query = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const response = await fetch(process.env.SHOPIFY_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_TOKEN!,
    },
    body: JSON.stringify({ query, variables: { email } }),
  });

  return response.json();
}

const RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

export async function recoverCustomerPassword(
  email: string,
): Promise<RecoverPasswordResult> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      errors: [
        {
          field: ["email"],
          message: "Bitte gib eine gültige E-Mail-Adresse ein.",
          code: "INVALID",
        },
      ],
    };
  }

  type Raw = {
    customerRecover: {
      customerUserErrors: CustomerUserError[];
    };
  };

  const data = await customerFetch<Raw>(RECOVER_MUTATION, { email });
  const errors = data.customerRecover.customerUserErrors;

  return {
    success: errors.length === 0,
    errors,
  };
}
