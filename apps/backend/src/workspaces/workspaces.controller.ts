import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { MembershipRole } from '../common/enums/membership-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { WorkspaceMemberGuard } from '../common/guards/workspace-member.guard';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AddMemberDto, UpdateMemberDto } from './dto/member.dto';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.workspacesService.findByUserId(user.id);
  }

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateWorkspaceDto,
  ) {
    return this.workspacesService.create(user.id, dto);
  }

  @Get(':id')
  @UseGuards(WorkspaceMemberGuard)
  get(@Param('id') id: string) {
    return this.workspacesService.findById(id);
  }

  @Delete(':id')
  @UseGuards(WorkspaceMemberGuard, RolesGuard)
  @Roles(MembershipRole.OWNER)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.workspacesService.remove(id, user.id);
  }

  @Post(':id/members')
  @UseGuards(WorkspaceMemberGuard, RolesGuard)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.workspacesService.addMember(id, dto);
  }

  @Patch(':id/members/:userId')
  @UseGuards(WorkspaceMemberGuard, RolesGuard)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  updateMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.workspacesService.updateMember(id, userId, dto);
  }

  @Delete(':id/members/:userId')
  @UseGuards(WorkspaceMemberGuard, RolesGuard)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.workspacesService.removeMember(id, userId);
  }
}
