import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BillingService } from './billing.service';
import { BillingWorkspaceDto, CreateCheckoutDto } from './dto/billing.dto';
import { StripeWebhookService } from './stripe-webhook.service';

@Controller('billing')
export class BillingController {
  constructor(
    private billingService: BillingService,
    private stripeWebhookService: StripeWebhookService,
  ) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.billingService.createCheckoutSession(user.id, dto);
  }

  @Post('portal')
  @UseGuards(JwtAuthGuard)
  portal(
    @CurrentUser() user: { id: string },
    @Body() dto: BillingWorkspaceDto,
  ) {
    return this.billingService.createPortalSession(user.id, dto.workspaceId);
  }

  @Get('usage')
  @UseGuards(JwtAuthGuard)
  usage(
    @CurrentUser() user: { id: string },
    @Query('workspaceId') workspaceId: string,
  ) {
    if (!workspaceId) {
      throw new BadRequestException('workspaceId is required');
    }
    return this.billingService.getUsage(workspaceId, user.id);
  }

  @Post('webhook')
  webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.stripeWebhookService.handleEvent(req.rawBody as Buffer, signature);
  }
}
