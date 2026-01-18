import node_fs from "node:fs";
import node_path from "node:path";
import node_util from "node:util";
import debug from "debug";
import { getMidsceneRunSubDir } from "./common.mjs";
import { ifInNode } from "./utils.mjs";
const topicPrefix = 'sqai';
const logStreams = new Map();
const debugInstances = new Map();
function getLogStream(topic) {
    const topicFileName = topic.replace(/:/g, '-');
    if (!logStreams.has(topicFileName)) {
        const logFile = node_path.join(getMidsceneRunSubDir('log'), `${topicFileName}.log`);
        const stream = node_fs.createWriteStream(logFile, {
            flags: 'a'
        });
        logStreams.set(topicFileName, stream);
    }
    return logStreams.get(topicFileName);
}
function writeLogToFile(topic, message) {
    if (!ifInNode) return;
    const stream = getLogStream(topic);
    const now = new Date();
    const isoDate = now.toLocaleDateString('sv-SE');
    const isoTime = now.toLocaleTimeString('sv-SE');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
    const timezoneOffsetMinutes = now.getTimezoneOffset();
    const sign = timezoneOffsetMinutes <= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60).toString().padStart(2, '0');
    const minutes = (Math.abs(timezoneOffsetMinutes) % 60).toString().padStart(2, '0');
    const timezoneString = `${sign}${hours}:${minutes}`;
    const localISOTime = `${isoDate}T${isoTime}.${milliseconds}${timezoneString}`;
    stream.write(`[${localISOTime}] ${message}\n`);
}
function getDebug(topic) {
    const fullTopic = `${topicPrefix}:${topic}`;
    if (!debugInstances.has(fullTopic)) {
        const debugFn = debug(fullTopic);
        const wrapper = (...args)=>{
            if (ifInNode) {
                const message = node_util.format(...args);
                writeLogToFile(topic, message);
            }
            debugFn(...args);
        };
        debugInstances.set(fullTopic, wrapper);
    }
    return debugInstances.get(fullTopic);
}
function enableDebug(topic) {
    if (ifInNode) return;
    debug.enable(`${topicPrefix}:${topic}`);
}
function cleanupLogStreams() {
    if (!ifInNode) return;
    for (const stream of logStreams.values())stream.end();
    logStreams.clear();
    debugInstances.clear();
}
export { cleanupLogStreams, enableDebug, getDebug };
