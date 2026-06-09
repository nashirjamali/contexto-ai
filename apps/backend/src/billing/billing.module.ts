import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from '../organizations/organizations.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { UsageRecord } from './entities/usage-record.entity';
import { StripeWebhookService } from './stripe-webhook.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsageRecord]),
    OrganizationsModule,
    WorkspacesModule,
  ],
  controllers: [BillingController],
  providers: [BillingService, StripeWebhookService],
  exports: [BillingService],
})
export class BillingModule {}
