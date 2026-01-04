import { Agent } from "@sqaitech/core/agent";
import { getDebug } from "@sqaitech/shared/logger";
import { forceClosePopup } from "./base-page.mjs";
import { PuppeteerWebPage } from "./page.mjs";
import { overrideAIConfig } from "@sqaitech/shared/env";
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