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
    createPlaygroundCopyPlugin: ()=>createPlaygroundCopyPlugin,
    createCopyStaticPlugin: ()=>createCopyStaticPlugin
});
const external_node_fs_namespaceObject = require("node:fs");
var external_node_fs_default = /*#__PURE__*/ __webpack_require__.n(external_node_fs_namespaceObject);
const external_node_path_namespaceObject = require("node:path");
var external_node_path_default = /*#__PURE__*/ __webpack_require__.n(external_node_path_namespaceObject);
const createCopyStaticPlugin = (options)=>({
        name: options.pluginName || 'copy-static',
        setup (api) {
            api.onAfterBuild(async ()=>{
                const { srcDir, destDir, faviconPath } = options;
                await external_node_fs_default().promises.mkdir(destDir, {
                    recursive: true
                });
                await external_node_fs_default().promises.cp(srcDir, destDir, {
                    recursive: true
                });
                console.log(`Copied build artifacts from ${srcDir} to ${destDir}`);
                if (faviconPath) {
                    const faviconDest = external_node_path_default().join(destDir, 'favicon.ico');
                    await external_node_fs_default().promises.copyFile(faviconPath, faviconDest);
                    console.log(`Copied favicon from ${faviconPath} to ${faviconDest}`);
                }
            });
        }
    });
const createPlaygroundCopyPlugin = (srcDir, destDir, pluginName, faviconSrc)=>createCopyStaticPlugin({
        srcDir,
        destDir,
        faviconPath: faviconSrc,
        pluginName
    });
exports.createCopyStaticPlugin = __webpack_exports__.createCopyStaticPlugin;
exports.createPlaygroundCopyPlugin = __webpack_exports__.createPlaygroundCopyPlugin;
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "createCopyStaticPlugin",
    "createPlaygroundCopyPlugin"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
