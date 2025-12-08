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
    default: ()=>player_setting
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
require("react");
const SvgPlayerSetting = (props)=>/*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 16,
        height: 16,
        fill: "none",
        viewBox: "0 0 16 16",
        ...props,
        children: [
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("path", {
                stroke: "#333",
                strokeLinejoin: "round",
                strokeWidth: 1.333,
                d: "M11.333 13.667 14.667 8l-3.334-5.667H4.667L1.333 8l3.334 5.667z"
            }),
            /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("path", {
                stroke: "#333",
                strokeLinejoin: "round",
                strokeWidth: 1.333,
                d: "M8 9.667a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334Z"
            })
        ]
    });
const player_setting = SvgPlayerSetting;
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
