import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {}

  findById(id: string): Promise<Organization | null> {
    return this.organizationsRepository.findOne({ where: { id } });
  }

  create(data: Partial<Organization>): Promise<Organization> {
    const organization = this.organizationsRepository.create(data);
    return this.organizationsRepository.save(organization);
  }

  updatePlan(id: string, plan: Organization['plan']): Promise<void> {
    return this.organizationsRepository.update(id, { plan }).then(() => undefined);
  }

  updateStripeCustomerId(id: string, stripeCustomerId: string): Promise<void> {
    return this.organizationsRepository
      .update(id, { stripeCustomerId })
      .then(() => undefined);
  }
}
