import type { TVlModeTypes } from '@sqaitech/shared/env';
import type { ResponseFormatJSONSchema } from 'openai/resources/index';
export declare function systemPromptToLocateElement(vlMode: TVlModeTypes | undefined): string;
export declare const locatorSchema: ResponseFormatJSONSchema;
export declare const findElementPrompt: ({ pageDescription, targetElementDescription, }: {
    pageDescription: string;
    targetElementDescription: string;
}) => string;
