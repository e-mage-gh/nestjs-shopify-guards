import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyAuthGuard } from './shopify-auth.guard';
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

describe('ShopifyHmacGuard', () => {
  let guard: ShopifyAuthGuard;
  let mockQueryHmac: string;
  let mockApiSecretKey: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'queryHmac') {
                return mockQueryHmac;
              }
              if (key === 'apiSecretKey') {
                return mockApiSecretKey;
              }
            }),
          },
        },
        ShopifyAuthGuard,
      ],
    }).compile();

    guard = module.get<ShopifyAuthGuard>(ShopifyAuthGuard);
    mockQueryHmac = 'hmac';
    mockApiSecretKey = 'apiSecret';
  });

  describe('canActivate', () => {
    it('should throw HttpException with status 401 if no apiSecretKey is given in configuration', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            method: 'GET',
            query: {
              hmac: 'test',
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

    it('should return HttpException with status 401 if no hmac parameter name given', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            method: 'GET',
            query: {
              hmac: 'test',
            },
          })),
        })),
      } as unknown as ExecutionContext;

      mockQueryHmac = undefined;

      try {
        guard.canActivate(context);
      } catch (e) {
        expect(e.status).toEqual(401);
        expect(e.message).toEqual('HMAC validation failed');
      }
    });

    it('should return HttpException with status 401 if no hmac parameter is present', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            method: 'GET',
            query: {
              test: 'test',
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

    it('should return HttpException with status 401 if hmac is not valid', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            method: 'GET',
            query: {
              hmac: 'test',
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

    it('should return true if hmac parameter is valid', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            method: 'GET',
            query: {
              hmac: 'digest',
            },
          })),
        })),
      } as unknown as ExecutionContext;

      const canActivate = guard.canActivate(context);

      expect(canActivate).toEqual(true);
    });

    it('should return true for method other than GET', () => {
      const context = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            method: 'POST',
          })),
        })),
      } as unknown as ExecutionContext;

      const canActivate = guard.canActivate(context);

      expect(canActivate).toEqual(true);
    });
  });
});
