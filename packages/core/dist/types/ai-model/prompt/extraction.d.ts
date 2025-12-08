import type { ResponseFormatJSONSchema } from 'openai/resources/index';
export declare function systemPromptToExtract(): string;
export declare const extractDataQueryPrompt: (pageDescription: string, dataQuery: string | Record<string, string>) => string;
export declare const extractDataSchema: ResponseFormatJSONSchema;
