import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config-service';
import { SHOPIFY_GUARDS_MODULE_OPTIONS } from './shopify-guards.module-definition';

describe('ConfigService', () => {
  let configService: ConfigService;

  describe('get', () => {
    describe('without passed config options', () => {
      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            {
              provide: SHOPIFY_GUARDS_MODULE_OPTIONS,
              useValue: {
                apiSecretKey: undefined,
              },
            },
            ConfigService,
          ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
      });

      it('should return empty apiSecret', () => {
        expect(configService.get('apiSecretKey')).toEqual(undefined);
      });

      it('should return the defaults', () => {
        expect(configService.get('headerHmac')).toEqual(
          'x-shopify-hmac-sha256',
        );
        expect(configService.get('queryHmac')).toEqual('hmac');
      });
    });

    describe('with passed config options', () => {
      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            {
              provide: SHOPIFY_GUARDS_MODULE_OPTIONS,
              useValue: {
                apiSecretKey: 'apiSecretKey',
                headerHmac: 'headerHmac',
                queryHmac: 'queryHmac',
              },
            },
            ConfigService,
          ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
      });

      it('should return given apiSecret', () => {
        expect(configService.get('apiSecretKey')).toEqual('apiSecretKey');
      });

      it('should return given values', () => {
        expect(configService.get('headerHmac')).toEqual('headerHmac');
        expect(configService.get('queryHmac')).toEqual('queryHmac');
      });
    });
  });
});
