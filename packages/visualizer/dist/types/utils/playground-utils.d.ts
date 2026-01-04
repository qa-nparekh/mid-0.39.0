import type { WebUIContext } from '@sqaitech/core';
import { StaticPageAgent } from '@sqaitech/web/static';
export declare const actionNameForType: (type: string) => string;
export declare const staticAgentFromContext: (context: WebUIContext) => StaticPageAgent;
export declare const getPlaceholderForType: (type: string) => string;
export declare const isRunButtonEnabled: (runButtonEnabled: boolean, needsStructuredParams: boolean, params: any, actionSpace: any[] | undefined, selectedType: string, promptValue: string) => boolean;
