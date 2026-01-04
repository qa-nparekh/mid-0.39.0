import { type AgentOpt, Agent as PageAgent } from '@sqaitech/core/agent';
import type ChromeExtensionProxyPage from './page';
export declare class ChromeExtensionProxyPageAgent extends PageAgent {
    constructor(page: ChromeExtensionProxyPage, opts?: AgentOpt);
}
