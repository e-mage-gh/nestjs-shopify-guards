import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ShopifyGuardsModuleOptions } from './interfaces/shopify-guards-module-options.interface';

export const {
  ConfigurableModuleClass: ConfigurableShopifyGuardsModule,
  MODULE_OPTIONS_TOKEN: SHOPIFY_GUARDS_MODULE_OPTIONS,
} = new ConfigurableModuleBuilder<ShopifyGuardsModuleOptions>({
  moduleName: 'ShopifyGuards',
})
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();
