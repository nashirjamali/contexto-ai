import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsageType } from '../common/enums/usage-type.enum';
import { OrganizationsService } from '../organizations/organizations.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { CreateCheckoutDto } from './dto/billing.dto';
import { UsageRecord } from './entities/usage-record.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(UsageRecord)
    private usageRecordsRepository: Repository<UsageRecord>,
    private organizationsService: OrganizationsService,
    private workspacesService: WorkspacesService,
    private configService: ConfigService,
  ) {}

  createCheckoutSession(userId: string, dto: CreateCheckoutDto) {
    void this.configService;
    void userId;
    void dto;
    return { url: '' };
  }

  async createPortalSession(userId: string, workspaceId: string) {
    void this.configService;
    void userId;
    void workspaceId;
    return { url: '' };
  }

  async getUsage(workspaceId: string, userId: string) {
    const organizationId = await this.workspacesService.getOrganizationId(
      workspaceId,
      userId,
    );
    const organization = await this.organizationsService.findById(organizationId);
    const records = await this.usageRecordsRepository.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });

    return {
      organizationId,
      plan: organization?.plan ?? 'free',
      records,
    };
  }

  recordUsage(
    organizationId: string,
    type: UsageType,
    quantity: number,
    metadata?: Record<string, unknown>,
  ): Promise<UsageRecord> {
    return this.usageRecordsRepository.save(
      this.usageRecordsRepository.create({
        organizationId,
        type,
        quantity,
        metadata,
      }),
    );
  }

  checkQuota(organizationId: string, type: UsageType): Promise<boolean> {
    void this.organizationsService;
    void organizationId;
    void type;
    return Promise.resolve(true);
  }
}
