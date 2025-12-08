import { PuppeteerAgent } from './index';
import type { Cache, MidsceneYamlScriptWebEnv } from '@sqai/core';
import { type Browser } from 'puppeteer';
export declare const defaultUA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";
export declare const defaultViewportWidth = 1440;
export declare const defaultViewportHeight = 768;
export declare const defaultViewportScale: number;
export declare const defaultWaitForNetworkIdleTimeout = 2000;
interface FreeFn {
    name: string;
    fn: () => void;
}
export declare function launchPuppeteerPage(target: MidsceneYamlScriptWebEnv, preference?: {
    headed?: boolean;
    keepWindow?: boolean;
}, browser?: Browser): Promise<{
    page: import("puppeteer").Page;
    freeFn: FreeFn[];
}>;
export declare function puppeteerAgentForTarget(target: MidsceneYamlScriptWebEnv, preference?: {
    headed?: boolean;
    keepWindow?: boolean;
    testId?: string;
    cache?: Cache;
}, browser?: Browser): Promise<{
    agent: PuppeteerAgent;
    freeFn: FreeFn[];
}>;
export {};
