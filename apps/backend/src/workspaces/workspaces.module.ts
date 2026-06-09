import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMemberGuard } from '../common/guards/workspace-member.guard';
import { DocumentsModule } from '../documents/documents.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsageRecord } from '../billing/entities/usage-record.entity';
import { Document } from '../documents/entities/document.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { Message } from '../conversations/entities/message.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { UsersModule } from '../users/users.module';
import { Membership } from './entities/membership.entity';
import { Workspace } from './entities/workspace.entity';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workspace,
      Membership,
      Organization,
      UsageRecord,
      Conversation,
      Message,
      Document,
    ]),
    OrganizationsModule,
    UsersModule,
    forwardRef(() => DocumentsModule),
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspaceMemberGuard],
  exports: [WorkspacesService, WorkspaceMemberGuard],
})
export class WorkspacesModule {}
