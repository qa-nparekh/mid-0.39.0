import { type AgentAssertOpt, type AgentDescribeElementAtPointResult, type AgentOpt, type AgentWaitForOpt, type DeviceAction, type ExecutionDump, type GroupedActionDump, Insight, type InsightAction, type InsightExtractOption, type InsightExtractParam, type LocateOption, type LocateResultElement, type LocateValidatorResult, type LocatorValidatorOption, type OnTaskStartTip, type ScrollParam, type TUserPrompt, type UIContext } from '../index';
export type TestStatus = 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
import type { AbstractInterface } from '../device';
import { ModelConfigManager } from '@sqaitech/shared/env';
import { TaskCache } from './task-cache';
import { TaskExecutor } from './tasks';
export declare class Agent<InterfaceType extends AbstractInterface = AbstractInterface> {
    interface: InterfaceType;
    insight: Insight;
    dump: GroupedActionDump;
    reportFile?: string | null;
    reportFileName?: string;
    taskExecutor: TaskExecutor;
    opts: AgentOpt;
    /**
     * If true, the agent will not perform any actions
     */
    dryMode: boolean;
    onTaskStartTip?: OnTaskStartTip;
    taskCache?: TaskCache;
    onDumpUpdate?: (dump: string) => void;
    destroyed: boolean;
    modelConfigManager: ModelConfigManager;
    /**
     * Frozen page context for consistent AI operations
     */
    private frozenUIContext?;
    /**
     * Flag to track if VL model warning has been shown
     */
    private hasWarnedNonVLModel;
    /**
     * Screenshot scale factor derived from actual screenshot dimensions
     */
    private screenshotScale?;
    /**
     * Internal promise to deduplicate screenshot scale computation
     */
    private screenshotScalePromise?;
    get page(): InterfaceType;
    /**
     * Ensures VL model warning is shown once when needed
     */
    private ensureVLModelWarning;
    /**
     * Lazily compute the ratio between the physical screenshot width and the logical page width
     */
    private getScreenshotScale;
    constructor(interfaceInstance: InterfaceType, opts?: AgentOpt);
    getActionSpace(): Promise<DeviceAction[]>;
    getUIContext(action?: InsightAction): Promise<UIContext>;
    _snapshotContext(): Promise<UIContext>;
    setAIActionContext(prompt: string): Promise<void>;
    resetDump(): GroupedActionDump;
    appendExecutionDump(execution: ExecutionDump): void;
    dumpDataString(): string;
    reportHTMLString(): string;
    writeOutActionDumps(): void;
    private callbackOnTaskStartTip;
    private afterTaskRunning;
    callActionInActionSpace<T = any>(type: string, opt?: T): Promise<any>;
    aiTap(locatePrompt: TUserPrompt, opt?: LocateOption): Promise<any>;
    aiRightClick(locatePrompt: TUserPrompt, opt?: LocateOption): Promise<any>;
    aiDoubleClick(locatePrompt: TUserPrompt, opt?: LocateOption): Promise<any>;
    aiHover(locatePrompt: TUserPrompt, opt?: LocateOption): Promise<any>;
    aiInput(locatePrompt: TUserPrompt, opt: LocateOption & {
        value: string | number;
    } & {
        autoDismissKeyboard?: boolean;
    } & {
        mode?: 'replace' | 'clear' | 'append';
    }): Promise<any>;
    /**
     * @deprecated Use aiInput(locatePrompt, opt) instead where opt contains the value
     */
    aiInput(value: string | number, locatePrompt: TUserPrompt, opt?: LocateOption & {
        autoDismissKeyboard?: boolean;
    } & {
        mode?: 'replace' | 'clear' | 'append';
    }): Promise<any>;
    aiKeyboardPress(locatePrompt: TUserPrompt, opt: LocateOption & {
        keyName: string;
    }): Promise<any>;
    /**
     * @deprecated Use aiKeyboardPress(locatePrompt, opt) instead where opt contains the keyName
     */
    aiKeyboardPress(keyName: string, locatePrompt?: TUserPrompt, opt?: LocateOption): Promise<any>;
    aiScroll(locatePrompt: TUserPrompt | undefined, opt: LocateOption & ScrollParam): Promise<any>;
    /**
     * @deprecated Use aiScroll(locatePrompt, opt) instead where opt contains the scroll parameters
     */
    aiScroll(scrollParam: ScrollParam, locatePrompt?: TUserPrompt, opt?: LocateOption): Promise<any>;
    aiAction(taskPrompt: string, opt?: {
        cacheable?: boolean;
    }): Promise<{
        result: Record<string, any>;
    } | {
        yamlFlow?: import("../yaml").MidsceneYamlFlowItem[];
    } | undefined>;
    aiQuery<ReturnType = any>(demand: InsightExtractParam, opt?: InsightExtractOption): Promise<ReturnType>;
    aiBoolean(prompt: TUserPrompt, opt?: InsightExtractOption): Promise<boolean>;
    aiNumber(prompt: TUserPrompt, opt?: InsightExtractOption): Promise<number>;
    aiString(prompt: TUserPrompt, opt?: InsightExtractOption): Promise<string>;
    aiAsk(prompt: TUserPrompt, opt?: InsightExtractOption): Promise<string>;
    describeElementAtPoint(center: [number, number], opt?: {
        verifyPrompt?: boolean;
        retryLimit?: number;
        deepThink?: boolean;
    } & LocatorValidatorOption): Promise<AgentDescribeElementAtPointResult>;
    verifyLocator(prompt: string, locateOpt: LocateOption | undefined, expectCenter: [number, number], verifyLocateOption?: LocatorValidatorOption): Promise<LocateValidatorResult>;
    aiLocate(prompt: TUserPrompt, opt?: LocateOption): Promise<Pick<LocateResultElement, "center" | "rect"> & {
        dpr?: number;
    }>;
    aiAssert(assertion: TUserPrompt, msg?: string, opt?: AgentAssertOpt & InsightExtractOption): Promise<{
        pass: boolean;
        thought: string | undefined;
        message: string | undefined;
    } | undefined>;
    aiWaitFor(assertion: TUserPrompt, opt?: AgentWaitForOpt): Promise<void>;
    ai(taskPrompt: string, type?: string): Promise<any>;
    runYaml(yamlScriptContent: string): Promise<{
        result: Record<string, any>;
    }>;
    evaluateJavaScript(script: string): Promise<any>;
    destroy(): Promise<void>;
    logScreenshot(title?: string, opt?: {
        content: string;
    }): Promise<void>;
    _unstableLogContent(): {
        groupName: string;
        groupDescription: string | undefined;
        executions: any[];
    };
    /**
     * Freezes the current page context to be reused in subsequent AI operations
     * This avoids recalculating page context for each operation
     */
    freezePageContext(): Promise<void>;
    /**
     * Unfreezes the page context, allowing AI operations to calculate context dynamically
     */
    unfreezePageContext(): Promise<void>;
    /**
     * Process cache configuration and return normalized cache settings
     */
    private processCacheConfig;
    /**
     * Manually flush cache to file
     * @param options - Optional configuration
     * @param options.cleanUnused - If true, removes unused cache records before flushing
     */
    flushCache(options?: {
        cleanUnused?: boolean;
    }): Promise<void>;
}
export declare const createAgent: (interfaceInstance: AbstractInterface, opts?: AgentOpt) => Agent<AbstractInterface>;
