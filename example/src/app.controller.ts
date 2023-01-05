import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ShopifyAuthGuard } from '@e-mage/nestjs-shopify-guards';

@Controller()
@UseGuards(ShopifyAuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  postHello(): string {
    return this.appService.getHello();
  }
}
