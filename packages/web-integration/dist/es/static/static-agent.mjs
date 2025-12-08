import { Agent } from "@sqai/core/agent";
class StaticPageAgent extends Agent {
    constructor(page){
        super(page, {});
        this.dryMode = true;
    }
}
export { StaticPageAgent };

//# sourceMappingURL=static-agent.mjs.map