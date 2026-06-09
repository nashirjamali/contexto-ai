import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreatePublicLinkDto {
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class UpdatePublicLinkDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
