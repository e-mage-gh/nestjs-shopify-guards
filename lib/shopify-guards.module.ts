import { Module } from '@nestjs/common';
import { ConfigurableShopifyGuardsModule } from './shopify-guards.module-definition';
import { ShopifyAuthGuard } from './guards/shopify-auth.guard';
import { ConfigService } from './config-service';

@Module({
  providers: [ConfigService, ShopifyAuthGuard],
  exports: [ConfigService, ShopifyAuthGuard],
})
export class ShopifyGuardsModule extends ConfigurableShopifyGuardsModule {}
