import type { AndroidPullParam, DetailedLocateParam, ExecutionTask, ScrollParam } from '../types';
export declare function typeStr(task: ExecutionTask): any;
export declare function locateParamStr(locate?: DetailedLocateParam | string): string;
export declare function scrollParamStr(scrollParam?: ScrollParam): string;
export declare function pullParamStr(pullParam?: AndroidPullParam): string;
export declare function taskTitleStr(type: 'Tap' | 'Hover' | 'Input' | 'RightClick' | 'KeyboardPress' | 'Scroll' | 'Action' | 'Query' | 'Assert' | 'WaitFor' | 'Locate' | 'Boolean' | 'Number' | 'String', prompt: string): string;
export declare function paramStr(task: ExecutionTask): string;
