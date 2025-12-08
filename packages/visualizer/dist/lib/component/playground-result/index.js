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
    PlaygroundResultView: ()=>PlaygroundResultView
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
const icons_namespaceObject = require("@ant-design/icons");
const external_antd_namespaceObject = require("antd");
const index_js_namespaceObject = require("../misc/index.js");
const external_player_index_js_namespaceObject = require("../player/index.js");
const external_shiny_text_index_js_namespaceObject = require("../shiny-text/index.js");
var external_shiny_text_index_js_default = /*#__PURE__*/ __webpack_require__.n(external_shiny_text_index_js_namespaceObject);
require("./index.css");
const PlaygroundResultView = (param)=>{
    let { result, loading, serverValid, serviceMode, replayScriptsInfo, replayCounter, loadingProgressText, verticalMode = false, notReadyMessage, fitMode, autoZoom } = param;
    let resultWrapperClassName = 'result-wrapper';
    if (verticalMode) resultWrapperClassName += ' vertical-mode-result';
    if (replayScriptsInfo && verticalMode) resultWrapperClassName += ' result-wrapper-compact';
    let resultDataToShow = index_js_namespaceObject.emptyResultTip;
    if (serverValid || 'Server' !== serviceMode) {
        if (loading) resultDataToShow = /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
            className: "loading-container",
            children: [
                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Spin, {
                    spinning: loading,
                    indicator: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(icons_namespaceObject.LoadingOutlined, {
                        spin: true
                    })
                }),
                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                    className: "loading-progress-text loading-progress-text-progress",
                    children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_shiny_text_index_js_default(), {
                        text: loadingProgressText,
                        speed: 3
                    })
                })
            ]
        });
        else if (replayScriptsInfo) resultDataToShow = /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_player_index_js_namespaceObject.Player, {
            replayScripts: replayScriptsInfo.scripts,
            imageWidth: replayScriptsInfo.width,
            imageHeight: replayScriptsInfo.height,
            reportFileContent: ('In-Browser-Extension' === serviceMode || 'Server' === serviceMode) && (null == result ? void 0 : result.reportHTML) ? null == result ? void 0 : result.reportHTML : null,
            fitMode: fitMode,
            autoZoom: autoZoom
        }, replayCounter);
        else if (null == result ? void 0 : result.error) resultDataToShow = /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("pre", {
            children: null == result ? void 0 : result.error
        });
        else if ((null == result ? void 0 : result.result) !== void 0) resultDataToShow = 'string' == typeof (null == result ? void 0 : result.result) ? /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("pre", {
            children: null == result ? void 0 : result.result
        }) : /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("pre", {
            children: JSON.stringify(null == result ? void 0 : result.result, null, 2)
        });
    } else resultDataToShow = (0, index_js_namespaceObject.serverLaunchTip)(notReadyMessage);
    return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
        className: resultWrapperClassName,
        style: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            justifyContent: 'center'
        },
        children: resultDataToShow
    });
};
exports.PlaygroundResultView = __webpack_exports__.PlaygroundResultView;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "PlaygroundResultView"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
