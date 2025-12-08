import type { DeviceAction, UIContext } from '@sqai/core';
import type { ContextProvider, InfoListItem, PlaygroundSDKLike, StorageProvider } from '../types';
/**
 * Hook for managing playground state
 */
export declare function usePlaygroundState(playgroundSDK: PlaygroundSDKLike | null, storage?: StorageProvider | null, contextProvider?: ContextProvider): {
    loading: boolean;
    setLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    infoList: InfoListItem[];
    setInfoList: import("react").Dispatch<import("react").SetStateAction<InfoListItem[]>>;
    actionSpace: DeviceAction<unknown>[];
    actionSpaceLoading: boolean;
    uiContextPreview: UIContext<import("@sqai/core").BaseElement> | undefined;
    setUiContextPreview: import("react").Dispatch<import("react").SetStateAction<UIContext<import("@sqai/core").BaseElement> | undefined>>;
    showScrollToBottomButton: boolean;
    verticalMode: boolean;
    replayCounter: number;
    setReplayCounter: import("react").Dispatch<import("react").SetStateAction<number>>;
    infoListRef: import("react").RefObject<HTMLDivElement>;
    currentRunningIdRef: import("react").MutableRefObject<number | null>;
    interruptedFlagRef: import("react").MutableRefObject<Record<number, boolean>>;
    clearInfoList: () => Promise<void>;
    refreshContext: () => Promise<void>;
    handleScrollToBottom: () => void;
    scrollToBottom: () => void;
};
