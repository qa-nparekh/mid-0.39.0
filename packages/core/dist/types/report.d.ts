import type { ReportFileWithAttributes } from './types';
export declare class ReportMergingTool {
    private reportInfos;
    append(reportInfo: ReportFileWithAttributes): void;
    clear(): void;
    private extractScriptContent;
    mergeReports(reportFileName?: 'AUTO' | string, // user custom report filename, save into midscene report dir if undefined
    opts?: {
        rmOriginalReports?: boolean;
        overwrite?: boolean;
    }): string | null;
}
