import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BillingModule } from './billing/billing.module';
import { ConversationsModule } from './conversations/conversations.module';
import { DatabaseModule } from './database/database.module';
import { DocumentsModule } from './documents/documents.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PublicLinksModule } from './public-links/public-links.module';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    WorkspacesModule,
    DocumentsModule,
    ConversationsModule,
    PublicLinksModule,
    BillingModule,
  ],
})
export class AppModule {}
