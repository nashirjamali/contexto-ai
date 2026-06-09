import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipRole } from '../common/enums/membership-role.enum';
import { OrganizationsService } from '../organizations/organizations.service';
import { UsersService } from '../users/users.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AddMemberDto, UpdateMemberDto } from './dto/member.dto';
import { Membership } from './entities/membership.entity';
import { Workspace } from './entities/workspace.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
    private organizationsService: OrganizationsService,
    private usersService: UsersService,
  ) {}

  findByUserId(userId: string): Promise<Workspace[]> {
    return this.workspacesRepository
      .createQueryBuilder('workspace')
      .innerJoin('workspace.memberships', 'membership')
      .where('membership.userId = :userId', { userId })
      .getMany();
  }

  findById(id: string): Promise<Workspace | null> {
    return this.workspacesRepository.findOne({ where: { id } });
  }

  findMembership(
    workspaceId: string,
    userId: string,
  ): Promise<Membership | null> {
    return this.membershipsRepository.findOne({
      where: { workspaceId, userId },
    });
  }

  async create(userId: string, dto: CreateWorkspaceDto): Promise<Workspace> {
    const organization = await this.organizationsService.create({
      name: dto.name,
    });

    const workspace = await this.workspacesRepository.save(
      this.workspacesRepository.create({
        organizationId: organization.id,
        name: dto.name,
      }),
    );

    await this.membershipsRepository.save(
      this.membershipsRepository.create({
        userId,
        workspaceId: workspace.id,
        role: MembershipRole.OWNER,
      }),
    );

    return workspace;
  }

  async addMember(
    workspaceId: string,
    dto: AddMemberDto,
  ): Promise<Membership> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.membershipsRepository.save(
      this.membershipsRepository.create({
        userId: user.id,
        workspaceId,
        role: dto.role,
      }),
    );
  }

  async updateMember(
    workspaceId: string,
    userId: string,
    dto: UpdateMemberDto,
  ): Promise<Membership> {
    const membership = await this.findMembership(workspaceId, userId);
    if (!membership) {
      throw new NotFoundException('Member not found');
    }

    membership.role = dto.role;
    return this.membershipsRepository.save(membership);
  }

  async removeMember(workspaceId: string, userId: string): Promise<void> {
    await this.membershipsRepository.delete({ workspaceId, userId });
  }

  async getOrganizationId(
    workspaceId: string,
    userId: string,
  ): Promise<string> {
    const membership = await this.findMembership(workspaceId, userId);
    if (!membership) {
      throw new NotFoundException('Workspace not found');
    }

    const workspace = await this.findById(workspaceId);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace.organizationId;
  }
}
