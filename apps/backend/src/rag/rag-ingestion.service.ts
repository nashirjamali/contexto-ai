import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFile } from 'fs/promises';
import { PDFParse } from 'pdf-parse';
import { extname } from 'path';
import { Repository } from 'typeorm';
import { DocumentStatus } from '../common/enums/document-status.enum';
import { Document } from '../documents/entities/document.entity';
import { LlmService } from '../llm/llm.service';
import { VectorSearchService } from '../vector/vector-search.service';

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

@Injectable()
export class RagIngestionService {
  private readonly logger = new Logger(RagIngestionService.name);

  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    private llmService: LlmService,
    private vectorSearchService: VectorSearchService,
  ) {}

  enqueue(documentId: string): void {
    this.process(documentId).catch((err) => {
      this.logger.error(`Ingestion failed for ${documentId}`, err);
    });
  }

  async process(documentId: string): Promise<void> {
    const document = await this.documentsRepository.findOne({
      where: { id: documentId },
    });
    if (!document) {
      return;
    }

    try {
      await this.documentsRepository.update(documentId, {
        status: DocumentStatus.PROCESSING,
      });

      const pages = await this.parse(document);
      const chunks = this.chunk(pages);

      if (chunks.length === 0) {
        throw new Error('No text content extracted from document');
      }

      const embedded = await this.embed(chunks);
      await this.index(document, embedded);

      await this.documentsRepository.update(documentId, {
        status: DocumentStatus.READY,
        pageCount: pages.length,
      });
    } catch (err) {
      this.logger.error(`Document ${documentId} ingestion failed`, err);
      await this.documentsRepository.update(documentId, {
        status: DocumentStatus.FAILED,
      });
    }
  }

  private async parse(document: Document): Promise<string[]> {
    const buffer = await readFile(document.fileUrl);
    const ext = extname(document.fileUrl).toLowerCase();

    if (ext === '.pdf') {
      const parser = new PDFParse({ data: buffer });
      try {
        const result = await parser.getText();
        const text = result.text?.trim();
        if (!text) return [];
        return result.pages.length > 0
          ? result.pages.map((p) => p.text.trim()).filter(Boolean)
          : [text];
      } finally {
        await parser.destroy();
      }
    }

    const text = buffer.toString('utf-8').trim();
    return text ? [text] : [];
  }

  private chunk(
    pages: string[],
  ): { content: string; tokenCount: number }[] {
    const text = pages.join('\n\n').trim();
    if (!text) return [];

    const chunks: { content: string; tokenCount: number }[] = [];
    let start = 0;

    while (start < text.length) {
      const content = text.slice(start, start + CHUNK_SIZE).trim();
      if (content) {
        chunks.push({
          content,
          tokenCount: Math.ceil(content.length / 4),
        });
      }
      if (start + CHUNK_SIZE >= text.length) break;
      start += CHUNK_SIZE - CHUNK_OVERLAP;
    }

    return chunks;
  }

  private async embed(
    chunks: { content: string; tokenCount: number }[],
  ): Promise<{ content: string; tokenCount: number; vector: number[] }[]> {
    const embedded: {
      content: string;
      tokenCount: number;
      vector: number[];
    }[] = [];

    for (const chunk of chunks) {
      const vector = await this.llmService.embed(chunk.content);
      embedded.push({ ...chunk, vector });
    }

    return embedded;
  }

  private async index(
    document: Document,
    chunks: { content: string; tokenCount: number; vector: number[] }[],
  ): Promise<void> {
    await this.vectorSearchService.saveChunks(
      document.id,
      chunks.map((chunk, index) => ({
        chunkIndex: index,
        content: chunk.content,
        tokenCount: chunk.tokenCount,
        vector: chunk.vector,
      })),
    );
  }
}
