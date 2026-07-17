declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: string;
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: string;
    JUDGEME_API_TOKEN: string;
    JUDGEME_SHOP_DOMAIN: string;
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    NEXT_PUBLIC_ENABLE_EDITOR: "true" | "false";
  }
}
