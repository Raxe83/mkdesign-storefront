import { adminFetch } from "./adminClient";
import type {
  Customer,
  CustomerAddress,
  Order,
  OrderDetail,
  OrderFulfillmentStatus,
  OrderFinancialStatus,
  OrderDetailLineItem,
} from "../../types/shopify";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseOrderNumber(name: string): number {
  return parseInt(name.replace(/\D/g, ""), 10) || 0;
}

function mapAddress(a: RawAdminAddress): CustomerAddress {
  return {
    id: a.id,
    firstName: a.firstName,
    lastName: a.lastName,
    address1: a.address1,
    address2: a.address2,
    city: a.city,
    province: a.province,
    zip: a.zip,
    country: a.country,
    phone: a.phone,
  };
}

// ─── Raw Admin API Types ─────────────────────────────────────────────────────

interface RawAdminAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
}

interface RawAdminOrder {
  id: string;
  name: string;
  createdAt: string;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  statusUrl: string;
  cancelReason: string | null;
  cancelledAt: string | null;
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  subtotalPriceSet?: { shopMoney: { amount: string; currencyCode: string } } | null;
  totalShippingPriceSet?: { shopMoney: { amount: string; currencyCode: string } } | null;
  totalTaxSet?: { shopMoney: { amount: string; currencyCode: string } } | null;
  shippingAddress: RawAdminAddress | null;
  fulfillments: Array<{ trackingInfo: Array<{ number: string; url: string | null }> }>;
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        originalTotalSet: { shopMoney: { amount: string; currencyCode: string } } | null;
        variant: {
          title: string;
          sku: string | null;
          price: string;
          image: { url: string; altText: string | null } | null;
          selectedOptions: Array<{ name: string; value: string }>;
          product: { handle: string } | null;
        } | null;
      };
    }>;
  };
}

// ─── Customer Lookup ─────────────────────────────────────────────────────────

const CUSTOMER_BY_EMAIL = `
  query customerByEmail($q: String!) {
    customers(first: 1, query: $q) {
      edges { node { id firstName lastName email } }
    }
  }
`;

export async function adminLookupCustomerByEmail(
  email: string,
): Promise<{ id: string; firstName: string; lastName: string; email: string } | null> {
  type R = { customers: { edges: Array<{ node: { id: string; firstName: string; lastName: string; email: string } }> } };
  const data = await adminFetch<R>(CUSTOMER_BY_EMAIL, { q: `email:${email}` }, { noCache: true });
  return data.customers.edges[0]?.node ?? null;
}

// ─── Customer Data ───────────────────────────────────────────────────────────

const CUSTOMER_BY_ID = `
  query customerById($id: ID!) {
    customer(id: $id) {
      id firstName lastName email phone
      defaultAddress { id firstName lastName address1 address2 city province zip country phone }
      addresses(first: 10) { id firstName lastName address1 address2 city province zip country phone }
    }
  }
`;

export async function adminGetCustomerById(customerId: string): Promise<Customer | null> {
  type R = { customer: { id: string; firstName: string; lastName: string; email: string; phone: string | null; defaultAddress: RawAdminAddress | null; addresses: RawAdminAddress[] } | null };
  const data = await adminFetch<R>(CUSTOMER_BY_ID, { id: customerId }, { noCache: true });
  const c = data.customer;
  if (!c) return null;
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    defaultAddress: c.defaultAddress ? mapAddress(c.defaultAddress) : null,
    addresses: { edges: c.addresses.map((a) => ({ node: mapAddress(a) })) },
  };
}

// ─── Customer Orders ─────────────────────────────────────────────────────────

const CUSTOMER_ORDERS = `
  query customerOrders($id: ID!, $first: Int!) {
    customer(id: $id) {
      orders(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id name createdAt
            displayFulfillmentStatus displayFinancialStatus
            totalPriceSet { shopMoney { amount currencyCode } }
            lineItems(first: 5) {
              edges {
                node {
                  title quantity
                  variant { price image { url altText } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function adminGetCustomerOrders(customerId: string, first = 10): Promise<Order[]> {
  type R = { customer: { orders: { edges: Array<{ node: RawAdminOrder }> } } | null };
  const data = await adminFetch<R>(CUSTOMER_ORDERS, { id: customerId, first }, { noCache: true });
  const raw = data.customer?.orders.edges ?? [];
  return raw.map(({ node: o }) => {
    const cur = o.totalPriceSet.shopMoney.currencyCode;
    return {
      id: o.id,
      orderNumber: parseOrderNumber(o.name),
      processedAt: o.createdAt,
      fulfillmentStatus: o.displayFulfillmentStatus as OrderFulfillmentStatus,
      financialStatus: o.displayFinancialStatus as OrderFinancialStatus,
      totalPrice: o.totalPriceSet.shopMoney,
      lineItems: {
        edges: o.lineItems.edges.map(({ node: li }) => ({
          node: {
            title: li.title,
            quantity: li.quantity,
            variant: li.variant ? { price: { amount: li.variant.price, currencyCode: cur }, image: li.variant.image } : null,
          },
        })),
      },
    };
  });
}

// ─── Order Detail ────────────────────────────────────────────────────────────

const ORDER_DETAIL = `
  query orderDetail($id: ID!) {
    order(id: $id) {
      id name createdAt statusUrl cancelReason cancelledAt
      displayFulfillmentStatus displayFinancialStatus
      totalPriceSet { shopMoney { amount currencyCode } }
      subtotalPriceSet { shopMoney { amount currencyCode } }
      totalShippingPriceSet { shopMoney { amount currencyCode } }
      totalTaxSet { shopMoney { amount currencyCode } }
      shippingAddress { firstName lastName address1 address2 city province zip country phone }
      fulfillments { trackingInfo { number url } }
      lineItems(first: 50) {
        edges {
          node {
            title quantity
            originalTotalSet { shopMoney { amount currencyCode } }
            variant {
              title sku price
              image { url altText }
              selectedOptions { name value }
              product { handle }
            }
          }
        }
      }
    }
  }
`;

export async function adminGetOrderDetail(orderId: string): Promise<OrderDetail | null> {
  const gid = orderId.startsWith("gid://") ? orderId : `gid://shopify/Order/${orderId}`;
  type R = { order: RawAdminOrder | null };
  try {
    const data = await adminFetch<R>(ORDER_DETAIL, { id: gid }, { noCache: true });
    const o = data.order;
    if (!o) return null;
    const cur = o.totalPriceSet.shopMoney.currencyCode;
    const items: OrderDetailLineItem[] = o.lineItems.edges.map(({ node: li }) => ({
      title: li.title,
      quantity: li.quantity,
      originalTotalPrice: li.originalTotalSet?.shopMoney ?? null,
      variant: li.variant
        ? {
            title: li.variant.title,
            sku: li.variant.sku,
            price: { amount: li.variant.price, currencyCode: cur },
            image: li.variant.image,
            selectedOptions: li.variant.selectedOptions,
            product: li.variant.product,
          }
        : null,
    }));
    return {
      id: o.id,
      orderNumber: parseOrderNumber(o.name),
      processedAt: o.createdAt,
      fulfillmentStatus: o.displayFulfillmentStatus as OrderFulfillmentStatus,
      financialStatus: o.displayFinancialStatus as OrderFinancialStatus,
      statusUrl: o.statusUrl,
      cancelReason: o.cancelReason,
      canceledAt: o.cancelledAt,
      totalPrice: o.totalPriceSet.shopMoney,
      subtotalPrice: o.subtotalPriceSet?.shopMoney ?? null,
      totalShippingPrice: o.totalShippingPriceSet?.shopMoney ?? null,
      totalTax: o.totalTaxSet?.shopMoney ?? null,
      shippingAddress: o.shippingAddress as OrderDetail["shippingAddress"],
      successfulFulfillments: o.fulfillments.map((f) => ({ trackingInfo: f.trackingInfo })),
      lineItems: { edges: items.map((item) => ({ node: item })) },
    };
  } catch {
    return null;
  }
}
