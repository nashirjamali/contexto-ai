import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { DocumentsService } from '../documents/documents.service';
import { RagQueryService } from '../rag/rag-query.service';
import { SendMessageDto } from '../conversations/dto/conversation.dto';
import {
  CreatePublicLinkDto,
  UpdatePublicLinkDto,
} from './dto/public-link.dto';
import { PublicLink } from './entities/public-link.entity';

@Injectable()
export class PublicLinksService {
  constructor(
    @InjectRepository(PublicLink)
    private publicLinksRepository: Repository<PublicLink>,
    private documentsService: DocumentsService,
    private ragQueryService: RagQueryService,
  ) {}

  async create(documentId: string, dto: CreatePublicLinkDto): Promise<PublicLink> {
    await this.documentsService.findById(documentId);

    return this.publicLinksRepository.save(
      this.publicLinksRepository.create({
        documentId,
        slug: randomBytes(8).toString('hex'),
        enabled: true,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      }),
    );
  }

  async update(id: string, dto: UpdatePublicLinkDto): Promise<PublicLink> {
    const link = await this.publicLinksRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException('Public link not found');
    }

    if (dto.enabled !== undefined) {
      link.enabled = dto.enabled;
    }
    if (dto.expiresAt !== undefined) {
      link.expiresAt = new Date(dto.expiresAt);
    }

    return this.publicLinksRepository.save(link);
  }

  async remove(id: string): Promise<void> {
    await this.publicLinksRepository.delete(id);
  }

  async getBySlug(slug: string) {
    const link = await this.findActiveLink(slug);
    const document = await this.documentsService.findById(link.documentId);

    return {
      slug: link.slug,
      document: {
        id: document.id,
        title: document.title,
      },
    };
  }

  async chat(slug: string, dto: SendMessageDto) {
    const link = await this.findActiveLink(slug);
    const document = await this.documentsService.findById(link.documentId);

    return this.ragQueryService.ask(
      document.workspaceId,
      dto.content,
      document.id,
    );
  }

  private async findActiveLink(slug: string): Promise<PublicLink> {
    const link = await this.publicLinksRepository.findOne({ where: { slug } });
    if (!link || !link.enabled) {
      throw new NotFoundException('Public link not found');
    }
    if (link.expiresAt && link.expiresAt < new Date()) {
      throw new NotFoundException('Public link expired');
    }
    return link;
  }
}
