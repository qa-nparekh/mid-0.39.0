import type { ExecutionDump, ExecutionTask, GroupedActionDump, LocateResultElement, Rect, UIContext } from '@sqai/core';
export interface CameraState {
    left: number;
    top: number;
    width: number;
    pointerLeft: number;
    pointerTop: number;
}
export type TargetCameraState = Omit<CameraState, 'pointerLeft' | 'pointerTop'> & Partial<Pick<CameraState, 'pointerLeft' | 'pointerTop'>>;
export interface AnimationScript {
    type: 'img' | 'insight' | 'clear-insight' | 'pointer' | 'spinning-pointer' | 'sleep';
    img?: string;
    camera?: TargetCameraState;
    context?: UIContext;
    highlightElement?: LocateResultElement;
    searchArea?: Rect;
    duration: number;
    insightCameraDuration?: number;
    title?: string;
    subTitle?: string;
    imageWidth?: number;
    imageHeight?: number;
}
export declare const cameraStateForRect: (rect: Rect, imageWidth: number, imageHeight: number) => TargetCameraState;
export declare const mergeTwoCameraState: (cameraState1: TargetCameraState, cameraState2: TargetCameraState) => TargetCameraState;
export interface ReplayScriptsInfo {
    scripts: AnimationScript[];
    width?: number;
    height?: number;
    sdkVersion?: string;
    modelBriefs: string[];
}
export declare const allScriptsFromDump: (dump: GroupedActionDump) => ReplayScriptsInfo | null;
export declare const generateAnimationScripts: (execution: ExecutionDump | null, task: ExecutionTask | number, imageWidth: number, imageHeight: number) => AnimationScript[] | null;
