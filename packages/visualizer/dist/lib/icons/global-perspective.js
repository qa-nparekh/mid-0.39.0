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
    default: ()=>global_perspective
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
require("react");
const SvgGlobalPerspective = (props)=>/*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 16,
        height: 16,
        fill: "none",
        viewBox: "0 0 16 16",
        ...props,
        children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("path", {
            fill: "#333",
            d: "M1.333 13v-2.5a.667.667 0 0 1 1.334 0V13c0 .184.149.333.333.333h2.5a.667.667 0 0 1 0 1.334H3c-.92 0-1.667-.746-1.667-1.667m12 0v-2.5a.667.667 0 0 1 1.334 0V13c0 .92-.746 1.667-1.667 1.667h-2.5a.667.667 0 0 1 0-1.334H13a.333.333 0 0 0 .333-.333m-12-7.5V3c0-.92.747-1.667 1.667-1.667h2.5a.667.667 0 0 1 0 1.334H3A.333.333 0 0 0 2.667 3v2.5a.667.667 0 0 1-1.334 0m12 0V3A.333.333 0 0 0 13 2.667h-2.5a.667.667 0 0 1 0-1.334H13c.92 0 1.667.747 1.667 1.667v2.5a.667.667 0 0 1-1.334 0M5.667 10.333h4.666V5.667H5.667zm6 .167c0 .644-.523 1.167-1.167 1.167h-5A1.167 1.167 0 0 1 4.333 10.5v-5c0-.644.523-1.167 1.167-1.167h5c.644 0 1.167.523 1.167 1.167z"
        })
    });
const global_perspective = SvgGlobalPerspective;
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
