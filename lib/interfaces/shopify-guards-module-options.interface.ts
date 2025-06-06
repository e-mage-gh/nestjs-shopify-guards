export interface ShopifyGuardsModuleOptions {
  apiSecretKey: string;
  headerHmac?: string;
  queryHmac?: string;
  /**
   * Allowed age of the OAuth timestamp in seconds
   * defaults to 86400 (24 hours)
   */
  timestampLeewaySec?: number;
}
