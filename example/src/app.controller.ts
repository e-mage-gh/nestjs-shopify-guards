import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ShopifyAuthGuard,
  ShopifyWebhookGuard,
} from '@e-mage/nestjs-shopify-guards';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(ShopifyAuthGuard)
  @Get('/auth')
  getHello(): string {
    return this.appService.getHello();
  }
  @UseGuards(ShopifyWebhookGuard)
  @Post('/webhook')
  postHello(): string {
    return this.appService.getHello();
  }
}
