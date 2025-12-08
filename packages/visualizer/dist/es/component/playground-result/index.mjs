import { jsx, jsxs } from "react/jsx-runtime";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { emptyResultTip, serverLaunchTip } from "../misc/index.mjs";
import { Player } from "../player/index.mjs";
import shiny_text from "../shiny-text/index.mjs";
import "./index.css";
const PlaygroundResultView = (param)=>{
    let { result, loading, serverValid, serviceMode, replayScriptsInfo, replayCounter, loadingProgressText, verticalMode = false, notReadyMessage, fitMode, autoZoom } = param;
    let resultWrapperClassName = 'result-wrapper';
    if (verticalMode) resultWrapperClassName += ' vertical-mode-result';
    if (replayScriptsInfo && verticalMode) resultWrapperClassName += ' result-wrapper-compact';
    let resultDataToShow = emptyResultTip;
    if (serverValid || 'Server' !== serviceMode) {
        if (loading) resultDataToShow = /*#__PURE__*/ jsxs("div", {
            className: "loading-container",
            children: [
                /*#__PURE__*/ jsx(Spin, {
                    spinning: loading,
                    indicator: /*#__PURE__*/ jsx(LoadingOutlined, {
                        spin: true
                    })
                }),
                /*#__PURE__*/ jsx("div", {
                    className: "loading-progress-text loading-progress-text-progress",
                    children: /*#__PURE__*/ jsx(shiny_text, {
                        text: loadingProgressText,
                        speed: 3
                    })
                })
            ]
        });
        else if (replayScriptsInfo) resultDataToShow = /*#__PURE__*/ jsx(Player, {
            replayScripts: replayScriptsInfo.scripts,
            imageWidth: replayScriptsInfo.width,
            imageHeight: replayScriptsInfo.height,
            reportFileContent: ('In-Browser-Extension' === serviceMode || 'Server' === serviceMode) && (null == result ? void 0 : result.reportHTML) ? null == result ? void 0 : result.reportHTML : null,
            fitMode: fitMode,
            autoZoom: autoZoom
        }, replayCounter);
        else if (null == result ? void 0 : result.error) resultDataToShow = /*#__PURE__*/ jsx("pre", {
            children: null == result ? void 0 : result.error
        });
        else if ((null == result ? void 0 : result.result) !== void 0) resultDataToShow = 'string' == typeof (null == result ? void 0 : result.result) ? /*#__PURE__*/ jsx("pre", {
            children: null == result ? void 0 : result.result
        }) : /*#__PURE__*/ jsx("pre", {
            children: JSON.stringify(null == result ? void 0 : result.result, null, 2)
        });
    } else resultDataToShow = serverLaunchTip(notReadyMessage);
    return /*#__PURE__*/ jsx("div", {
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
export { PlaygroundResultView };
