import type { AIDataExtractionResponse, AIElementLocatorResponse, AIElementResponse, AIUsageInfo, BaseElement, ElementById, InsightExtractOption, Rect, ReferenceImage, UIContext } from '../types';
import type { IModelConfig } from '@sqai/shared/env';
import type { ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from 'openai/resources/index';
import type { TMultimodalPrompt, TUserPrompt } from './common';
import { callAIWithObjectResponse } from './service-caller/index';
export type AIArgs = [
    ChatCompletionSystemMessageParam,
    ...ChatCompletionUserMessageParam[]
];
export declare function AiLocateElement<ElementType extends BaseElement = BaseElement>(options: {
    context: UIContext<ElementType>;
    targetElementDescription: TUserPrompt;
    referenceImage?: ReferenceImage;
    callAIFn: typeof callAIWithObjectResponse<AIElementResponse | [number, number]>;
    searchConfig?: Awaited<ReturnType<typeof AiLocateSection>>;
    modelConfig: IModelConfig;
}): Promise<{
    parseResult: AIElementLocatorResponse;
    rect?: Rect;
    rawResponse: string;
    elementById: ElementById;
    usage?: AIUsageInfo;
    isOrderSensitive?: boolean;
}>;
export declare function AiLocateSection(options: {
    context: UIContext<BaseElement>;
    sectionDescription: TUserPrompt;
    modelConfig: IModelConfig;
}): Promise<{
    rect?: Rect;
    imageBase64?: string;
    error?: string;
    rawResponse: string;
    usage?: AIUsageInfo;
}>;
export declare function AiExtractElementInfo<T, ElementType extends BaseElement = BaseElement>(options: {
    dataQuery: string | Record<string, string>;
    multimodalPrompt?: TMultimodalPrompt;
    context: UIContext<ElementType>;
    extractOption?: InsightExtractOption;
    modelConfig: IModelConfig;
}): Promise<{
    parseResult: AIDataExtractionResponse<T>;
    elementById: (idOrIndexId: string) => ElementType;
    usage: AIUsageInfo | undefined;
}>;
