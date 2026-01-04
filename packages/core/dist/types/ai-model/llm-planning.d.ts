import type { DeviceAction, InterfaceType, PlanningAIResponse, UIContext } from '../types';
import type { IModelConfig } from '@sqaitech/shared/env';
import type { ConversationHistory } from './conversation-history';
export declare function plan(userInstruction: string, opts: {
    context: UIContext;
    interfaceType: InterfaceType;
    actionSpace: DeviceAction<any>[];
    actionContext?: string;
    modelConfig: IModelConfig;
    conversationHistory?: ConversationHistory;
}): Promise<PlanningAIResponse>;
