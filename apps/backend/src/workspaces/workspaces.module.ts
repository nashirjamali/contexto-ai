import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMemberGuard } from '../common/guards/workspace-member.guard';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsersModule } from '../users/users.module';
import { Membership } from './entities/membership.entity';
import { Workspace } from './entities/workspace.entity';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace, Membership]),
    OrganizationsModule,
    UsersModule,
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspaceMemberGuard],
  exports: [WorkspacesService, WorkspaceMemberGuard],
})
export class WorkspacesModule {}
