"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.d = (exports1, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.r = (exports1)=>{
        if ('undefined' != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
    useServerValid: ()=>useServerValid
});
const playground_namespaceObject = require("@sqai/playground");
const external_react_namespaceObject = require("react");
const store_js_namespaceObject = require("../store/store.js");
const useServerValid = function() {
    let shouldRun = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : true;
    const [serverValid, setServerValid] = (0, external_react_namespaceObject.useState)(true);
    const { serviceMode } = (0, store_js_namespaceObject.useEnvConfig)();
    (0, external_react_namespaceObject.useEffect)(()=>{
        let interruptFlag = false;
        if (!shouldRun) return;
        Promise.resolve((async ()=>{
            while(!interruptFlag){
                const playgroundSDK = new playground_namespaceObject.PlaygroundSDK({
                    type: 'remote-execution'
                });
                const status = await playgroundSDK.checkStatus();
                status ? setServerValid(true) : setServerValid(false);
                await new Promise((resolve)=>setTimeout(resolve, 1000));
            }
        })());
        return ()=>{
            interruptFlag = true;
        };
    }, [
        serviceMode,
        shouldRun
    ]);
    return serverValid;
};
exports.useServerValid = __webpack_exports__.useServerValid;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "useServerValid"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
