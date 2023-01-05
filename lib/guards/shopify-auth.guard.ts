import { createHmac } from 'crypto';
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
 * The guard is validating the HMAC for the GET request parameters received from Shopify
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

    const digest = createHmac('sha256', this.config.get('apiSecretKey'))
      .update(decodeURIComponent(new URLSearchParams(restQuery).toString()))
      .digest('hex');

    // The HMAC is valid if the digest matches the HMAC value
    if (hmac !== digest) {
      throw new HttpException(
        'HMAC validation failed',
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      return true;
    }
  }
}
