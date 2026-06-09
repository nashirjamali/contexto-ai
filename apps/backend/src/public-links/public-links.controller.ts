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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SendMessageDto } from '../conversations/dto/conversation.dto';
import {
  CreatePublicLinkDto,
  UpdatePublicLinkDto,
} from './dto/public-link.dto';
import { PublicLinksService } from './public-links.service';

@Controller()
export class PublicLinksController {
  constructor(private publicLinksService: PublicLinksService) {}

  @Post('documents/:id/public-link')
  @UseGuards(JwtAuthGuard)
  create(@Param('id') documentId: string, @Body() dto: CreatePublicLinkDto) {
    return this.publicLinksService.create(documentId, dto);
  }

  @Patch('public-links/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdatePublicLinkDto) {
    return this.publicLinksService.update(id, dto);
  }

  @Delete('public-links/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.publicLinksService.remove(id);
  }

  @Get('public/:slug')
  get(@Param('slug') slug: string) {
    return this.publicLinksService.getBySlug(slug);
  }

  @Post('public/:slug/messages')
  chat(@Param('slug') slug: string, @Body() dto: SendMessageDto) {
    return this.publicLinksService.chat(slug, dto);
  }
}
