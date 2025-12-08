import { Page } from "../puppeteer/base-page.mjs";
class WebPage extends Page {
    constructor(page, opts){
        super(page, 'playwright', opts);
    }
}
export { WebPage };

//# sourceMappingURL=page.mjs.map