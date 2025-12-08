function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class BaseContextProvider {
    async refreshContext() {
        this.cachedContext = void 0;
        return await this.getUIContext();
    }
    constructor(){
        _define_property(this, "cachedContext", void 0);
    }
}
class AgentContextProvider extends BaseContextProvider {
    async getUIContext() {
        if (this.cachedContext) return this.cachedContext;
        const agent = this.getAgent();
        if (!(null == agent ? void 0 : agent.getUIContext)) throw new Error('Agent does not support getUIContext');
        const context = await agent.getUIContext();
        this.cachedContext = context;
        return context;
    }
    constructor(getAgent, options){
        super(), _define_property(this, "getAgent", void 0), _define_property(this, "options", void 0), this.getAgent = getAgent, this.options = options;
    }
}
class StaticContextProvider extends BaseContextProvider {
    async getUIContext() {
        return this.context;
    }
    async refreshContext() {
        return this.context;
    }
    constructor(context){
        super(), _define_property(this, "context", void 0), this.context = context;
    }
}
class NoOpContextProvider {
    async getUIContext() {
        throw new Error('Context preview is disabled');
    }
    async refreshContext() {
        throw new Error('Context preview is disabled');
    }
}
export { AgentContextProvider, BaseContextProvider, NoOpContextProvider, StaticContextProvider };
