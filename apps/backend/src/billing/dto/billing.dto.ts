import { IsEnum, IsUUID } from 'class-validator';
import { Plan } from '../../common/enums/plan.enum';

export class CreateCheckoutDto {
  @IsEnum(Plan)
  plan: Plan;

  @IsUUID()
  workspaceId: string;
}

export class BillingWorkspaceDto {
  @IsUUID()
  workspaceId: string;
}
