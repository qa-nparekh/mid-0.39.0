import { callAIWithObjectResponse } from '../ai-model/index';
import type { AIDescribeElementResponse, AIUsageInfo, BaseElement, DetailedLocateParam, DumpSubscriber, InsightAction, InsightExtractOption, InsightExtractParam, InsightTaskInfo, LocateResult, Rect, UIContext } from '../types';
import { type IModelConfig } from '@sqai/shared/env';
import type { TMultimodalPrompt } from '../ai-model/common';
export interface LocateOpts {
    context?: UIContext<BaseElement>;
}
export type AnyValue<T> = {
    [K in keyof T]: unknown extends T[K] ? any : T[K];
};
interface InsightOptions {
    taskInfo?: Omit<InsightTaskInfo, 'durationMs'>;
    aiVendorFn?: typeof callAIWithObjectResponse;
}
export default class Insight<ElementType extends BaseElement = BaseElement, ContextType extends UIContext<ElementType> = UIContext<ElementType>> {
    contextRetrieverFn: (action: InsightAction) => Promise<ContextType> | ContextType;
    aiVendorFn: Exclude<InsightOptions['aiVendorFn'], undefined>;
    onceDumpUpdatedFn?: DumpSubscriber;
    taskInfo?: Omit<InsightTaskInfo, 'durationMs'>;
    constructor(context: ContextType | ((action: InsightAction) => Promise<ContextType> | ContextType), opt?: InsightOptions);
    locate(query: DetailedLocateParam, opt: LocateOpts, modelConfig: IModelConfig): Promise<LocateResult>;
    extract<T>(dataDemand: InsightExtractParam, modelConfig: IModelConfig, opt?: InsightExtractOption, multimodalPrompt?: TMultimodalPrompt): Promise<{
        data: T;
        thought?: string;
        usage?: AIUsageInfo;
    }>;
    describe(target: Rect | [number, number], modelConfig: IModelConfig, opt?: {
        deepThink?: boolean;
    }): Promise<Pick<AIDescribeElementResponse, 'description'>>;
}
export {};
