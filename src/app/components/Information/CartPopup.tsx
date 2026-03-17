"use client";

import { ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";
import { Loader } from "../Loader";

const CartPopup = () => {
  const {
    cart,
    isLoading,
    removeItem,
    updateItemQuantityFunction,
    showCartPopup,
    setShowCartPopup,
  } = useCart();
  const [t] = useTranslation();

  if (!showCartPopup) return null;

  if (isLoading) {
    return (
      <Loader />
    );
  }

  const isEmpty = !cart || cart.lines.edges.length === 0;

  const subtotal =
    !isEmpty && cart?.estimatedCost?.subtotalAmount?.amount
      ? Number.parseFloat(cart.estimatedCost.subtotalAmount.amount)
      : 0;

  const currencyCode =
    !isEmpty && cart?.estimatedCost?.totalAmount?.currencyCode
      ? cart.estimatedCost.totalAmount.currencyCode
      : "EUR";

  const total = subtotal;

  return (
    <div className="absolute top-16 right-8 mt-2 max-w-xl bg-white rounded-md shadow-lg z-50 p-4">
      <div className="p-3 border-b  border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-sm">{t("cart.header")}</h3>
        <button
          onClick={() => setShowCartPopup(false)}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
          aria-label="Schließen"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isEmpty ? (
        <div className="p-4 text-center">
          <ShoppingBag className="h-6 w-6 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">{t("cart.empty")}</p>
        </div>
      ) : (
        <>
          <div className="max-h-64 overflow-auto">
            {cart?.lines?.edges?.map(({ node }) => (
              <div
                key={node.id}
                className="p-3 border-b border-gray-200 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    {node.merchandise.product.featuredImage ? (
                      <img
                        src={
                          node.merchandise.product.featuredImage.url ||
                          "/placeholder.svg"
                        }
                        alt={
                          node.merchandise.product.featuredImage.altText ||
                          node.merchandise.product.title
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <span className="text-xs text-gray-500">
                          {t("common.noImg")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {node.merchandise.product.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("cart.amoun")}: {node.quantity}
                    </p>
                    <div className="text-xs text-gray-500">
                      {(node.attributes ?? []).map((attribute, idx) => (
                        <div key={idx}>
                          {attribute.key}: {attribute.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatPrice(
                      (
                        Number.parseFloat(
                          node.merchandise.price?.amount ?? "0"
                        ) * node.quantity
                      ).toString(),
                      node.merchandise.price?.currencyCode ?? "EUR"
                    )}
                  </p>
                  <button
                    className="text-red-600 hover:text-red-800 text-xs flex items-center mt-1"
                    onClick={() => {
                      removeItem(node.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    <span>{t("common.delete")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                {t("cart.subtotal")}
              </span>
              <span className="text-sm font-medium">
                {formatPrice(
                  cart?.estimatedCost?.subtotalAmount?.amount || "0",
                  cart?.estimatedCost?.subtotalAmount?.currencyCode || "EUR"
                )}
              </span>
            </div>

            <div className="text-xs text-gray-500 flex items-center mb-3">
              <Truck className="h-3 w-3 mr-1" />
              <span>{t("cart.shippingCost")}</span>
            </div>

            <div className="space-y-2">
              {cart?.checkoutUrl && (
                <a
                  href={cart.checkoutUrl}
                  rel="noopener noreferrer"
                  className="block w-full bg-accent text-white text-center px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {t("cart.checkout")}
                </a>
              )}

              <button
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setShowCartPopup(false)}
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPopup;
