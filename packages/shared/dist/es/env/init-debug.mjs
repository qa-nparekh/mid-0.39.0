import { enableDebug } from "../logger.mjs";
import { getBasicEnvValue } from "./basic.mjs";
import { SQAI_DEBUG_AI_PROFILE, SQAI_DEBUG_AI_RESPONSE } from "./types.mjs";
const initDebugConfig = ()=>{
    const shouldPrintTiming = getBasicEnvValue(SQAI_DEBUG_AI_PROFILE);
    let debugConfig = '';
    if (shouldPrintTiming) {
        console.warn('SQAI_DEBUG_AI_PROFILE is deprecated, use DEBUG=sqai:ai:profile instead');
        debugConfig = 'ai:profile';
    }
    const shouldPrintAIResponse = getBasicEnvValue(SQAI_DEBUG_AI_RESPONSE);
    if (shouldPrintAIResponse) {
        console.warn('SQAI_DEBUG_AI_RESPONSE is deprecated, use DEBUG=sqai:ai:response instead');
        debugConfig = debugConfig ? 'ai:*' : 'ai:call';
    }
    if (debugConfig) enableDebug(debugConfig);
};
export { initDebugConfig };
