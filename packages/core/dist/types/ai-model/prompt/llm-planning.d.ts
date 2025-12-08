import type { DeviceAction } from '../../types';
import type { TVlModeTypes } from '@sqai/shared/env';
import type { ResponseFormatJSONSchema } from 'openai/resources/index';
export declare const descriptionForAction: (action: DeviceAction<any>, locatorSchemaTypeDescription: string) => string;
export declare function systemPromptToTaskPlanning({ actionSpace, vlMode, }: {
    actionSpace: DeviceAction<any>[];
    vlMode: TVlModeTypes | undefined;
}): Promise<string>;
export declare const planSchema: ResponseFormatJSONSchema;
