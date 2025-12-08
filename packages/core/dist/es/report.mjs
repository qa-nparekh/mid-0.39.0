import { appendFileSync, existsSync, readFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { getMidsceneRunSubDir } from "@sqai/shared/common";
import { getReportFileName } from "./agent/index.mjs";
import { getReportTpl, reportHTMLContent } from "./utils.mjs";
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class ReportMergingTool {
    append(reportInfo) {
        this.reportInfos.push(reportInfo);
    }
    clear() {
        this.reportInfos = [];
    }
    extractScriptContent(filePath) {
        const scriptRegex = /\n<script type="SQAI_web_dump" type="application\/json"[^>]*>([\s\S]*?)\n<\/script>/;
        const fileContent = readFileSync(filePath, 'utf-8');
        const match = scriptRegex.exec(fileContent);
        return match ? match[1].trim() : '';
    }
    mergeReports(reportFileName = 'AUTO', opts) {
        if (this.reportInfos.length <= 1) {
            console.log('Not enough report to merge');
            return null;
        }
        opts = Object.assign({
            rmOriginalReports: false,
            overwrite: false
        }, opts || {});
        const { rmOriginalReports, overwrite } = opts;
        let outputFilePath;
        const targetDir = `${getMidsceneRunSubDir('report')}`;
        if ('AUTO' === reportFileName) outputFilePath = resolve(targetDir, `${getReportFileName('merged-report')}.html`);
        else {
            outputFilePath = resolve(targetDir, `${reportFileName}.html`);
            if (existsSync(outputFilePath) && !overwrite) throw Error(`report file already existed: ${outputFilePath}\nset override to true to overwrite this file.`);
            if (existsSync(outputFilePath) && overwrite) unlinkSync(outputFilePath);
        }
        console.log(`Start merging ${this.reportInfos.length} reports...\nCreating template file...`);
        try {
            appendFileSync(outputFilePath, getReportTpl());
            for(let i = 0; i < this.reportInfos.length; i++){
                const reportInfo = this.reportInfos[i];
                console.log(`Processing report ${i + 1}/${this.reportInfos.length}`);
                const dumpString = this.extractScriptContent(reportInfo.reportFilePath);
                const reportAttributes = reportInfo.reportAttributes;
                const reportHtmlStr = `${reportHTMLContent({
                    dumpString,
                    attributes: {
                        playwright_test_duration: reportAttributes.testDuration,
                        playwright_test_status: reportAttributes.testStatus,
                        playwright_test_title: reportAttributes.testTitle,
                        playwright_test_id: reportAttributes.testId,
                        playwright_test_description: reportAttributes.testDescription
                    }
                }, void 0, void 0, false)}\n`;
                appendFileSync(outputFilePath, reportHtmlStr);
            }
            console.log(`Successfully merged new report: ${outputFilePath}`);
            if (rmOriginalReports) {
                for (const info of this.reportInfos)try {
                    unlinkSync(info.reportFilePath);
                } catch (error) {
                    console.error(`Error deleting report ${info.reportFilePath}:`, error);
                }
                console.log(`Removed ${this.reportInfos.length} original reports`);
            }
            return outputFilePath;
        } catch (error) {
            console.error('Error in mergeReports:', error);
            throw error;
        }
    }
    constructor(){
        _define_property(this, "reportInfos", []);
    }
}
export { ReportMergingTool };

//# sourceMappingURL=report.mjs.map