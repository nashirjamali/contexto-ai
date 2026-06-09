import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto, SendMessageDto } from './dto/conversation.dto';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversationsService.create(user.id, dto);
  }

  @Post(':id/messages')
  sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.conversationsService.sendMessage(id, dto);
  }

  @Get(':id/messages')
  listMessages(@Param('id') id: string) {
    return this.conversationsService.listMessages(id);
  }
}
