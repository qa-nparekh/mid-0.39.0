import { uuid } from "@sqai/shared/utils";
function emitInsightDump(data, dumpSubscriber) {
    const baseData = {
        logTime: Date.now()
    };
    const finalData = {
        logId: uuid(),
        ...baseData,
        ...data
    };
    null == dumpSubscriber || dumpSubscriber(finalData);
}
export { emitInsightDump };

//# sourceMappingURL=utils.mjs.map