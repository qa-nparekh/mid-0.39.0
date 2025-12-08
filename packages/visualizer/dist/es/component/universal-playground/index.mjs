import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import icons, { ArrowDownOutlined, ClearOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Form, List, Tooltip, Typography, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePlaygroundExecution } from "../../hooks/usePlaygroundExecution.mjs";
import { usePlaygroundState } from "../../hooks/usePlaygroundState.mjs";
import { useEnvConfig } from "../../store/store.mjs";
import { ContextPreview } from "../context-preview/index.mjs";
import { EnvConfigReminder } from "../env-config-reminder/index.mjs";
import { PlaygroundResultView } from "../playground-result/index.mjs";
import "./index.css";
import avatar from "../../icons/avatar.mjs";
import { PromptInput } from "../prompt-input/index.mjs";
import { createStorageProvider, detectBestStorageType } from "./providers/storage-provider.mjs";
const { Text } = Typography;
function getSDKId(sdk) {
    if (sdk.id && 'string' == typeof sdk.id) return `agent-${sdk.id}`;
    return 'playground-default';
}
function ErrorMessage(param) {
    let { error } = param;
    if (!error) return null;
    return /*#__PURE__*/ jsxs(Tooltip, {
        title: /*#__PURE__*/ jsx("span", {
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
    const [form] = Form.useForm();
    const { config } = useEnvConfig();
    const [sdkReady, setSdkReady] = useState(false);
    useEffect(()=>{
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
    const effectiveStorage = useMemo(()=>{
        if (storage) return storage;
        if (!sdkReady) return null;
        const namespace = componentConfig.storageNamespace || getSDKId(playgroundSDK);
        const bestStorageType = detectBestStorageType();
        console.log(`Using ${bestStorageType} storage for namespace: ${namespace}`);
        return createStorageProvider(bestStorageType, namespace);
    }, [
        storage,
        sdkReady,
        componentConfig.storageNamespace,
        playgroundSDK
    ]);
    const { loading, setLoading, infoList, setInfoList, actionSpace, actionSpaceLoading, uiContextPreview, setUiContextPreview, showScrollToBottomButton, verticalMode, replayCounter, setReplayCounter, infoListRef, currentRunningIdRef, interruptedFlagRef, clearInfoList, handleScrollToBottom } = usePlaygroundState(playgroundSDK, effectiveStorage, contextProvider);
    const { handleRun: executeAction, handleStop, canStop } = usePlaygroundExecution(playgroundSDK, effectiveStorage, actionSpace, loading, setLoading, infoList, setInfoList, replayCounter, setReplayCounter, verticalMode, currentRunningIdRef, interruptedFlagRef);
    useEffect(()=>{
        if ((null == playgroundSDK ? void 0 : playgroundSDK.overrideConfig) && config) playgroundSDK.overrideConfig(config).catch((error)=>{
            console.error('Failed to override SDK config:', error);
        });
    }, [
        playgroundSDK,
        config
    ]);
    const handleFormRun = useCallback(async ()=>{
        try {
            const value = form.getFieldsValue();
            await executeAction(value);
        } catch (error) {
            message.error((null == error ? void 0 : error.message) || 'Execution failed');
        }
    }, [
        form,
        executeAction
    ]);
    const configAlreadySet = Object.keys(config || {}).length >= 1;
    const runButtonEnabled = componentConfig.serverMode || !dryMode && !actionSpaceLoading && configAlreadySet;
    const selectedType = Form.useWatch('type', form);
    const finalShowContextPreview = showContextPreview && false !== componentConfig.showContextPreview;
    const layout = componentConfig.layout || 'vertical';
    const showVersionInfo = false !== componentConfig.showVersionInfo;
    return /*#__PURE__*/ jsx("div", {
        className: `playground-container ${layout}-mode ${className}`.trim(),
        children: /*#__PURE__*/ jsxs(Form, {
            form: form,
            onFinish: handleFormRun,
            className: "command-form",
            children: [
                finalShowContextPreview && /*#__PURE__*/ jsx("div", {
                    className: "context-preview-section",
                    children: /*#__PURE__*/ jsx(ContextPreview, {
                        uiContextPreview: uiContextPreview,
                        setUiContextPreview: setUiContextPreview,
                        showContextPreview: finalShowContextPreview
                    })
                }),
                /*#__PURE__*/ jsxs("div", {
                    className: "middle-dialog-area",
                    children: [
                        infoList.length > 1 && /*#__PURE__*/ jsx("div", {
                            className: "clear-button-container",
                            children: /*#__PURE__*/ jsx(Button, {
                                size: "small",
                                icon: /*#__PURE__*/ jsx(ClearOutlined, {}),
                                onClick: clearInfoList,
                                type: "text",
                                className: "clear-button"
                            })
                        }),
                        /*#__PURE__*/ jsx("div", {
                            ref: infoListRef,
                            className: "info-list-container",
                            children: /*#__PURE__*/ jsx(List, {
                                itemLayout: "vertical",
                                dataSource: infoList,
                                renderItem: (item)=>{
                                    var _item_result;
                                    return /*#__PURE__*/ jsx(List.Item, {
                                        className: "list-item",
                                        children: 'user' === item.type ? /*#__PURE__*/ jsx("div", {
                                            className: "user-message-container",
                                            children: /*#__PURE__*/ jsx("div", {
                                                className: "user-message-bubble",
                                                children: item.content
                                            })
                                        }) : 'progress' === item.type ? /*#__PURE__*/ jsx("div", {
                                            children: (()=>{
                                                var _parts_, _item_result, _item_result1, _item_result2;
                                                const parts = item.content.split(' - ');
                                                const action = null == (_parts_ = parts[0]) ? void 0 : _parts_.trim();
                                                const description = parts.slice(1).join(' - ').trim();
                                                const currentIndex = infoList.findIndex((listItem)=>listItem.id === item.id);
                                                const laterProgressExists = infoList.slice(currentIndex + 1).some((listItem)=>'progress' === listItem.type);
                                                const isLatestProgress = !laterProgressExists;
                                                const shouldShowLoading = loading && isLatestProgress;
                                                return /*#__PURE__*/ jsxs(Fragment, {
                                                    children: [
                                                        action && /*#__PURE__*/ jsxs("span", {
                                                            className: "progress-action-item",
                                                            children: [
                                                                action,
                                                                /*#__PURE__*/ jsx("span", {
                                                                    className: `progress-status-icon ${shouldShowLoading ? 'loading' : (null == (_item_result = item.result) ? void 0 : _item_result.error) ? 'error' : 'completed'}`,
                                                                    children: shouldShowLoading ? /*#__PURE__*/ jsx(LoadingOutlined, {
                                                                        spin: true
                                                                    }) : (null == (_item_result1 = item.result) ? void 0 : _item_result1.error) ? "\u2717" : "\u2713"
                                                                })
                                                            ]
                                                        }),
                                                        description && /*#__PURE__*/ jsx("div", {
                                                            children: /*#__PURE__*/ jsx("span", {
                                                                className: "progress-description",
                                                                children: description
                                                            })
                                                        }),
                                                        (null == (_item_result2 = item.result) ? void 0 : _item_result2.error) && /*#__PURE__*/ jsx(ErrorMessage, {
                                                            error: item.result.error
                                                        })
                                                    ]
                                                });
                                            })()
                                        }) : 'separator' === item.type ? /*#__PURE__*/ jsxs("div", {
                                            className: "new-conversation-separator",
                                            children: [
                                                /*#__PURE__*/ jsx("div", {
                                                    className: "separator-line"
                                                }),
                                                /*#__PURE__*/ jsx("div", {
                                                    className: "separator-text-container",
                                                    children: /*#__PURE__*/ jsx(Text, {
                                                        type: "secondary",
                                                        className: "separator-text",
                                                        children: item.content
                                                    })
                                                })
                                            ]
                                        }) : /*#__PURE__*/ jsxs("div", {
                                            className: "system-message-container",
                                            children: [
                                                /*#__PURE__*/ jsxs("div", {
                                                    className: "system-message-header",
                                                    children: [
                                                        /*#__PURE__*/ jsx(icons, {
                                                            component: branding.icon || avatar,
                                                            style: {
                                                                fontSize: 20
                                                            }
                                                        }),
                                                        /*#__PURE__*/ jsx("span", {
                                                            className: "system-message-title",
                                                            children: branding.title || 'Playground'
                                                        })
                                                    ]
                                                }),
                                                (item.content || item.result) && /*#__PURE__*/ jsxs("div", {
                                                    className: "system-message-content",
                                                    children: [
                                                        'result' === item.type && (null == (_item_result = item.result) ? void 0 : _item_result.error) && /*#__PURE__*/ jsxs("div", {
                                                            className: "error-message",
                                                            children: [
                                                                /*#__PURE__*/ jsx("div", {
                                                                    className: "divider"
                                                                }),
                                                                /*#__PURE__*/ jsx(ErrorMessage, {
                                                                    error: item.result.error
                                                                })
                                                            ]
                                                        }),
                                                        'result' === item.type ? /*#__PURE__*/ jsx(PlaygroundResultView, {
                                                            result: item.result || null,
                                                            loading: item.loading || false,
                                                            serverValid: true,
                                                            serviceMode: 'Server',
                                                            replayScriptsInfo: item.replayScriptsInfo || null,
                                                            replayCounter: item.replayCounter || 0,
                                                            loadingProgressText: item.loadingProgressText || '',
                                                            verticalMode: item.verticalMode || false,
                                                            fitMode: "width"
                                                        }) : /*#__PURE__*/ jsxs(Fragment, {
                                                            children: [
                                                                /*#__PURE__*/ jsx("div", {
                                                                    className: "system-message-text",
                                                                    children: item.content
                                                                }),
                                                                item.loading && item.loadingProgressText && /*#__PURE__*/ jsx("div", {
                                                                    className: "loading-progress-text",
                                                                    children: /*#__PURE__*/ jsx("span", {
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
                        showScrollToBottomButton && false !== componentConfig.enableScrollToBottom && /*#__PURE__*/ jsx(Button, {
                            className: "scroll-to-bottom-button",
                            type: "primary",
                            shape: "circle",
                            icon: /*#__PURE__*/ jsx(ArrowDownOutlined, {}),
                            onClick: handleScrollToBottom,
                            size: "large"
                        })
                    ]
                }),
                /*#__PURE__*/ jsxs("div", {
                    className: "bottom-input-section",
                    children: [
                        componentConfig.showEnvConfigReminder ? /*#__PURE__*/ jsx(EnvConfigReminder, {}) : null,
                        /*#__PURE__*/ jsx(PromptInput, {
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
                showVersionInfo && branding.version && /*#__PURE__*/ jsx("div", {
                    className: "version-info-section",
                    children: /*#__PURE__*/ jsxs("span", {
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
export { UniversalPlayground, universal_playground as default };
