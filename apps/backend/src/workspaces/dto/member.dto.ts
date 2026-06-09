import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { MembershipRole } from '../../common/enums/membership-role.enum';

export class AddMemberDto {
  @IsEmail()
  email: string;

  @IsEnum(MembershipRole)
  role: MembershipRole;
}

export class UpdateMemberDto {
  @IsEnum(MembershipRole)
  @IsNotEmpty()
  role: MembershipRole;
}
