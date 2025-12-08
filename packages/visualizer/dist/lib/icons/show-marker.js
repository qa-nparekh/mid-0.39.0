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
    default: ()=>show_marker
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
require("react");
const SvgShowMarker = (props)=>/*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 16,
        height: 16,
        fill: "none",
        viewBox: "0 0 16 16",
        ...props,
        children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("path", {
            fill: "#333",
            d: "M13 1.835a2.165 2.165 0 0 1 .665 4.225v3.88a2.166 2.166 0 1 1-2.725 2.725H5.06a2.165 2.165 0 1 1-2.725-2.726V6.06A2.165 2.165 0 1 1 5.06 3.336h5.88c.281-.87 1.097-1.5 2.06-1.5m-10 9.33a.835.835 0 1 0 0 1.67.835.835 0 0 0 0-1.67m10 0a.835.835 0 1 0 0 1.67.835.835 0 0 0 0-1.67m-7.94-6.5A2.17 2.17 0 0 1 3.665 6.06v3.88c.66.213 1.181.734 1.395 1.395h5.88a2.17 2.17 0 0 1 1.395-1.396V6.06a2.17 2.17 0 0 1-1.395-1.394zM3 3.165a.835.835 0 1 0 0 1.67.835.835 0 0 0 0-1.67m10 0a.835.835 0 1 0 0 1.67.835.835 0 0 0 0-1.67"
        })
    });
const show_marker = SvgShowMarker;
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
