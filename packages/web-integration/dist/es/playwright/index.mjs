import { Agent } from "@sqaitech/core/agent";
import { WebPage } from "./page.mjs";
import { PlaywrightAiFixture } from "./ai-fixture.mjs";
import { overrideAIConfig } from "@sqaitech/shared/env";
import { getDebug } from "@sqaitech/shared/logger";
import { forceClosePopup } from "../puppeteer/base-page.mjs";
const debug = getDebug('playwright:agent');
class PlaywrightAgent extends Agent {
    async waitForNetworkIdle(timeout = 1000) {
        await this.page.underlyingPage.waitForLoadState('networkidle', {
            timeout
        });
    }
    constructor(page, opts){
        const webPage = new WebPage(page, opts);
        super(webPage, opts);
        const { forceSameTabNavigation = true } = opts ?? {};
        if (forceSameTabNavigation) forceClosePopup(page, debug);
    }
}
export { PlaywrightAgent, PlaywrightAiFixture, WebPage as PlaywrightWebPage, overrideAIConfig };

//# sourceMappingURL=index.mjs.map