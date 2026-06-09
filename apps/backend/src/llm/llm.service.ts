import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ChatCompletionResponse {
  choices: { message: { content: string } }[];
  usage?: { prompt_tokens: number; completion_tokens: number };
}

interface EmbeddingResponse {
  data: { embedding: number[] }[];
}

export interface ChatResult {
  content: string;
  promptTokens: number;
  completionTokens: number;
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private configService: ConfigService) {}

  async embed(text: string): Promise<number[]> {
    const data = await this.request<EmbeddingResponse>('/embeddings', {
      model: this.embeddingModel(),
      input: text,
    });

    return data.data[0].embedding;
  }

  async chat(systemPrompt: string, userPrompt: string): Promise<ChatResult> {
    const data = await this.request<ChatCompletionResponse>(
      '/chat/completions',
      {
        model: this.chatModel(),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      },
    );

    return {
      content: data.choices[0]?.message?.content ?? '',
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
    };
  }

  private baseUrl(): string {
    return (
      this.configService.get<string>('OPENROUTER_BASE_URL') ??
      'https://openrouter.ai/api/v1'
    );
  }

  private chatModel(): string {
    return (
      this.configService.get<string>('OPENROUTER_CHAT_MODEL') ??
      'openai/gpt-4o-mini'
    );
  }

  private embeddingModel(): string {
    return (
      this.configService.get<string>('OPENROUTER_EMBEDDING_MODEL') ??
      'openai/text-embedding-3-small'
    );
  }

  private headers(): Record<string, string> {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const appUrl =
      this.configService.get<string>('APP_URL') ??
      this.configService.get<string>('FRONTEND_URL');
    if (appUrl) {
      headers['HTTP-Referer'] = appUrl;
    }

    const appName = this.configService.get<string>('APP_NAME') ?? 'Contexto';
    headers['X-Title'] = appName;

    return headers;
  }

  private async request<T>(path: string, body: unknown): Promise<T> {
    const url = `${this.baseUrl()}${path}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      this.logger.error(`OpenRouter request failed: ${res.status} ${errorBody}`);
      throw new Error(`OpenRouter request failed: ${res.status}`);
    }

    return res.json() as Promise<T>;
  }
}
