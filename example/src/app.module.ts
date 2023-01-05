import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopifyGuardsModule } from '@e-mage/nestjs-shopify-guards';

@Module({
  imports: [
    ShopifyGuardsModule.register({
      apiSecretKey: 'my_client_secret',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
