# NestJS guards which support Shopify HMAC verification

This module implements Guards which verifies the HMAC signature of incoming requests from Shopify: 
* `ShopifyAuthGuard` - verifies the HMAC signature of incoming auth requests from Shopify as described in the [Shopify documentation](https://shopify.dev/apps/auth/oauth/getting-started#step-2-verify-the-installation-request) and will throw an UnauthorizedException if it is invalid.
* `ShopifyWebhookGuard` - verifies the HMAC signature of incoming webhook requests from Shopify as described in the [Shopify documentation](https://shopify.dev/apps/webhooks/getting-started#verify-webhook) and will throw an UnauthorizedException if it is invalid.

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
import { ShopifyAuthGuard, ShopifyWebhookGuard } from '@e-mage/nestjs-shopify-guards';

@Controller()
@UseGuards(ShopifyAuthGuard)
export class AppController {

    // Guard will verify the HMAC signature of the request
    // and will throw an UnauthorizedException if it is invalid
    @UseGuards(ShopifyAuthGuard)
    @Get('/auth')
    getHello(): string {
      return this.appService.getHello();
    }
    
    // Guard will verify the HMAC signature of the request
    // and will throw an UnauthorizedException if it is invalid
    @UseGuards(ShopifyWebhookGuard)
    @Post('/webhook')
    postHello(): string {
      return this.appService.getHello();
    }
}
```
