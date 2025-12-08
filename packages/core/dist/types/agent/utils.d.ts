import type { TMultimodalPrompt, TUserPrompt } from '../ai-model/common';
import type { AbstractInterface } from '../device';
import type { BaseElement, ElementCacheFeature, ElementTreeNode, ExecutionDump, ExecutorContext, LocateResultElement, PlanningLocateParam, UIContext } from '../types';
import type { TaskExecutor } from './tasks';
export declare function commonContextParser(interfaceInstance: AbstractInterface, _opt: {
    uploadServerUrl?: string;
}): Promise<UIContext>;
export declare function getReportFileName(tag?: string): string;
export declare function printReportMsg(filepath: string): void;
/**
 * Get the current execution file name
 * @returns The name of the current execution file
 */
export declare function getCurrentExecutionFile(trace?: string): string | false;
export declare function generateCacheId(fileName?: string): string;
export declare function matchElementFromPlan(planLocateParam: PlanningLocateParam, tree: ElementTreeNode<BaseElement>): any;
export declare function matchElementFromCache(taskExecutor: TaskExecutor, cacheEntry: ElementCacheFeature | undefined, cachePrompt: TUserPrompt, cacheable: boolean | undefined): Promise<LocateResultElement | undefined>;
export declare function trimContextByViewport(execution: ExecutionDump): {
    tasks: {
        type: any;
        subType?: string;
        param?: any;
        thought?: string;
        locate?: PlanningLocateParam | null;
        uiContext?: UIContext;
        executor: (param: any, context: ExecutorContext) => void | Promise<void | import("../types").ExecutionTaskReturn<any, any> | undefined> | undefined;
        output?: any;
        log?: any;
        recorder?: import("../types").ExecutionRecorderItem[];
        hitBy?: import("../types").ExecutionTaskHitBy;
        status: "pending" | "running" | "finished" | "failed" | "cancelled";
        error?: Error;
        errorMessage?: string;
        errorStack?: string;
        timing?: {
            start: number;
            end?: number;
            cost?: number;
        };
        usage?: import("../types").AIUsageInfo;
        searchAreaUsage?: import("../types").AIUsageInfo;
    }[];
    name: string;
    description?: string;
    aiActionContext?: string;
    logTime: number;
};
export declare const getMidsceneVersion: () => string;
export declare const parsePrompt: (prompt: TUserPrompt) => {
    textPrompt: string;
    multimodalPrompt?: TMultimodalPrompt;
};
