import type { DeviceAction } from '@sqaitech/core';
import type { FormValue, InfoListItem, PlaygroundSDKLike, StorageProvider } from '../types';
/**
 * Hook for handling playground execution logic
 */
export declare function usePlaygroundExecution(playgroundSDK: PlaygroundSDKLike | null, storage: StorageProvider | undefined | null, actionSpace: DeviceAction<unknown>[], loading: boolean, setLoading: (loading: boolean) => void, infoList: InfoListItem[], setInfoList: React.Dispatch<React.SetStateAction<InfoListItem[]>>, replayCounter: number, setReplayCounter: React.Dispatch<React.SetStateAction<number>>, verticalMode: boolean, currentRunningIdRef: React.MutableRefObject<number | null>, interruptedFlagRef: React.MutableRefObject<Record<number, boolean>>): {
    handleRun: (value: FormValue) => Promise<void>;
    handleStop: () => Promise<void>;
    canStop: boolean;
};
