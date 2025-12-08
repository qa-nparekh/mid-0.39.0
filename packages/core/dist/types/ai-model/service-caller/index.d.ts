import { type AIUsageInfo } from '../../types';
import type { StreamingCallback } from '../../types';
import { type IModelConfig, type TVlModeTypes } from '@sqai/shared/env';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index';
import { AIActionType, type AIArgs } from '../common';
export declare function callAI(messages: ChatCompletionMessageParam[], AIActionTypeValue: AIActionType, modelConfig: IModelConfig, options?: {
    stream?: boolean;
    onChunk?: StreamingCallback;
}): Promise<{
    content: string;
    usage?: AIUsageInfo;
    isStreamed: boolean;
}>;
export declare const getResponseFormat: (modelName: string, AIActionTypeValue: AIActionType) => OpenAI.ChatCompletionCreateParams["response_format"] | OpenAI.ResponseFormatJSONObject;
export declare function callAIWithObjectResponse<T>(messages: ChatCompletionMessageParam[], AIActionTypeValue: AIActionType, modelConfig: IModelConfig): Promise<{
    content: T;
    usage?: AIUsageInfo;
}>;
export declare function callAIWithStringResponse(msgs: AIArgs, AIActionTypeValue: AIActionType, modelConfig: IModelConfig): Promise<{
    content: string;
    usage?: AIUsageInfo;
}>;
export declare function extractJSONFromCodeBlock(response: string): string;
export declare function preprocessDoubaoBboxJson(input: string): string;
export declare function safeParseJson(input: string, vlMode: TVlModeTypes | undefined): any;
