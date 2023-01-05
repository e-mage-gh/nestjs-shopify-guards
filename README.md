# NestJS guards which support Shopify HMAC verification

This module implements Guards which verifies the HMAC signature of incoming requests from Shopify.

## Basic usage with all default

First import module and configure it with your app secret:
```typescript
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
```

Then use the guard in your controller:
```typescript
import { ShopifyAuthGuard } from '@e-mage/nestjs-shopify-guards';

@Controller()
@UseGuards(ShopifyAuthGuard)
export class AppController {
    @Get()
    getHello(): string {
        return 'Hello World!';
    }
}
```
