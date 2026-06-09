import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RagQueryService } from '../rag/rag-query.service';
import { CreateConversationDto, SendMessageDto } from './dto/conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private ragQueryService: RagQueryService,
  ) {}

  create(userId: string, dto: CreateConversationDto): Promise<Conversation> {
    return this.conversationsRepository.save(
      this.conversationsRepository.create({
        workspaceId: dto.workspaceId,
        documentId: dto.documentId,
        createdBy: userId,
      }),
    );
  }

  async findById(id: string): Promise<Conversation> {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  listMessages(conversationId: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(conversationId: string, dto: SendMessageDto) {
    const conversation = await this.findById(conversationId);

    await this.messagesRepository.save(
      this.messagesRepository.create({
        conversationId,
        role: 'user',
        content: dto.content,
      }),
    );

    const answer = await this.ragQueryService.ask(
      conversation.workspaceId,
      dto.content,
      conversation.documentId,
    );

    const assistantMessage = await this.messagesRepository.save(
      this.messagesRepository.create({
        conversationId,
        role: 'assistant',
        content: answer.content,
        citations: answer.citations,
        tokenUsage: answer.tokenUsage,
      }),
    );

    return assistantMessage;
  }
}
