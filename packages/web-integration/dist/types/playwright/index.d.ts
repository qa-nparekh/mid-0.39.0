import { Agent as PageAgent } from '@sqaitech/core/agent';
import type { Page as PlaywrightPage } from 'playwright';
import { WebPage as PlaywrightWebPage } from './page';
export type { PlayWrightAiFixtureType } from './ai-fixture';
export { PlaywrightAiFixture } from './ai-fixture';
export { overrideAIConfig } from '@sqaitech/shared/env';
export { WebPage as PlaywrightWebPage } from './page';
import type { WebPageAgentOpt } from '../web-element';
export declare class PlaywrightAgent extends PageAgent<PlaywrightWebPage> {
    constructor(page: PlaywrightPage, opts?: WebPageAgentOpt);
    waitForNetworkIdle(timeout?: number): Promise<void>;
}
