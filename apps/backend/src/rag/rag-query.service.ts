import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { VectorSearchService } from '../vector/vector-search.service';

export interface Citation {
  documentId: string;
  chunkIndex: number;
  content: string;
  score: number;
}

export interface RagAnswer {
  content: string;
  citations: Citation[];
  tokenUsage: { prompt: number; completion: number };
}

@Injectable()
export class RagQueryService {
  constructor(
    private llmService: LlmService,
    private vectorSearchService: VectorSearchService,
  ) {}

  async ask(
    workspaceId: string,
    question: string,
    documentId?: string,
  ): Promise<RagAnswer> {
    const queryVector = await this.llmService.embed(question);
    const citations = await this.vectorSearchService.search(
      workspaceId,
      queryVector,
      5,
      documentId,
    );

    if (citations.length === 0) {
      return {
        content:
          'I could not find relevant information in the uploaded document(s). Make sure the document finished processing and try again.',
        citations: [],
        tokenUsage: { prompt: 0, completion: 0 },
      };
    }

    const context = citations
      .map((c, i) => `[${i + 1}] ${c.content}`)
      .join('\n\n');

    const systemPrompt =
      'You are a helpful assistant. Answer the question using ONLY the provided context. If the context does not contain the answer, say so. Reference sources by number when citing.';
    const userPrompt = `Context:\n${context}\n\nQuestion: ${question}`;
    const answer = await this.llmService.chat(systemPrompt, userPrompt);

    return {
      content: answer.content,
      citations,
      tokenUsage: {
        prompt: answer.promptTokens,
        completion: answer.completionTokens,
      },
    };
  }

}
