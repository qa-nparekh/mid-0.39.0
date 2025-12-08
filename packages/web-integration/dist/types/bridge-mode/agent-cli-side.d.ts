import { Agent, type AgentOpt } from '@sqai/core/agent';
import { type BridgeConnectTabOptions } from './common';
import type { ExtensionBridgePageBrowserSide } from './page-browser-side';
interface ChromeExtensionPageCliSide extends ExtensionBridgePageBrowserSide {
    showStatusMessage: (message: string) => Promise<void>;
}
export declare const getBridgePageInCliSide: (timeout?: number | false, closeConflictServer?: boolean) => ChromeExtensionPageCliSide;
export declare class AgentOverChromeBridge extends Agent<ChromeExtensionPageCliSide> {
    private destroyAfterDisconnectFlag?;
    constructor(opts?: AgentOpt & {
        closeNewTabsAfterDisconnect?: boolean;
        serverListeningTimeout?: number | false;
        closeConflictServer?: boolean;
    });
    setDestroyOptionsAfterConnect(): Promise<void>;
    connectNewTabWithUrl(url: string, options?: BridgeConnectTabOptions): Promise<void>;
    getBrowserTabList(): Promise<{
        id: string;
        title: string;
        url: string;
        currentActiveTab: boolean;
    }[]>;
    setActiveTabId(tabId: string): Promise<void>;
    connectCurrentTab(options?: BridgeConnectTabOptions): Promise<void>;
    aiAction(prompt: string, options?: any): Promise<{
        result: Record<string, any>;
    } | {
        yamlFlow?: import("@sqai/core").MidsceneYamlFlowItem[];
    } | undefined>;
    destroy(closeNewTabsAfterDisconnect?: boolean): Promise<void>;
}
export {};
