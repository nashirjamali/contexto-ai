import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkspacesService } from '../../workspaces/workspaces.service';

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(private workspacesService: WorkspacesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const workspaceId = request.params.id ?? request.params.workspaceId;
    const userId = request.user?.id;

    const membership = await this.workspacesService.findMembership(
      workspaceId,
      userId,
    );

    if (!membership) {
      throw new NotFoundException('Workspace not found');
    }

    request.membership = membership;
    return true;
  }
}
