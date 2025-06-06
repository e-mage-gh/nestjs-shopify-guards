import { Inject, Injectable } from '@nestjs/common';
import { ShopifyGuardsModuleOptions } from './interfaces/shopify-guards-module-options.interface';
import { SHOPIFY_GUARDS_MODULE_OPTIONS } from './shopify-guards.module-definition';

@Injectable()
export class ConfigService {
  /**
   * Default options
   */
  readonly options: ShopifyGuardsModuleOptions = {
    apiSecretKey: '',
    headerHmac: 'x-shopify-hmac-sha256',
    queryHmac: 'hmac',
    timestampLeewaySec: 60 * 60 * 24,
  };
  constructor(
    @Inject(SHOPIFY_GUARDS_MODULE_OPTIONS)
    readonly configOptions: ShopifyGuardsModuleOptions,
  ) {
    this.options = { ...this.options, ...configOptions };
  }

  /**
   * Config getter
   * @param key
   */
  get<K extends keyof ShopifyGuardsModuleOptions>(
    key: K,
  ): ShopifyGuardsModuleOptions[K] {
    return this.options[key];
  }
}
