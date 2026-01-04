import type { DeviceAction, UIContext } from '@sqaitech/core';
import type { ComponentType } from 'react';
export interface ZodType {
    _def?: {
        typeName: 'ZodOptional' | 'ZodDefault' | 'ZodNullable' | 'ZodObject' | 'ZodEnum' | 'ZodNumber' | 'ZodString' | 'ZodBoolean';
        innerType?: ZodType;
        defaultValue?: () => unknown;
        shape?: () => Record<string, ZodType>;
        values?: string[];
        description?: string;
    };
    description?: string;
}
export interface ZodObjectSchema extends ZodType {
    shape: Record<string, ZodType>;
    parse: (data: unknown) => unknown;
}
export interface ZodEnumSchema extends ZodType {
    _def: {
        typeName: 'ZodEnum';
        values: string[];
    };
}
export interface ZodNumberSchema extends ZodType {
    _def: {
        typeName: 'ZodNumber';
    };
}
export interface ZodBooleanSchema extends ZodType {
    _def: {
        typeName: 'ZodBoolean';
    };
}
export interface ZodRuntimeAccess extends ZodType {
    shape?: Record<string, ZodType>;
    description?: string;
    typeName?: string;
    type?: string;
}
export interface ActionSpaceItem extends Omit<DeviceAction<any>, 'paramSchema'> {
    paramSchema?: ZodObjectSchema;
}
export interface FormParams {
    [key: string]: string | number | boolean | null | undefined;
}
export declare const VALIDATION_CONSTANTS: {
    readonly ZOD_TYPES: {
        readonly OPTIONAL: "ZodOptional";
        readonly DEFAULT: "ZodDefault";
        readonly NULLABLE: "ZodNullable";
        readonly OBJECT: "ZodObject";
        readonly ENUM: "ZodEnum";
        readonly NUMBER: "ZodNumber";
        readonly STRING: "ZodString";
        readonly BOOLEAN: "ZodBoolean";
    };
    readonly FIELD_FLAGS: {
        readonly LOCATION: "midscene_location_field_flag";
    };
    readonly DEFAULT_VALUES: {
        readonly ACTION_TYPE: "aiAction";
        readonly TIMEOUT_MS: 15000;
        readonly CHECK_INTERVAL_MS: 3000;
    };
};
export declare const isZodObjectSchema: (schema: unknown) => schema is ZodObjectSchema;
export declare const isLocateField: (field: ZodType) => boolean;
export declare const unwrapZodType: (field: ZodType) => {
    actualField: ZodType;
    isOptional: boolean;
    hasDefault: boolean;
};
export declare const extractDefaultValue: (field: ZodType) => unknown;
import type { GroupedActionDump, WebUIContext } from '@sqaitech/core';
import type { ExecutionOptions, PlaygroundAgent } from '@sqaitech/playground';
export interface PlaygroundResult {
    result: any;
    dump?: GroupedActionDump | null;
    reportHTML?: string | null;
    error: string | null;
}
export interface PlaygroundProps {
    getAgent: (forceSameTabNavigation?: boolean) => PlaygroundAgent | null;
    hideLogo?: boolean;
    showContextPreview?: boolean;
    dryMode?: boolean;
}
export interface StaticPlaygroundProps {
    context: WebUIContext | null;
}
export type ServiceModeType = 'Server' | 'In-Browser' | 'In-Browser-Extension';
export type RunType = 'aiAction' | 'aiQuery' | 'aiAssert' | 'aiTap' | 'aiDoubleClick' | 'aiHover' | 'aiInput' | 'aiRightClick' | 'aiKeyboardPress' | 'aiScroll' | 'aiLocate' | 'aiBoolean' | 'aiNumber' | 'aiString' | 'aiAsk' | 'aiWaitFor';
export interface ReplayScriptsInfo {
    scripts: any[];
    width?: number;
    height?: number;
    sdkVersion?: string;
    modelBriefs: string[];
}
export interface FormValue {
    type: string;
    prompt?: string;
    params?: Record<string, unknown>;
}
export type { ExecutionOptions };
export type ProgressCallback = (step: string, status?: 'loading' | 'completed' | 'error') => void;
export interface PlaygroundSDKLike {
    executeAction(actionType: string, value: FormValue, options: ExecutionOptions): Promise<unknown>;
    getActionSpace(context?: any): Promise<DeviceAction<unknown>[]>;
    onProgressUpdate?: (callback: ProgressCallback) => void;
    cancelExecution?(requestId: string): Promise<void>;
    overrideConfig?(config: any): Promise<void>;
    checkStatus?(): Promise<boolean>;
    id?: string;
}
export interface StorageProvider {
    saveMessages?(messages: InfoListItem[]): Promise<void>;
    loadMessages?(): Promise<InfoListItem[]>;
    clearMessages?(): Promise<void>;
    saveResult?(id: string, result: InfoListItem): Promise<void>;
}
export interface ContextProvider {
    getUIContext?(): Promise<UIContext>;
    refreshContext?(): Promise<UIContext>;
}
export interface InfoListItem {
    id: string;
    type: 'user' | 'system' | 'result' | 'progress' | 'separator';
    content: string;
    timestamp: Date;
    result?: PlaygroundResult | null;
    loading?: boolean;
    replayScriptsInfo?: ReplayScriptsInfo | null;
    replayCounter?: number;
    loadingProgressText?: string;
    verticalMode?: boolean;
}
export interface UniversalPlaygroundConfig {
    showContextPreview?: boolean;
    storageNamespace?: string;
    layout?: 'vertical' | 'horizontal';
    showVersionInfo?: boolean;
    enableScrollToBottom?: boolean;
    serverMode?: boolean;
    showEnvConfigReminder?: boolean;
}
export interface PlaygroundBranding {
    title?: string;
    icon?: ComponentType<any>;
    version?: string;
}
export interface UniversalPlaygroundProps {
    playgroundSDK: PlaygroundSDKLike | null;
    storage?: StorageProvider;
    contextProvider?: ContextProvider;
    config?: UniversalPlaygroundConfig;
    branding?: PlaygroundBranding;
    className?: string;
    dryMode?: boolean;
    showContextPreview?: boolean;
}
