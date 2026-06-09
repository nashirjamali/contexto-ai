import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { documentUploadOptions } from './documents-upload.config';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { WorkspaceMemberGuard } from '../common/guards/workspace-member.guard';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('workspaces/:id/documents')
  @UseGuards(WorkspaceMemberGuard)
  @UseInterceptors(FileInterceptor('file', documentUploadOptions))
  upload(
    @Param('id') workspaceId: string,
    @CurrentUser() user: { id: string },
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
  ) {
    return this.documentsService.upload(workspaceId, user.id, file, dto);
  }

  @Get('workspaces/:id/documents')
  @UseGuards(WorkspaceMemberGuard)
  list(@Param('id') workspaceId: string) {
    return this.documentsService.findByWorkspace(workspaceId);
  }

  @Get('documents/:id')
  get(@Param('id') id: string) {
    return this.documentsService.findById(id);
  }

  @Delete('documents/:id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }

  @Get('documents/:id/status')
  status(@Param('id') id: string) {
    return this.documentsService.getStatus(id);
  }
}
