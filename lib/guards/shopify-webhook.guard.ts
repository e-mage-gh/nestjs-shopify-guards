import { createHmac, timingSafeEqual } from 'crypto';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import { ConfigService } from '../config-service';

/**
 * The guard verifies the HMAC signature of incoming POST Webhook requests from Shopify
 * and will throw an UnauthorizedException if it is invalid
 *
 * @see https://shopify.dev/apps/webhooks/configuration/https#step-5-verify-the-webhook
 */
@Injectable()
export class ShopifyWebhookGuard implements CanActivate {
  constructor(
    @Inject(ConfigService)
    private config: ConfigService,
  ) {}

  /**
   * HMAC Guard body
   * @param context
   */
  canActivate(context: ExecutionContext): boolean {
    const { headers, method, rawBody } = context.switchToHttp().getRequest();

    // Allow all non-POST requests
    if (method !== 'POST') {
      return true;
    }

    // The HMAC cannot be validated without rawBody
    if (!rawBody) {
      throw new HttpException(
        'HMAC validation failed',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // The HMAC cannot be validated without both
    // the app secret and the HMAC header name
    if (!this.config.get('apiSecretKey') || !this.config.get('headerHmac')) {
      throw new HttpException(
        'HMAC validation failed',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { [this.config.get('headerHmac')]: hmac } = headers;
    // The HMAC cannot be validated without HMAC value
    if (!hmac) {
      throw new HttpException(
        'HMAC validation failed',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const digest = createHmac('sha256', this.config.get('apiSecretKey'))
      .update(rawBody)
      .digest('base64');

    const isValid =
      typeof hmac === 'string' &&
      hmac.length === digest.length &&
      timingSafeEqual(Buffer.from(hmac), Buffer.from(digest));

    if (!isValid) {
      throw new HttpException(
        'HMAC validation failed',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
