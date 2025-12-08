import { jsx, jsxs } from "react/jsx-runtime";
import { Checkbox, Dropdown, Radio } from "antd";
import setting from "../../icons/setting.mjs";
import { useEnvConfig } from "../../store/store.mjs";
import { deepThinkTip, domIncludedTip, screenshotIncludedTip, trackingTip } from "../../utils/constants.mjs";
const ConfigSelector = (param)=>{
    let { showDeepThinkOption = false, enableTracking = false, showDataExtractionOptions = false, hideDomAndScreenshotOptions = false } = param;
    const forceSameTabNavigation = useEnvConfig((state)=>state.forceSameTabNavigation);
    const setForceSameTabNavigation = useEnvConfig((state)=>state.setForceSameTabNavigation);
    const deepThink = useEnvConfig((state)=>state.deepThink);
    const setDeepThink = useEnvConfig((state)=>state.setDeepThink);
    const screenshotIncluded = useEnvConfig((state)=>state.screenshotIncluded);
    const setScreenshotIncluded = useEnvConfig((state)=>state.setScreenshotIncluded);
    const domIncluded = useEnvConfig((state)=>state.domIncluded);
    const setDomIncluded = useEnvConfig((state)=>state.setDomIncluded);
    if (!enableTracking && !showDeepThinkOption && !showDataExtractionOptions) return null;
    const configItems = buildConfigItems();
    return /*#__PURE__*/ jsx("div", {
        className: "selector-trigger",
        children: /*#__PURE__*/ jsx(Dropdown, {
            menu: {
                items: configItems
            },
            trigger: [
                'click'
            ],
            children: /*#__PURE__*/ jsx(setting, {
                width: 24,
                height: 24
            })
        })
    });
    function buildConfigItems() {
        const items = [];
        if (enableTracking) items.push({
            label: /*#__PURE__*/ jsx(Checkbox, {
                onChange: (e)=>setForceSameTabNavigation(e.target.checked),
                checked: forceSameTabNavigation,
                children: trackingTip
            }),
            key: 'track-config'
        });
        if (showDeepThinkOption) items.push({
            label: /*#__PURE__*/ jsx(Checkbox, {
                onChange: (e)=>{
                    setDeepThink(e.target.checked);
                },
                checked: deepThink,
                children: deepThinkTip
            }),
            key: 'deep-think-config'
        });
        if (showDataExtractionOptions && !hideDomAndScreenshotOptions) {
            items.push({
                label: /*#__PURE__*/ jsx(Checkbox, {
                    onChange: (e)=>{
                        setScreenshotIncluded(e.target.checked);
                    },
                    checked: screenshotIncluded,
                    children: screenshotIncludedTip
                }),
                key: 'screenshot-included-config'
            });
            items.push({
                label: /*#__PURE__*/ jsxs("div", {
                    style: {
                        padding: '4px 0'
                    },
                    children: [
                        /*#__PURE__*/ jsx("div", {
                            style: {
                                marginBottom: '4px',
                                fontSize: '14px'
                            },
                            children: domIncludedTip
                        }),
                        /*#__PURE__*/ jsxs(Radio.Group, {
                            size: "small",
                            value: domIncluded,
                            onChange: (e)=>setDomIncluded(e.target.value),
                            children: [
                                /*#__PURE__*/ jsx(Radio, {
                                    value: false,
                                    children: "Off"
                                }),
                                /*#__PURE__*/ jsx(Radio, {
                                    value: true,
                                    children: "All"
                                }),
                                /*#__PURE__*/ jsx(Radio, {
                                    value: 'visible-only',
                                    children: "Visible only"
                                })
                            ]
                        })
                    ]
                }),
                key: 'dom-included-config'
            });
        }
        return items;
    }
};
export { ConfigSelector };
