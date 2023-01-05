export interface ShopifyGuardsModuleOptions {
  apiSecretKey: string;
  headerHmac?: string;
  headerShopDomain?: string;
  headerRequestId?: string;
  headerApiVersion?: string;
  queryHmac?: string;
}
