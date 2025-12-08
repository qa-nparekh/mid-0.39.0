import { Executor } from '../ai-model/action-executor';
import type { TMultimodalPrompt, TUserPrompt } from '../ai-model/common';
import type { AbstractInterface } from '../device';
import type Insight from '../insight';
import type { DetailedLocateParam, ExecutionTaskApply, ExecutionTaskProgressOptions, InsightExtractOption, InsightExtractParam, MidsceneYamlFlowItem, PlanningAction, PlanningActionParamWaitFor, PlanningLocateParam } from '../types';
import { type IModelConfig } from '@sqai/shared/env';
import type { TaskCache } from './task-cache';
interface ExecutionResult<OutputType = any> {
    output: OutputType;
    thought?: string;
    executor: Executor;
}
export declare function locatePlanForLocate(param: string | DetailedLocateParam): PlanningAction<PlanningLocateParam>;
export declare class TaskExecutor {
    interface: AbstractInterface;
    insight: Insight;
    taskCache?: TaskCache;
    private conversationHistory;
    onTaskStartCallback?: ExecutionTaskProgressOptions['onTaskStart'];
    replanningCycleLimit?: number;
    get page(): AbstractInterface;
    constructor(interfaceInstance: AbstractInterface, insight: Insight, opts: {
        taskCache?: TaskCache;
        onTaskStart?: ExecutionTaskProgressOptions['onTaskStart'];
        replanningCycleLimit?: number;
    });
    private recordScreenshot;
    private prependExecutorWithScreenshot;
    convertPlanToExecutable(plans: PlanningAction[], modelConfig: IModelConfig, cacheable?: boolean): Promise<{
        tasks: ExecutionTaskApply<any, any, any, any>[];
    }>;
    private setupPlanningContext;
    loadYamlFlowAsPlanning(userInstruction: string, yamlString: string): Promise<{
        executor: Executor;
    }>;
    private createPlanningTask;
    runPlans(title: string, plans: PlanningAction[], modelConfig: IModelConfig): Promise<ExecutionResult>;
    private getReplanningCycleLimit;
    action(userPrompt: string, modelConfig: IModelConfig, actionContext?: string, cacheable?: boolean): Promise<ExecutionResult<{
        yamlFlow?: MidsceneYamlFlowItem[];
    } | undefined>>;
    private createTypeQueryTask;
    createTypeQueryExecution<T>(type: 'Query' | 'Boolean' | 'Number' | 'String' | 'Assert', demand: InsightExtractParam, modelConfig: IModelConfig, opt?: InsightExtractOption, multimodalPrompt?: TMultimodalPrompt): Promise<ExecutionResult<T>>;
    private appendErrorPlan;
    taskForSleep(timeMs: number, modelConfig: IModelConfig): Promise<ExecutionTaskApply<any, any, any, any>>;
    waitFor(assertion: TUserPrompt, opt: PlanningActionParamWaitFor, modelConfig: IModelConfig): Promise<ExecutionResult<void>>;
}
export {};
