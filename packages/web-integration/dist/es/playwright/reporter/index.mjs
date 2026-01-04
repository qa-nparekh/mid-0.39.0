import { readFileSync, rmSync } from "node:fs";
import { getReportFileName, printReportMsg } from "@sqaitech/core/agent";
import { writeDumpReport } from "@sqaitech/core/utils";
import { replaceIllegalPathCharsAndSpace } from "@sqaitech/shared/utils";
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
class MidsceneReporter {
    static getMode(reporterType) {
        if (!reporterType) return 'merged';
        if ('merged' !== reporterType && 'separate' !== reporterType) throw new Error(`Unknown reporter type in playwright config: ${reporterType}, only support 'merged' or 'separate'`);
        return reporterType;
    }
    getSeparatedFilename(testTitle) {
        if (!this.testTitleToFilename.has(testTitle)) {
            const baseTag = `playwright-${replaceIllegalPathCharsAndSpace(testTitle)}`;
            const generatedFilename = getReportFileName(baseTag);
            this.testTitleToFilename.set(testTitle, generatedFilename);
        }
        return this.testTitleToFilename.get(testTitle);
    }
    getReportFilename(testTitle) {
        if ('merged' === this.mode) {
            if (!this.mergedFilename) this.mergedFilename = getReportFileName('playwright-merged');
            return this.mergedFilename;
        }
        if ('separate' === this.mode) {
            if (!testTitle) throw new Error('testTitle is required in separate mode');
            return this.getSeparatedFilename(testTitle);
        }
        throw new Error(`Unknown mode: ${this.mode}`);
    }
    updateReport(testData) {
        var _testData_attributes;
        if (!testData || !this.mode) return;
        const fileName = this.getReportFilename(null == (_testData_attributes = testData.attributes) ? void 0 : _testData_attributes.playwright_test_title);
        const reportPath = writeDumpReport(fileName, testData, 'merged' === this.mode);
        reportPath && printReportMsg(reportPath);
    }
    async onBegin(config, suite) {}
    onTestBegin(_test, _result) {}
    onTestEnd(test, result) {
        const dumpAnnotation = test.annotations.find((annotation)=>'MIDSCENE_DUMP_ANNOTATION' === annotation.type);
        if (!(null == dumpAnnotation ? void 0 : dumpAnnotation.description)) return;
        const tempFilePath = dumpAnnotation.description;
        let dumpString;
        try {
            dumpString = readFileSync(tempFilePath, 'utf-8');
        } catch (error) {
            console.error(`Failed to read Midscene dump file: ${tempFilePath}`, error);
            return;
        }
        const retry = result.retry ? `(retry #${result.retry})` : '';
        const testId = `${test.id}${retry}`;
        const testData = {
            dumpString,
            attributes: {
                playwright_test_id: testId,
                playwright_test_title: `${test.title}${retry}`,
                playwright_test_status: result.status,
                playwright_test_duration: result.duration
            }
        };
        this.updateReport(testData);
        try {
            rmSync(tempFilePath, {
                force: true
            });
        } catch (error) {
            console.warn(`Failed to delete Midscene temp file: ${tempFilePath}`, error);
        }
    }
    constructor(options = {}){
        _define_property(this, "mergedFilename", void 0);
        _define_property(this, "testTitleToFilename", new Map());
        _define_property(this, "mode", void 0);
        this.mode = MidsceneReporter.getMode(options.type ?? 'merged');
    }
}
const reporter = MidsceneReporter;
export { reporter as default };

//# sourceMappingURL=index.mjs.map