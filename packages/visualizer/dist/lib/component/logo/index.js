"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.n = (module)=>{
        var getter = module && module.__esModule ? ()=>module['default'] : ()=>module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
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
    Logo: ()=>Logo,
    LogoUrl: ()=>LogoUrl
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
require("./index.css");
const sqai_logo_js_namespaceObject = require("../../assets/sqai-logo.js");
var sqai_logo_js_default = /*#__PURE__*/ __webpack_require__.n(sqai_logo_js_namespaceObject);
const LogoUrl = sqai_logo_js_default();
const Logo = (param)=>{
    let { hideLogo = false } = param;
    if (hideLogo) return null;
    return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
        className: "logo",
        children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("a", {
            href: "https://sqai.tech",
            target: "_blank",
            rel: "noreferrer",
            children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("img", {
                alt: "SQAI Logo",
                src: sqai_logo_js_default()
            })
        })
    });
};
exports.Logo = __webpack_exports__.Logo;
exports.LogoUrl = __webpack_exports__.LogoUrl;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "Logo",
    "LogoUrl"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
