export interface ShopifyGuardsModuleOptions {
  apiSecretKey: string;
  headerHmac?: string;
  queryHmac?: string;
  /**
   * Allowed age of the OAuth timestamp in seconds
   * defaults to 86400 (24 hours)
   */
  timestampLeewaySec?: number;
  /**
   * Optional regex to validate the `shop` query parameter
   * defaults to `/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/`
   */
  shopRegex?: RegExp;
}
