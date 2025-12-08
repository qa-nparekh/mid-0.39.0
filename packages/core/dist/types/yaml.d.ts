import type { TUserPrompt } from './ai-model/common';
import type { AgentOpt, Rect } from './types';
import type { BaseElement, UIContext } from './types';
export interface LocateOption {
    prompt?: TUserPrompt;
    deepThink?: boolean;
    cacheable?: boolean;
    xpath?: string;
    uiContext?: UIContext<BaseElement>;
}
export interface InsightExtractOption {
    domIncluded?: boolean | 'visible-only';
    screenshotIncluded?: boolean;
    doNotThrowError?: boolean;
}
export interface ReferenceImage {
    base64: string;
    rect?: Rect;
}
export interface DetailedLocateParam extends LocateOption {
    prompt: TUserPrompt;
    referenceImage?: ReferenceImage;
}
export interface ScrollParam {
    direction: 'down' | 'up' | 'right' | 'left';
    scrollType: 'once' | 'untilBottom' | 'untilTop' | 'untilRight' | 'untilLeft';
    distance?: null | number;
}
export interface MidsceneYamlScript {
    target?: MidsceneYamlScriptWebEnv;
    web?: MidsceneYamlScriptWebEnv;
    android?: MidsceneYamlScriptAndroidEnv;
    ios?: MidsceneYamlScriptIOSEnv;
    interface?: MidsceneYamlScriptEnvGeneralInterface;
    config?: MidsceneYamlScriptConfig;
    agent?: MidsceneYamlScriptAgentOpt;
    tasks: MidsceneYamlTask[];
}
export interface MidsceneYamlTask {
    name: string;
    flow: MidsceneYamlFlowItem[];
    continueOnError?: boolean;
}
export type MidsceneYamlScriptAgentOpt = Pick<AgentOpt, 'aiActionContext' | 'cache'>;
export interface MidsceneYamlScriptConfig {
    output?: string;
    unstableLogContent?: boolean | string;
}
export interface MidsceneYamlScriptEnvGeneralInterface {
    module: string;
    export?: string;
    param?: Record<string, any>;
}
export interface MidsceneYamlScriptWebEnv extends MidsceneYamlScriptConfig, MidsceneYamlScriptAgentOpt {
    serve?: string;
    url: string;
    userAgent?: string;
    acceptInsecureCerts?: boolean;
    viewportWidth?: number;
    viewportHeight?: number;
    viewportScale?: number;
    waitForNetworkIdle?: {
        timeout?: number;
        continueOnNetworkIdleError?: boolean;
    };
    cookie?: string;
    forceSameTabNavigation?: boolean;
    bridgeMode?: false | 'newTabWithUrl' | 'currentTab';
    closeNewTabsAfterDisconnect?: boolean;
}
export interface MidsceneYamlScriptAndroidEnv extends MidsceneYamlScriptConfig {
    deviceId?: string;
    launch?: string;
}
export interface MidsceneYamlScriptIOSEnv extends MidsceneYamlScriptConfig {
    wdaPort?: number;
    wdaHost?: string;
    autoDismissKeyboard?: boolean;
    launch?: string;
}
export type MidsceneYamlScriptEnv = MidsceneYamlScriptWebEnv | MidsceneYamlScriptAndroidEnv | MidsceneYamlScriptIOSEnv;
export interface MidsceneYamlFlowItemAIAction {
    ai?: string;
    aiAction?: string;
    aiActionProgressTips?: string[];
    cacheable?: boolean;
}
export interface MidsceneYamlFlowItemAIAssert {
    aiAssert: string;
    errorMessage?: string;
    name?: string;
}
export interface MidsceneYamlFlowItemAIQuery extends InsightExtractOption {
    aiQuery: string;
    name?: string;
}
export interface MidsceneYamlFlowItemAINumber extends InsightExtractOption {
    aiNumber: string;
    name?: string;
}
export interface MidsceneYamlFlowItemAIString extends InsightExtractOption {
    aiString: string;
    name?: string;
}
export interface MidsceneYamlFlowItemAIAsk extends InsightExtractOption {
    aiAsk: string;
    name?: string;
}
export interface MidsceneYamlFlowItemAIBoolean extends InsightExtractOption {
    aiBoolean: string;
    name?: string;
}
export interface MidsceneYamlFlowItemAILocate extends LocateOption {
    aiLocate: string;
    name?: string;
}
export interface MidsceneYamlFlowItemAIWaitFor {
    aiWaitFor: string;
    timeout?: number;
}
export interface MidsceneYamlFlowItemEvaluateJavaScript {
    javascript: string;
    name?: string;
}
export interface MidsceneYamlFlowItemSleep {
    sleep: number;
}
export interface MidsceneYamlFlowItemLogScreenshot {
    logScreenshot?: string;
    content?: string;
}
export type MidsceneYamlFlowItem = MidsceneYamlFlowItemAIAction | MidsceneYamlFlowItemAIAssert | MidsceneYamlFlowItemAIQuery | MidsceneYamlFlowItemAIWaitFor | MidsceneYamlFlowItemSleep | MidsceneYamlFlowItemLogScreenshot;
export interface FreeFn {
    name: string;
    fn: () => void;
}
export interface ScriptPlayerTaskStatus extends MidsceneYamlTask {
    status: ScriptPlayerStatusValue;
    currentStep?: number;
    totalSteps: number;
    error?: Error;
}
export type ScriptPlayerStatusValue = 'init' | 'running' | 'done' | 'error';
export interface MidsceneYamlConfig {
    concurrent?: number;
    continueOnError?: boolean;
    summary?: string;
    shareBrowserContext?: boolean;
    web?: MidsceneYamlScriptWebEnv;
    android?: MidsceneYamlScriptAndroidEnv;
    ios?: MidsceneYamlScriptIOSEnv;
    files: string[];
    headed?: boolean;
    keepWindow?: boolean;
    dotenvOverride?: boolean;
    dotenvDebug?: boolean;
}
export interface MidsceneYamlConfigOutput {
    format?: 'json';
    path?: string;
}
export interface MidsceneYamlConfigResult {
    file: string;
    success: boolean;
    executed: boolean;
    output?: string | null;
    report?: string | null;
    error?: string;
    duration?: number;
    /**
     * Type of result:
     * - 'success': All tasks completed successfully
     * - 'failed': Execution failed (player error)
     * - 'partialFailed': Some tasks failed but execution continued (continueOnError)
     * - 'notExecuted': Not executed due to previous failures
     */
    resultType?: 'success' | 'failed' | 'partialFailed' | 'notExecuted';
}
