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
var _computedKey;
_computedKey = Symbol.iterator;
let _computedKey1 = _computedKey;
class ConversationHistory {
    append(message) {
        if ('user' === message.role) this.pruneOldestUserMessageIfNecessary();
        this.messages.push(message);
    }
    seed(messages) {
        this.reset();
        messages.forEach((message)=>{
            this.append(message);
        });
    }
    reset() {
        this.messages.length = 0;
    }
    snapshot() {
        return [
            ...this.messages
        ];
    }
    get length() {
        return this.messages.length;
    }
    [_computedKey1]() {
        return this.messages[Symbol.iterator]();
    }
    toJSON() {
        return this.snapshot();
    }
    pruneOldestUserMessageIfNecessary() {
        const userMessages = this.messages.filter((item)=>'user' === item.role);
        if (userMessages.length < this.maxUserImageMessages) return;
        const firstUserMessageIndex = this.messages.findIndex((item)=>'user' === item.role);
        if (firstUserMessageIndex >= 0) this.messages.splice(firstUserMessageIndex, 1);
    }
    constructor(options){
        var _options_initialMessages;
        _define_property(this, "maxUserImageMessages", void 0);
        _define_property(this, "messages", []);
        this.maxUserImageMessages = (null == options ? void 0 : options.maxUserImageMessages) ?? 4;
        if (null == options ? void 0 : null == (_options_initialMessages = options.initialMessages) ? void 0 : _options_initialMessages.length) this.seed(options.initialMessages);
    }
}
export { ConversationHistory };

//# sourceMappingURL=conversation-history.mjs.map