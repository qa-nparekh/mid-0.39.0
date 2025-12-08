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
    UniversalPlayground: ()=>UniversalPlayground,
    default: ()=>universal_playground
});
const jsx_runtime_namespaceObject = require("react/jsx-runtime");
const icons_namespaceObject = require("@ant-design/icons");
var icons_default = /*#__PURE__*/ __webpack_require__.n(icons_namespaceObject);
const external_antd_namespaceObject = require("antd");
const external_react_namespaceObject = require("react");
const usePlaygroundExecution_js_namespaceObject = require("../../hooks/usePlaygroundExecution.js");
const usePlaygroundState_js_namespaceObject = require("../../hooks/usePlaygroundState.js");
const store_js_namespaceObject = require("../../store/store.js");
const index_js_namespaceObject = require("../context-preview/index.js");
const external_env_config_reminder_index_js_namespaceObject = require("../env-config-reminder/index.js");
const external_playground_result_index_js_namespaceObject = require("../playground-result/index.js");
require("./index.css");
const avatar_js_namespaceObject = require("../../icons/avatar.js");
var avatar_js_default = /*#__PURE__*/ __webpack_require__.n(avatar_js_namespaceObject);
const external_prompt_input_index_js_namespaceObject = require("../prompt-input/index.js");
const storage_provider_js_namespaceObject = require("./providers/storage-provider.js");
const { Text } = external_antd_namespaceObject.Typography;
function getSDKId(sdk) {
    if (sdk.id && 'string' == typeof sdk.id) return `agent-${sdk.id}`;
    return 'playground-default';
}
function ErrorMessage(param) {
    let { error } = param;
    if (!error) return null;
    return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)(external_antd_namespaceObject.Tooltip, {
        title: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("span", {
            style: {
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
            },
            children: error
        }),
        overlayStyle: {
            maxWidth: '100vw'
        },
        children: [
            "Error: ",
            error.split('\n')[0]
        ]
    });
}
function UniversalPlayground(param) {
    let { playgroundSDK, storage, contextProvider, config: componentConfig = {}, branding = {}, className = '', dryMode = false, showContextPreview = true } = param;
    const [form] = external_antd_namespaceObject.Form.useForm();
    const { config } = (0, store_js_namespaceObject.useEnvConfig)();
    const [sdkReady, setSdkReady] = (0, external_react_namespaceObject.useState)(false);
    (0, external_react_namespaceObject.useEffect)(()=>{
        const initializeSDK = async ()=>{
            if (playgroundSDK && 'function' == typeof playgroundSDK.checkStatus) try {
                await playgroundSDK.checkStatus();
                setSdkReady(true);
            } catch (error) {
                console.warn('Failed to initialize SDK, using default namespace:', error);
                setSdkReady(true);
            }
            else setSdkReady(true);
        };
        initializeSDK();
    }, [
        playgroundSDK
    ]);
    const effectiveStorage = (0, external_react_namespaceObject.useMemo)(()=>{
        if (storage) return storage;
        if (!sdkReady) return null;
        const namespace = componentConfig.storageNamespace || getSDKId(playgroundSDK);
        const bestStorageType = (0, storage_provider_js_namespaceObject.detectBestStorageType)();
        console.log(`Using ${bestStorageType} storage for namespace: ${namespace}`);
        return (0, storage_provider_js_namespaceObject.createStorageProvider)(bestStorageType, namespace);
    }, [
        storage,
        sdkReady,
        componentConfig.storageNamespace,
        playgroundSDK
    ]);
    const { loading, setLoading, infoList, setInfoList, actionSpace, actionSpaceLoading, uiContextPreview, setUiContextPreview, showScrollToBottomButton, verticalMode, replayCounter, setReplayCounter, infoListRef, currentRunningIdRef, interruptedFlagRef, clearInfoList, handleScrollToBottom } = (0, usePlaygroundState_js_namespaceObject.usePlaygroundState)(playgroundSDK, effectiveStorage, contextProvider);
    const { handleRun: executeAction, handleStop, canStop } = (0, usePlaygroundExecution_js_namespaceObject.usePlaygroundExecution)(playgroundSDK, effectiveStorage, actionSpace, loading, setLoading, infoList, setInfoList, replayCounter, setReplayCounter, verticalMode, currentRunningIdRef, interruptedFlagRef);
    (0, external_react_namespaceObject.useEffect)(()=>{
        if ((null == playgroundSDK ? void 0 : playgroundSDK.overrideConfig) && config) playgroundSDK.overrideConfig(config).catch((error)=>{
            console.error('Failed to override SDK config:', error);
        });
    }, [
        playgroundSDK,
        config
    ]);
    const handleFormRun = (0, external_react_namespaceObject.useCallback)(async ()=>{
        try {
            const value = form.getFieldsValue();
            await executeAction(value);
        } catch (error) {
            external_antd_namespaceObject.message.error((null == error ? void 0 : error.message) || 'Execution failed');
        }
    }, [
        form,
        executeAction
    ]);
    const configAlreadySet = Object.keys(config || {}).length >= 1;
    const runButtonEnabled = componentConfig.serverMode || !dryMode && !actionSpaceLoading && configAlreadySet;
    const selectedType = external_antd_namespaceObject.Form.useWatch('type', form);
    const finalShowContextPreview = showContextPreview && false !== componentConfig.showContextPreview;
    const layout = componentConfig.layout || 'vertical';
    const showVersionInfo = false !== componentConfig.showVersionInfo;
    return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
        className: `playground-container ${layout}-mode ${className}`.trim(),
        children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)(external_antd_namespaceObject.Form, {
            form: form,
            onFinish: handleFormRun,
            className: "command-form",
            children: [
                finalShowContextPreview && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                    className: "context-preview-section",
                    children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(index_js_namespaceObject.ContextPreview, {
                        uiContextPreview: uiContextPreview,
                        setUiContextPreview: setUiContextPreview,
                        showContextPreview: finalShowContextPreview
                    })
                }),
                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                    className: "middle-dialog-area",
                    children: [
                        infoList.length > 1 && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                            className: "clear-button-container",
                            children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Button, {
                                size: "small",
                                icon: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(icons_namespaceObject.ClearOutlined, {}),
                                onClick: clearInfoList,
                                type: "text",
                                className: "clear-button"
                            })
                        }),
                        /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                            ref: infoListRef,
                            className: "info-list-container",
                            children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.List, {
                                itemLayout: "vertical",
                                dataSource: infoList,
                                renderItem: (item)=>{
                                    var _item_result;
                                    return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.List.Item, {
                                        className: "list-item",
                                        children: 'user' === item.type ? /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                            className: "user-message-container",
                                            children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                                className: "user-message-bubble",
                                                children: item.content
                                            })
                                        }) : 'progress' === item.type ? /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                            children: (()=>{
                                                var _parts_, _item_result, _item_result1, _item_result2;
                                                const parts = item.content.split(' - ');
                                                const action = null == (_parts_ = parts[0]) ? void 0 : _parts_.trim();
                                                const description = parts.slice(1).join(' - ').trim();
                                                const currentIndex = infoList.findIndex((listItem)=>listItem.id === item.id);
                                                const laterProgressExists = infoList.slice(currentIndex + 1).some((listItem)=>'progress' === listItem.type);
                                                const isLatestProgress = !laterProgressExists;
                                                const shouldShowLoading = loading && isLatestProgress;
                                                return /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)(jsx_runtime_namespaceObject.Fragment, {
                                                    children: [
                                                        action && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("span", {
                                                            className: "progress-action-item",
                                                            children: [
                                                                action,
                                                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("span", {
                                                                    className: `progress-status-icon ${shouldShowLoading ? 'loading' : (null == (_item_result = item.result) ? void 0 : _item_result.error) ? 'error' : 'completed'}`,
                                                                    children: shouldShowLoading ? /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(icons_namespaceObject.LoadingOutlined, {
                                                                        spin: true
                                                                    }) : (null == (_item_result1 = item.result) ? void 0 : _item_result1.error) ? "\u2717" : "\u2713"
                                                                })
                                                            ]
                                                        }),
                                                        description && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                                            children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("span", {
                                                                className: "progress-description",
                                                                children: description
                                                            })
                                                        }),
                                                        (null == (_item_result2 = item.result) ? void 0 : _item_result2.error) && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(ErrorMessage, {
                                                            error: item.result.error
                                                        })
                                                    ]
                                                });
                                            })()
                                        }) : 'separator' === item.type ? /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                                            className: "new-conversation-separator",
                                            children: [
                                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                                    className: "separator-line"
                                                }),
                                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                                    className: "separator-text-container",
                                                    children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(Text, {
                                                        type: "secondary",
                                                        className: "separator-text",
                                                        children: item.content
                                                    })
                                                })
                                            ]
                                        }) : /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                                            className: "system-message-container",
                                            children: [
                                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                                                    className: "system-message-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(icons_default(), {
                                                            component: branding.icon || avatar_js_default(),
                                                            style: {
                                                                fontSize: 20
                                                            }
                                                        }),
                                                        /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("span", {
                                                            className: "system-message-title",
                                                            children: branding.title || 'Playground'
                                                        })
                                                    ]
                                                }),
                                                (item.content || item.result) && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                                                    className: "system-message-content",
                                                    children: [
                                                        'result' === item.type && (null == (_item_result = item.result) ? void 0 : _item_result.error) && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                                                            className: "error-message",
                                                            children: [
                                                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                                                    className: "divider"
                                                                }),
                                                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(ErrorMessage, {
                                                                    error: item.result.error
                                                                })
                                                            ]
                                                        }),
                                                        'result' === item.type ? /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_playground_result_index_js_namespaceObject.PlaygroundResultView, {
                                                            result: item.result || null,
                                                            loading: item.loading || false,
                                                            serverValid: true,
                                                            serviceMode: 'Server',
                                                            replayScriptsInfo: item.replayScriptsInfo || null,
                                                            replayCounter: item.replayCounter || 0,
                                                            loadingProgressText: item.loadingProgressText || '',
                                                            verticalMode: item.verticalMode || false,
                                                            fitMode: "width"
                                                        }) : /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)(jsx_runtime_namespaceObject.Fragment, {
                                                            children: [
                                                                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                                                    className: "system-message-text",
                                                                    children: item.content
                                                                }),
                                                                item.loading && item.loadingProgressText && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                                                                    className: "loading-progress-text",
                                                                    children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("span", {
                                                                        children: item.loadingProgressText
                                                                    })
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    }, item.id);
                                }
                            })
                        }),
                        showScrollToBottomButton && false !== componentConfig.enableScrollToBottom && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_antd_namespaceObject.Button, {
                            className: "scroll-to-bottom-button",
                            type: "primary",
                            shape: "circle",
                            icon: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(icons_namespaceObject.ArrowDownOutlined, {}),
                            onClick: handleScrollToBottom,
                            size: "large"
                        })
                    ]
                }),
                /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("div", {
                    className: "bottom-input-section",
                    children: [
                        componentConfig.showEnvConfigReminder ? /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_env_config_reminder_index_js_namespaceObject.EnvConfigReminder, {}) : null,
                        /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)(external_prompt_input_index_js_namespaceObject.PromptInput, {
                            runButtonEnabled: runButtonEnabled,
                            form: form,
                            serviceMode: 'Server',
                            selectedType: selectedType,
                            dryMode: dryMode,
                            stoppable: canStop,
                            loading: loading,
                            onRun: handleFormRun,
                            onStop: handleStop,
                            actionSpace: actionSpace
                        })
                    ]
                }),
                showVersionInfo && branding.version && /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsx)("div", {
                    className: "version-info-section",
                    children: /*#__PURE__*/ (0, jsx_runtime_namespaceObject.jsxs)("span", {
                        className: "version-text",
                        children: [
                            "Midscene.js version: ",
                            branding.version
                        ]
                    })
                })
            ]
        })
    });
}
const universal_playground = UniversalPlayground;
exports.UniversalPlayground = __webpack_exports__.UniversalPlayground;
exports["default"] = __webpack_exports__["default"];
for(var __webpack_i__ in __webpack_exports__)if (-1 === [
    "UniversalPlayground",
    "default"
].indexOf(__webpack_i__)) exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
