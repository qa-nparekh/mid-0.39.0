import type { WebPageAgentOpt } from '../web-element';
import { Agent as PageAgent } from '@sqaitech/core/agent';
import type { Page as PuppeteerPage } from 'puppeteer';
import { PuppeteerWebPage } from './page';
export { PuppeteerWebPage } from './page';
export declare class PuppeteerAgent extends PageAgent<PuppeteerWebPage> {
    constructor(page: PuppeteerPage, opts?: WebPageAgentOpt);
}
export { overrideAIConfig } from '@sqaitech/shared/env';
