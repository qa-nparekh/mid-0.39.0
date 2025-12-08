import type { ExecutionDump, ExecutionTask, ExecutionTaskApply, ExecutionTaskProgressOptions } from '../types';
export declare class Executor {
    name: string;
    tasks: ExecutionTask[];
    status: 'init' | 'pending' | 'running' | 'completed' | 'error';
    onTaskStart?: ExecutionTaskProgressOptions['onTaskStart'];
    constructor(name: string, options?: ExecutionTaskProgressOptions & {
        tasks?: ExecutionTaskApply[];
    });
    private markTaskAsPending;
    append(task: ExecutionTaskApply[] | ExecutionTaskApply): Promise<void>;
    flush(): Promise<{
        output: any;
        thought?: string;
    } | undefined>;
    isInErrorState(): boolean;
    latestErrorTask(): ExecutionTask | null;
    dump(): ExecutionDump;
}
