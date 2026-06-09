import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plan } from '../common/enums/plan.enum';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class StripeWebhookService {
  constructor(
    private configService: ConfigService,
    private organizationsService: OrganizationsService,
  ) {}

  handleEvent(payload: Buffer, signature: string): Promise<void> {
    void this.configService;
    void payload;
    void signature;
    return Promise.resolve();
  }

  private async onCheckoutCompleted(organizationId: string, plan: Plan) {
    await this.organizationsService.updatePlan(organizationId, plan);
  }

  private async onSubscriptionUpdated(
    organizationId: string,
    plan: Plan,
  ): Promise<void> {
    await this.organizationsService.updatePlan(organizationId, plan);
  }

  private async onSubscriptionDeleted(organizationId: string): Promise<void> {
    await this.organizationsService.updatePlan(organizationId, Plan.FREE);
  }
}
