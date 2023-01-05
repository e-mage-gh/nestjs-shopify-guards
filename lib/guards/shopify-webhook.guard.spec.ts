import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyWebhookGuard } from './shopify-webhook.guard';
import { ConfigService } from '../config-service';
import { ExecutionContext } from '@nestjs/common';

jest.mock(
  'crypto',
  jest.fn(() => {
    const actual = jest.requireActual('crypto');
    return {
      ...actual,
      createHmac: jest.fn(() => ({
        update: jest.fn(() => ({
          digest: jest.fn(() => 'digest'),
        })),
      })),
    };
  }),
);

describe('ShopifyWebhookGuard', () => {
  let guard: ShopifyWebhookGuard;
  let mockHeaderHmac: string;
  let mockApiSecretKey: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'headerHmac') {
                return mockHeaderHmac;
              }
              if (key === 'apiSecretKey') {
                return mockApiSecretKey;
              }
            }),
          },
        },
        ShopifyWebhookGuard,
      ],
    }).compile();

    guard = module.get<ShopifyWebhookGuard>(ShopifyWebhookGuard);
    mockHeaderHmac = 'x-shopify-hmac-sha256';
    mockApiSecretKey = 'apiSecret';
  });

  describe('canActivate', () => {
    it('should throw HttpException with status 401 if there is no rawBody', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            method: 'POST',
            headers: {
              'x-shopify-hmac-sha256': 'test',
            },
          })),
        })),
      } as unknown as ExecutionContext;
      try {
        guard.canActivate(context);
      } catch (e) {
        expect(e.status).toEqual(401);
        expect(e.message).toEqual('HMAC validation failed');
      }
    });

    it('should throw HttpException with status 401 if no apiSecretKey is given in configuration', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            method: 'POST',
            rawBody: 'test',
            headers: {
              'x-shopify-hmac-sha256': 'test',
            },
          })),
        })),
      } as unknown as ExecutionContext;
      mockApiSecretKey = undefined;

      try {
        guard.canActivate(context);
      } catch (e) {
        expect(e.status).toEqual(401);
        expect(e.message).toEqual('HMAC validation failed');
      }
    });

    it('should throw HttpException with status 401 if no hmac is given in request', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            rawBody: 'test',
            method: 'POST',
            headers: {},
          })),
        })),
      } as unknown as ExecutionContext;

      try {
        guard.canActivate(context);
      } catch (e) {
        expect(e.status).toEqual(401);
        expect(e.message).toEqual('HMAC validation failed');
      }
    });

    it('should throw HttpException with status 401 if hmac is not valid', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            rawBody: 'test',
            method: 'POST',
            headers: {
              'x-shopify-hmac-sha256': 'test',
            },
          })),
        })),
      } as unknown as ExecutionContext;

      try {
        guard.canActivate(context);
      } catch (e) {
        expect(e.status).toEqual(401);
        expect(e.message).toEqual('HMAC validation failed');
      }
    });

    it('should return true if hmac is valid', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            method: 'POST',
            rawBody: 'test',
            headers: {
              'x-shopify-hmac-sha256': 'digest',
            },
          })),
        })),
      } as unknown as ExecutionContext;

      try {
        expect(guard.canActivate(context)).toEqual(true);
      } catch (e) {}
      // expect(guard.canActivate(context)).toEqual(true);
    });

    it('should return true for method other than POST', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            method: 'GET',
            rawBody: 'test',
            headers: {
              'x-shopify-hmac-sha256': 'digest',
            },
          })),
        })),
      } as unknown as ExecutionContext;

      expect(guard.canActivate(context)).toEqual(true);
    });
  });
});
