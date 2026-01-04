import { overrideAIConfig } from "@sqaitech/shared/env";
import { message } from "antd";
function safeOverrideAIConfig(newConfig) {
    let extendMode = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : false, showErrorMessage = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : true;
    try {
        overrideAIConfig(newConfig, extendMode);
        return true;
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Failed to override AI config:', err);
        if (showErrorMessage) message.error(`Failed to apply AI configuration: ${err.message}`);
        return false;
    }
}
function useSafeOverrideAIConfig() {
    const applyConfig = function(newConfig) {
        let extendMode = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : false, showErrorMessage = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : true;
        return safeOverrideAIConfig(newConfig, extendMode, showErrorMessage);
    };
    return {
        applyConfig
    };
}
export { safeOverrideAIConfig, useSafeOverrideAIConfig };
