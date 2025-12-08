import { Agent } from "@sqai/core/agent";
import { getDebug } from "@sqai/shared/logger";
import { forceClosePopup } from "./base-page.mjs";
import { PuppeteerWebPage } from "./page.mjs";
import { overrideAIConfig } from "@sqai/shared/env";
const debug = getDebug('puppeteer:agent');
class PuppeteerAgent extends Agent {
    constructor(page, opts){
        const webPage = new PuppeteerWebPage(page, opts);
        super(webPage, opts);
        const { forceSameTabNavigation = true } = opts ?? {};
        if (forceSameTabNavigation) forceClosePopup(page, debug);
    }
}
export { PuppeteerAgent, PuppeteerWebPage, overrideAIConfig };

//# sourceMappingURL=index.mjs.map