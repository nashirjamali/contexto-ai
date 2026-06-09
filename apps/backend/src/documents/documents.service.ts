import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'fs/promises';
import { Repository } from 'typeorm';
import { Conversation } from '../conversations/entities/conversation.entity';
import { Message } from '../conversations/entities/message.entity';
import { DocumentStatus } from '../common/enums/document-status.enum';
import { PublicLink } from '../public-links/entities/public-link.entity';
import { RagIngestionService } from '../rag/rag-ingestion.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { DocumentChunk } from './entities/document-chunk.entity';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(DocumentChunk)
    private chunksRepository: Repository<DocumentChunk>,
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(PublicLink)
    private publicLinksRepository: Repository<PublicLink>,
    private ragIngestionService: RagIngestionService,
  ) {}

  findByWorkspace(workspaceId: string): Promise<Document[]> {
    return this.documentsRepository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Document> {
    const document = await this.documentsRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async upload(
    workspaceId: string,
    userId: string,
    file: Express.Multer.File | undefined,
    dto: UploadDocumentDto,
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const document = await this.documentsRepository.save(
      this.documentsRepository.create({
        workspaceId,
        uploadedBy: userId,
        title: dto.title,
        fileUrl: file.path,
        fileSize: file.size,
        status: DocumentStatus.UPLOADING,
      }),
    );

    this.ragIngestionService.enqueue(document.id);
    return document;
  }

  async remove(id: string): Promise<void> {
    const document = await this.findById(id);

    const conversations = await this.conversationsRepository.find({
      where: { documentId: id },
    });

    for (const conversation of conversations) {
      await this.messagesRepository.delete({ conversationId: conversation.id });
    }
    await this.conversationsRepository.delete({ documentId: id });
    await this.publicLinksRepository.delete({ documentId: id });

    await this.chunksRepository.delete({ documentId: id });

    try {
      await unlink(document.fileUrl);
    } catch {
      // file may already be missing
    }

    await this.documentsRepository.delete(id);
  }

  async getStatus(id: string) {
    const document = await this.findById(id);
    return {
      id: document.id,
      status: document.status,
      pageCount: document.pageCount,
    };
  }
}
