import { type TVlModeTypes, UITarsModelVersion } from './types';
export declare const parseVlModeAndUiTarsModelVersionFromRawValue: (vlModeRaw?: string) => {
    vlMode?: TVlModeTypes;
    uiTarsVersion?: UITarsModelVersion;
};
/**
 * legacy logic of how to detect vlMode from process.env without intent
 */
export declare const parseVlModeAndUiTarsFromGlobalConfig: (provider: Record<string, string | undefined>) => {
    vlMode?: TVlModeTypes;
    uiTarsVersion?: UITarsModelVersion;
};
