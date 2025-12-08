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
    default: ()=>setting
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
require("react");
const SvgSetting = (props)=>/*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 27,
        height: 27,
        fill: "none",
        viewBox: "0 0 27 27",
        ...props,
        children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("path", {
            stroke: "#000",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeOpacity: 0.85,
            strokeWidth: 1.333,
            d: "M19.527 8.855h-2M14.86 7.522v2.667M14.86 8.855H7.527M10.194 13.522H7.527M12.86 12.189v2.666M20.193 13.522H12.86M19.527 18.189h-2M14.86 16.855v2.667M14.86 18.189H7.527"
        })
    });
const setting = SvgSetting;
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
