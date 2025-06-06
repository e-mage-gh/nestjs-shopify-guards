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
 * The guard verifies the HMAC signature of incoming GET auth requests from Shopify
 * and will throw an UnauthorizedException if it is invalid
 *
 * @see https://shopify.dev/apps/auth/oauth/getting-started#step-2-verify-the-installation-request
 */
@Injectable()
export class ShopifyAuthGuard implements CanActivate {
  constructor(
    @Inject(ConfigService)
    private config: ConfigService,
  ) {}

  /**
   * HMAC Guard body
   * @param context
   */
  canActivate(context: ExecutionContext): boolean {
    const { query, method } = context.switchToHttp().getRequest();

    // Allow all non-GET requests
    if (method !== 'GET') {
      return true;
    }

    // The HMAC cannot be validated without both
    // the app secret and the HMAC query/parameter variable name
    if (!this.config.get('apiSecretKey') || !this.config.get('queryHmac')) {
      throw new HttpException(
        'HMAC validation failed',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { [this.config.get('queryHmac')]: hmac, ...restQuery } = query;
    // The HMAC cannot be validated without HMAC value
    if (!hmac) {
      throw new HttpException(
        'HMAC validation failed',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const params = new URLSearchParams(restQuery as Record<string, string>);
    params.sort();
    const digest = createHmac('sha256', this.config.get('apiSecretKey'))
      .update(decodeURIComponent(params.toString()))
      .digest('hex');

    const isValid =
      typeof hmac === 'string' &&
      hmac.length === digest.length &&
      timingSafeEqual(Buffer.from(hmac), Buffer.from(digest));

    // timestamp validation as recommended by Shopify
    const timestamp = parseInt(query.timestamp as string, 10);
    const leeway = this.config.get('timestampLeewaySec') ?? 0;
    const now = Date.now() / 1000;
    const isTimestampValid =
      !timestamp ||
      (Number.isFinite(timestamp) && now - timestamp <= Number(leeway));

    if (!isValid) {
      throw new HttpException(
        'HMAC validation failed',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!isTimestampValid) {
      throw new HttpException(
        'HMAC timestamp expired',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
