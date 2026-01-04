import { PlaywrightAgent, PlaywrightAiFixture } from "./playwright/index.mjs";
import { Agent } from "@sqaitech/core/agent";
import { PuppeteerAgent } from "./puppeteer/index.mjs";
import { StaticPage, StaticPageAgent } from "./static/index.mjs";
import { WebPageContextParser } from "./web-element.mjs";
export { Agent as PageAgent, PlaywrightAgent, PlaywrightAiFixture, PuppeteerAgent, StaticPage, StaticPageAgent, WebPageContextParser };
