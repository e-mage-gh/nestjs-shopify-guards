# NestJS guards for Shopify HMAC verification

This module implements Guards which verifies the HMAC signature of incoming requests from Shopify: 
* `ShopifyAuthGuard` - verifies the HMAC signature of incoming Auth requests from Shopify as described in the [Shopify documentation](https://shopify.dev/apps/auth/oauth/getting-started#step-2-verify-the-installation-request) and will throw an UnauthorizedException if it is invalid. It also checks that the provided `timestamp` parameter is recent to prevent replay attacks.
* `ShopifyWebhookGuard` - verifies the HMAC signature of incoming Webhook requests from Shopify as described in the [Shopify documentation](https://shopify.dev/apps/webhooks/getting-started#verify-webhook) and will throw an UnauthorizedException if it is invalid.

## Basic usage with all default

First install this module:
    
```bash
npm i -P @e-mage/nestjs-shopify-guards
```

Then import module into your Nestjs application and configure it with your app secret:
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

And use the guards in your controller:
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
## You can also use the guards with custom options 
You can change the default HMAC header name, the default HMAC query parameter name, or the allowed timestamp leeway:

```typescript
import { ShopifyGuardsModule } from '@e-mage/nestjs-shopify-guards';

@Module({
    imports: [
        ShopifyGuardsModule.register({
            apiSecretKey: 'my_client_secret',
            headerHmac: 'X-My-Shopify-Hmac-Sha256',
            queryHmac: 'my-hmac',
            timestampLeewaySec: 3600,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
```