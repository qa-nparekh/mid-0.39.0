import type { PlanningAIResponse, Size, UIContext } from '../types';
import { type IModelConfig, UITarsModelVersion } from '@sqaitech/shared/env';
import type { ConversationHistory } from './conversation-history';
type ActionType = 'click' | 'drag' | 'type' | 'hotkey' | 'finished' | 'scroll' | 'wait';
export declare function uiTarsPlanning(userInstruction: string, options: {
    conversationHistory: ConversationHistory;
    context: UIContext;
    modelConfig: IModelConfig;
}): Promise<PlanningAIResponse>;
interface BaseAction {
    action_type: ActionType;
    action_inputs: Record<string, any>;
    reflection: string | null;
    thought: string | null;
}
interface ClickAction extends BaseAction {
    action_type: 'click';
    action_inputs: {
        start_box: string;
    };
}
interface DragAction extends BaseAction {
    action_type: 'drag';
    action_inputs: {
        start_box: string;
        end_box: string;
    };
}
interface WaitAction extends BaseAction {
    action_type: 'wait';
    action_inputs: {
        time: string;
    };
}
interface TypeAction extends BaseAction {
    action_type: 'type';
    action_inputs: {
        content: string;
    };
}
interface HotkeyAction extends BaseAction {
    action_type: 'hotkey';
    action_inputs: {
        key: string;
    };
}
interface ScrollAction extends BaseAction {
    action_type: 'scroll';
    action_inputs: {
        direction: 'up' | 'down';
    };
}
interface FinishedAction extends BaseAction {
    action_type: 'finished';
    action_inputs: Record<string, never>;
}
export type Action = ClickAction | DragAction | TypeAction | HotkeyAction | ScrollAction | FinishedAction | WaitAction;
export declare function resizeImageForUiTars(imageBase64: string, size: Size, uiTarsVersion: UITarsModelVersion | undefined): Promise<string>;
export {};
