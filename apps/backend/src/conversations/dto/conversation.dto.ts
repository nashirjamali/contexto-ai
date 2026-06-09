import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  workspaceId: string;

  @IsOptional()
  @IsUUID()
  documentId?: string;
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
