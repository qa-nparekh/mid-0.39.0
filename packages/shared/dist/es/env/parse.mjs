import { SQAI_USE_DOUBAO_VISION, SQAI_USE_GEMINI, SQAI_USE_QWEN3_VL, SQAI_USE_QWEN_VL, SQAI_USE_VLM_UI_TARS, UITarsModelVersion, VL_MODE_RAW_VALID_VALUES } from "./types.mjs";
const parseVlModeAndUiTarsModelVersionFromRawValue = (vlModeRaw)=>{
    if (!vlModeRaw) return {
        vlMode: void 0,
        uiTarsVersion: void 0
    };
    if (!VL_MODE_RAW_VALID_VALUES.includes(vlModeRaw)) throw new Error(`the value ${vlModeRaw} is not a valid VL_MODE value, must be one of ${VL_MODE_RAW_VALID_VALUES}`);
    const raw = vlModeRaw;
    if ('vlm-ui-tars' === raw) return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: UITarsModelVersion.V1_0
    };
    if ('vlm-ui-tars-doubao' === raw || 'vlm-ui-tars-doubao-1.5' === raw) return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: UITarsModelVersion.DOUBAO_1_5_20B
    };
    return {
        vlMode: raw,
        uiTarsVersion: void 0
    };
};
const parseVlModeAndUiTarsFromGlobalConfig = (provider)=>{
    const isDoubao = provider[SQAI_USE_DOUBAO_VISION];
    const isQwen = provider[SQAI_USE_QWEN_VL];
    const isQwen3 = provider[SQAI_USE_QWEN3_VL];
    const isUiTars = provider[SQAI_USE_VLM_UI_TARS];
    const isGemini = provider[SQAI_USE_GEMINI];
    const enabledModes = [
        isDoubao && SQAI_USE_DOUBAO_VISION,
        isQwen && SQAI_USE_QWEN_VL,
        isQwen3 && SQAI_USE_QWEN3_VL,
        isUiTars && SQAI_USE_VLM_UI_TARS,
        isGemini && SQAI_USE_GEMINI
    ].filter(Boolean);
    if (enabledModes.length > 1) throw new Error(`Only one vision mode can be enabled at a time. Currently enabled modes: ${enabledModes.join(', ')}. Please disable all but one mode.`);
    if (isQwen3) return {
        vlMode: 'qwen3-vl',
        uiTarsVersion: void 0
    };
    if (isQwen) return {
        vlMode: 'qwen-vl',
        uiTarsVersion: void 0
    };
    if (isDoubao) return {
        vlMode: 'doubao-vision',
        uiTarsVersion: void 0
    };
    if (isGemini) return {
        vlMode: 'gemini',
        uiTarsVersion: void 0
    };
    if (isUiTars) if ('1' === isUiTars) return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: UITarsModelVersion.V1_0
    };
    else if ('DOUBAO' === isUiTars || 'DOUBAO-1.5' === isUiTars) return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: UITarsModelVersion.DOUBAO_1_5_20B
    };
    else return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: `${isUiTars}`
    };
    return {
        vlMode: void 0,
        uiTarsVersion: void 0
    };
};
export { parseVlModeAndUiTarsFromGlobalConfig, parseVlModeAndUiTarsModelVersionFromRawValue };
