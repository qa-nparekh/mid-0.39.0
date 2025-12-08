import type { InfoListItem, PlaygroundResult } from '../types';
export declare const trackingTip = "limit popup to current tab";
export declare const deepThinkTip = "deep think";
export declare const screenshotIncludedTip = "include screenshot in request";
export declare const domIncludedTip = "include DOM info in request";
export declare const apiMetadata: {
    aiAction: {
        group: string;
        title: string;
    };
    aiTap: {
        group: string;
        title: string;
    };
    aiDoubleClick: {
        group: string;
        title: string;
    };
    aiHover: {
        group: string;
        title: string;
    };
    aiInput: {
        group: string;
        title: string;
    };
    aiRightClick: {
        group: string;
        title: string;
    };
    aiKeyboardPress: {
        group: string;
        title: string;
    };
    aiScroll: {
        group: string;
        title: string;
    };
    aiLocate: {
        group: string;
        title: string;
    };
    aiQuery: {
        group: string;
        title: string;
    };
    aiBoolean: {
        group: string;
        title: string;
    };
    aiNumber: {
        group: string;
        title: string;
    };
    aiString: {
        group: string;
        title: string;
    };
    aiAsk: {
        group: string;
        title: string;
    };
    aiAssert: {
        group: string;
        title: string;
    };
    aiWaitFor: {
        group: string;
        title: string;
    };
};
export declare const defaultMainButtons: string[];
export declare const WELCOME_MESSAGE_TEMPLATE: Omit<InfoListItem, 'id' | 'timestamp'>;
export declare const BLANK_RESULT: PlaygroundResult;
