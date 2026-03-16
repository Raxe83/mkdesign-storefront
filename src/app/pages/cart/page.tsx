"use client";

import { useState } from "react";
import { ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Loader } from "../../components/Loader";
import { primaryColor } from "@/app/global";

const CartPage = () => {
  const { cart, isLoading, removeItem, updateItemQuantityFunction } = useCart();
  const [t] = useTranslation();

  if (isLoading) {
    return (
      <Loader />
    );
  }

  const isEmpty = !cart || cart.lines.edges.length === 0;

  const handleIncreaseQuantity = (itemId: string, currentQuantity: number) => {
    updateItemQuantityFunction(itemId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateItemQuantityFunction(itemId, currentQuantity - 1);
    }
  };

  const subtotal =
    !isEmpty && cart?.estimatedCost?.subtotalAmount?.amount
      ? parseFloat(cart.estimatedCost.subtotalAmount.amount)
      : 0;

  const currencyCode =
    !isEmpty && cart?.estimatedCost?.totalAmount?.currencyCode
      ? cart.estimatedCost.totalAmount.currencyCode
      : "EUR";

  const total = subtotal;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("cart.header")}</h1>

      {isEmpty ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-4">{t("cart.empty")}</h2>
          <p className="text-gray-500 mb-6">{t("cart.addProducts")}</p>
          <Link
            href="/pages/products"
            className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors"
          >
            {t("product.discoverProducts")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-300">
                <h2 className="text-lg font-medium">{t("cart.articles")}</h2>
              </div>

              <div className="divide-y">
                {cart?.lines?.edges?.map(({ node }) => (
                  <div key={node.id} className="p-6 flex items-center">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-300 mr-4">
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

                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900">
                        {node.merchandise.product.title}
                      </h3>
                      {node.merchandise.title !== "Default Title" && (
                        <p className="mt-1 text-sm text-gray-500">
                          {node.merchandise.title}
                        </p>
                      )}
                      <div className="mt-1 text-sm text-gray-500 flex items-center">
                        <span className="px-4">{node.quantity}</span>
                        {node.attributes.map((attribute) => (
                          <div key={attribute.key}>
                            {attribute.key}: {attribute.value}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-medium text-gray-900">
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
                        className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
                        onClick={() => {
                          removeItem(node.id);
                        }}
                      >
                        <Trash2 size={14} className="mr-1" />
                        {t("common.delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="border border-gray-300 rounded-lg overflow-hidden sticky top-8">
              <div className="p-6 bg-gray-50 border-b border-gray-300">
                <h2 className="text-lg font-medium">{t("cart.summary")}</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cart.subtotal")}</span>
                  <span>
                    {!isEmpty && cart?.estimatedCost?.subtotalAmount?.amount ? (
                      formatPrice(
                        cart.estimatedCost.subtotalAmount.amount,
                        cart.estimatedCost.subtotalAmount.currencyCode
                      )
                    ) : (
                      <span>0,00 €</span>
                    )}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <h3 className="text-gray-600 mb-3 flex items-center">
                    <Truck size={18} className="mr-2" />
                    {t("cart.shippingCost")}
                  </h3>
                </div>

                <div className="flex justify-between font-medium text-lg pt-4 border-t border-gray-300">
                  <span>{t("cart.total")}</span>
                  <span>{formatPrice(total.toString(), currencyCode)}</span>
                </div>

                {cart?.checkoutUrl && (
                  <a
                    href={cart.checkoutUrl}
                    rel="noopener noreferrer"
                    className={`block w-full bg-${primaryColor} text-white text-center px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors`}
                  >
                    {t("cart.checkout")}
                  </a>
                )}

                {/* <Link
                  to="/products"
                  className="block w-full text-center px-6 py-3 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  {t("cart.buyMore")}
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
