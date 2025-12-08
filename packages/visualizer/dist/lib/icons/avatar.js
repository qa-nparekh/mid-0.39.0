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
    default: ()=>avatar
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
require("react");
const SvgAvatar = (props)=>/*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 20,
        height: 20,
        fill: "none",
        "aria-label": "Playground",
        viewBox: "0 0 20 20",
        ...props,
        children: [
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("rect", {
                width: 20,
                height: 20,
                fill: "#2B83FF",
                rx: 10
            }),
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("path", {
                fill: "#2B83FF",
                stroke: "#fff",
                strokeLinejoin: "round",
                strokeWidth: 1.125,
                d: "M6.866 5.882a.56.56 0 0 1 .667-.078l3.248 1.875 3.247 1.875a.563.563 0 0 1 0 .974l-3.247 1.875-3.248 1.875a.563.563 0 0 1-.784-.74l1.749-3.497-1.75-3.498a.56.56 0 0 1 .118-.661Z"
            })
        ]
    });
const avatar = SvgAvatar;
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
