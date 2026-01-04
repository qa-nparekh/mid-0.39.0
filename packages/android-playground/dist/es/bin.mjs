import { exec } from "node:child_process";
import { createServer } from "node:net";
import node_path from "node:path";
import { promisify } from "node:util";
import { select as prompts_select } from "@inquirer/prompts";
import { AndroidAgent, AndroidDevice } from "@sqaitech/android";
import { PlaygroundServer } from "@sqaitech/playground";
import { PLAYGROUND_SERVER_PORT, SCRCPY_SERVER_PORT } from "@sqaitech/shared/constants";
import { createReadStream } from "node:fs";
import { createServer as external_node_http_createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { getDebug } from "@sqaitech/shared/logger";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
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
const debugPage = getDebug('android:playground');
const promiseExec = promisify(exec);
class ScrcpyServer {
    setupApiRoutes() {
        this.app.get('/api/devices', async (req, res)=>{
            try {
                const devices = await this.getDevicesList();
                res.json({
                    devices,
                    currentDeviceId: this.currentDeviceId
                });
            } catch (error) {
                res.status(500).json({
                    error: error.message || 'Failed to get devices list'
                });
            }
        });
    }
    async getDevicesList() {
        try {
            debugPage('start to get devices list');
            const client = await this.getAdbClient();
            if (!client) {
                console.warn('failed to get adb client');
                return [];
            }
            debugPage('success to get adb client, start to request devices list');
            let devices;
            try {
                devices = await client.getDevices();
                debugPage('original devices list:', devices);
            } catch (error) {
                console.error('failed to get devices list:', error);
                return [];
            }
            if (!devices || 0 === devices.length) return [];
            const formattedDevices = devices.map((device)=>{
                const result = {
                    id: device.serial,
                    name: device.product || device.model || device.serial,
                    status: device.state || 'device'
                };
                return result;
            });
            return formattedDevices;
        } catch (error) {
            console.error('failed to get devices list:', error);
            return [];
        }
    }
    async getAdbClient() {
        const { AdbServerClient } = await import("@yume-chan/adb");
        const { AdbServerNodeTcpConnector } = await import("@yume-chan/adb-server-node-tcp");
        try {
            if (this.adbClient) debugPage('use existing adb client');
            else {
                await promiseExec('adb start-server');
                debugPage('adb server started');
                debugPage('initialize adb client');
                this.adbClient = new AdbServerClient(new AdbServerNodeTcpConnector({
                    host: '127.0.0.1',
                    port: 5037
                }));
                await debugPage('success to initialize adb client');
            }
            return this.adbClient;
        } catch (error) {
            console.error('failed to get adb client:', error);
            return null;
        }
    }
    async getAdb(deviceId) {
        const { Adb } = await import("@yume-chan/adb");
        try {
            const client = await this.getAdbClient();
            if (!client) return null;
            const targetDeviceId = deviceId || this.currentDeviceId;
            if (targetDeviceId) {
                this.currentDeviceId = targetDeviceId;
                return new Adb(await client.createTransport({
                    serial: targetDeviceId
                }));
            }
            const devices = await client.getDevices();
            if (0 === devices.length) return null;
            this.currentDeviceId = devices[0].serial;
            return new Adb(await client.createTransport(devices[0]));
        } catch (error) {
            console.error('failed to get adb client:', error);
            return null;
        }
    }
    async startScrcpy(adb, options = {}) {
        const { AdbScrcpyClient, AdbScrcpyOptions2_1 } = await import("@yume-chan/adb-scrcpy");
        const { ReadableStream } = await import("@yume-chan/stream-extra");
        const { ScrcpyOptions3_1, DefaultServerPath } = await import("@yume-chan/scrcpy");
        const currentDir = 'undefined' != typeof __dirname ? __dirname : node_path.dirname(fileURLToPath(import.meta.url));
        const serverBinPath = node_path.resolve(currentDir, '../../bin/server.bin');
        try {
            await AdbScrcpyClient.pushServer(adb, ReadableStream.from(createReadStream(serverBinPath)));
            const scrcpyOptions = new ScrcpyOptions3_1({
                audio: false,
                control: true,
                maxSize: 1024,
                videoBitRate: 2000000,
                ...options
            });
            return await AdbScrcpyClient.start(adb, DefaultServerPath, new AdbScrcpyOptions2_1(scrcpyOptions));
        } catch (error) {
            console.error('failed to start scrcpy:', error);
            throw error;
        }
    }
    setupSocketHandlers() {
        this.io.on('connection', async (socket)=>{
            debugPage('client connected, id: %s, client address: %s', socket.id, socket.handshake.address);
            let scrcpyClient = null;
            let adb = null;
            const sendDevicesList = async ()=>{
                try {
                    debugPage('Socket request to get devices list');
                    const devices = await this.getDevicesList();
                    debugPage('send devices list to client:', devices);
                    socket.emit('devices-list', {
                        devices,
                        currentDeviceId: this.currentDeviceId
                    });
                } catch (error) {
                    console.error('failed to send devices list:', error);
                    socket.emit('error', {
                        message: 'failed to get devices list'
                    });
                }
            };
            await sendDevicesList();
            socket.on('get-devices', async ()=>{
                debugPage('received client request to get devices list');
                await sendDevicesList();
            });
            socket.on('switch-device', async (deviceId)=>{
                debugPage('received client request to switch device:', deviceId);
                try {
                    if (scrcpyClient) {
                        await scrcpyClient.close();
                        scrcpyClient = null;
                    }
                    this.currentDeviceId = deviceId;
                    debugPage('device switched to:', deviceId);
                    socket.emit('device-switched', {
                        deviceId
                    });
                    this.io.emit('global-device-switched', {
                        deviceId,
                        timestamp: Date.now()
                    });
                } catch (error) {
                    console.error('failed to switch device:', error);
                    socket.emit('error', {
                        message: `Failed to switch device: ${(null == error ? void 0 : error.message) || 'Unknown error'}`
                    });
                }
            });
            socket.on('connect-device', async (options)=>{
                const { ScrcpyVideoCodecId } = await import("@yume-chan/scrcpy");
                try {
                    debugPage('received device connection request, options: %s, client id: %s', options, socket.id);
                    adb = await this.getAdb(this.currentDeviceId || void 0);
                    if (!adb) {
                        console.error('no available device found');
                        socket.emit('error', {
                            message: 'No device found'
                        });
                        return;
                    }
                    debugPage('starting scrcpy service, device id: %s', this.currentDeviceId);
                    scrcpyClient = await this.startScrcpy(adb, options);
                    debugPage('scrcpy service started successfully');
                    debugPage('check scrcpyClient object structure: %s', Object.getOwnPropertyNames(scrcpyClient).map((name)=>{
                        const type = typeof scrcpyClient[name];
                        const isPromise = 'object' === type && scrcpyClient[name] && 'function' == typeof scrcpyClient[name].then;
                        return `${name}: ${type}${isPromise ? ' (Promise)' : ''}`;
                    }));
                    try {
                        if (scrcpyClient.videoStream) {
                            debugPage('videoStream exists, type: %s', typeof scrcpyClient.videoStream);
                            let videoStream;
                            if ('object' == typeof scrcpyClient.videoStream && 'function' == typeof scrcpyClient.videoStream.then) {
                                debugPage('videoStream is a Promise, waiting for resolution...');
                                videoStream = await scrcpyClient.videoStream;
                            } else {
                                debugPage('videoStream is not a Promise, directly use');
                                videoStream = scrcpyClient.videoStream;
                            }
                            debugPage('video stream fetched successfully, metadata: %s', videoStream.metadata);
                            const metadata = videoStream.metadata || {};
                            debugPage('original metadata: %s', metadata);
                            if (!metadata.codec) {
                                debugPage('metadata does not have codec field, use H264 by default');
                                metadata.codec = ScrcpyVideoCodecId.H264;
                            }
                            if (!metadata.width || !metadata.height) {
                                debugPage('metadata does not have width or height field, use default values');
                                metadata.width = metadata.width || 1080;
                                metadata.height = metadata.height || 1920;
                            }
                            debugPage('prepare to send video-metadata event to client, data: %s', JSON.stringify(metadata));
                            socket.emit('video-metadata', metadata);
                            debugPage('video-metadata event sent to client, id: %s', socket.id);
                            const { stream } = videoStream;
                            const reader = stream.getReader();
                            const processStream = async ()=>{
                                try {
                                    while(true){
                                        const { done, value } = await reader.read();
                                        if (done) break;
                                        const frameType = value.type || 'data';
                                        socket.emit('video-data', {
                                            data: Array.from(value.data),
                                            type: frameType,
                                            timestamp: Date.now(),
                                            keyFrame: value.keyFrame
                                        });
                                    }
                                } catch (error) {
                                    console.error('error processing video stream:', error);
                                    socket.emit('error', {
                                        message: 'video stream processing error'
                                    });
                                }
                            };
                            processStream();
                        } else {
                            console.error('scrcpyClient object does not have videoStream property');
                            socket.emit('error', {
                                message: 'Video stream not available in scrcpy client'
                            });
                        }
                    } catch (error) {
                        console.error('error processing video stream:', error);
                        socket.emit('error', {
                            message: `Video stream processing error: ${error.message}`
                        });
                    }
                    if (null == scrcpyClient ? void 0 : scrcpyClient.controller) socket.emit('control-ready');
                } catch (error) {
                    console.error('failed to connect device:', error);
                    socket.emit('error', {
                        message: `Failed to connect device: ${(null == error ? void 0 : error.message) || 'Unknown error'}`
                    });
                }
            });
            socket.on('disconnect', async (reason)=>{
                debugPage('client disconnected, id: %s, reason: %s', socket.id, reason);
                if (scrcpyClient) {
                    try {
                        debugPage('closing scrcpy client');
                        await scrcpyClient.close();
                    } catch (error) {
                        console.error('failed to close scrcpy client:', error);
                    }
                    scrcpyClient = null;
                }
            });
        });
    }
    async launch(port) {
        this.port = port || this.defaultPort;
        return new Promise((resolve)=>{
            this.httpServer.listen(this.port, ()=>{
                console.log(`Scrcpy server running at: http://localhost:${this.port}`);
                this.startDeviceMonitoring();
                resolve(this);
            });
        });
    }
    startDeviceMonitoring() {
        this.devicePollInterval = setInterval(async ()=>{
            try {
                const devices = await this.getDevicesList();
                const currentDevicesJson = JSON.stringify(devices);
                if (this.lastDeviceList !== currentDevicesJson) {
                    debugPage('devices list changed, push to all connected clients');
                    this.lastDeviceList = currentDevicesJson;
                    if (!this.currentDeviceId && devices.length > 0) {
                        const onlineDevices = devices.filter((device)=>'device' === device.status.toLowerCase());
                        if (onlineDevices.length > 0) {
                            this.currentDeviceId = onlineDevices[0].id;
                            debugPage('auto select the first online device:', this.currentDeviceId);
                        }
                    }
                    this.io.emit('devices-list', {
                        devices,
                        currentDeviceId: this.currentDeviceId
                    });
                }
            } catch (error) {
                console.error('device monitoring error:', error);
            }
        }, 3000);
    }
    close() {
        if (this.devicePollInterval) {
            clearInterval(this.devicePollInterval);
            this.devicePollInterval = null;
        }
        if (this.httpServer) return this.httpServer.close();
    }
    constructor(){
        _define_property(this, "app", void 0);
        _define_property(this, "httpServer", void 0);
        _define_property(this, "io", void 0);
        _define_property(this, "port", void 0);
        _define_property(this, "defaultPort", SCRCPY_SERVER_PORT);
        _define_property(this, "adbClient", null);
        _define_property(this, "currentDeviceId", null);
        _define_property(this, "devicePollInterval", null);
        _define_property(this, "lastDeviceList", '');
        this.app = express();
        this.httpServer = external_node_http_createServer(this.app);
        this.io = new Server(this.httpServer, {
            cors: {
                origin: [
                    /^http:\/\/localhost(:\d+)?$/,
                    /^http:\/\/127\.0\.0\.1(:\d+)?$/
                ],
                methods: [
                    'GET',
                    'POST'
                ],
                credentials: true
            }
        });
        this.app.use(cors({
            origin: '*',
            credentials: true
        }));
        this.setupSocketHandlers();
        this.setupApiRoutes();
    }
}
const bin_promiseExec = promisify(exec);
async function isPortAvailable(port) {
    return new Promise((resolve)=>{
        const server = createServer();
        server.on('error', ()=>resolve(false));
        server.listen(port, ()=>{
            server.close(()=>resolve(true));
        });
    });
}
async function findAvailablePort(startPort) {
    let port = startPort;
    let attempts = 0;
    const maxAttempts = 15;
    while(!await isPortAvailable(port)){
        attempts++;
        if (attempts >= maxAttempts) {
            console.error(`\u{274C} Unable to find available port after ${maxAttempts} attempts starting from ${startPort}`);
            process.exit(1);
        }
        port++;
    }
    return port;
}
async function getAdbDevices() {
    try {
        await bin_promiseExec('adb start-server');
        const { stdout } = await bin_promiseExec('adb devices');
        const lines = stdout.trim().split('\n').slice(1);
        const devices = lines.map((line)=>{
            const parts = line.trim().split('\t');
            if (parts.length >= 2) return {
                id: parts[0],
                status: parts[1],
                name: parts[0]
            };
            return null;
        }).filter((device)=>null !== device && 'device' === device.status);
        return devices;
    } catch (error) {
        console.error('Error getting ADB devices:', error);
        return [];
    }
}
async function selectDevice() {
    console.log("\uD83D\uDD0D Scanning for Android devices...");
    const devices = await getAdbDevices();
    if (0 === devices.length) {
        console.error("\u274C No Android devices found!");
        console.log("\uD83D\uDCF1 Please ensure:");
        console.log("  \u2022 Your device is connected via USB");
        console.log("  \u2022 USB debugging is enabled");
        console.log("  \u2022 Device is authorized for debugging");
        process.exit(1);
    }
    if (1 === devices.length) {
        console.log(`\u{1F4F1} Found device: ${devices[0].name} (${devices[0].id})`);
        return devices[0].id;
    }
    const choices = devices.map((device)=>({
            name: `${device.name} (${device.id})`,
            value: device.id
        }));
    const selectedDevice = await prompts_select({
        message: "\uD83D\uDCF1 Multiple devices found. Please select one:",
        choices
    });
    return selectedDevice;
}
const staticDir = node_path.join(__dirname, '../../static');
const main = async ()=>{
    const { default: open } = await import("open");
    try {
        const selectedDeviceId = await selectDevice();
        console.log(`\u{2705} Selected device: ${selectedDeviceId}`);
        const playgroundServer = new PlaygroundServer(async ()=>{
            const device = new AndroidDevice(selectedDeviceId);
            await device.connect();
            return new AndroidAgent(device);
        }, staticDir);
        const scrcpyServer = new ScrcpyServer();
        scrcpyServer.currentDeviceId = selectedDeviceId;
        console.log("\uD83D\uDE80 Starting servers...");
        const availablePlaygroundPort = await findAvailablePort(PLAYGROUND_SERVER_PORT);
        const availableScrcpyPort = await findAvailablePort(SCRCPY_SERVER_PORT);
        if (availablePlaygroundPort !== PLAYGROUND_SERVER_PORT) console.log(`\u{26A0}\u{FE0F}  Port ${PLAYGROUND_SERVER_PORT} is busy, using port ${availablePlaygroundPort} instead`);
        if (availableScrcpyPort !== SCRCPY_SERVER_PORT) console.log(`\u{26A0}\u{FE0F}  Port ${SCRCPY_SERVER_PORT} is busy, using port ${availableScrcpyPort} instead`);
        await Promise.all([
            playgroundServer.launch(availablePlaygroundPort),
            scrcpyServer.launch(availableScrcpyPort)
        ]);
        global.scrcpyServerPort = availableScrcpyPort;
        console.log('');
        console.log("\u2728 Midscene Android Playground is ready!");
        console.log(`\u{1F3AE} Playground: http://localhost:${playgroundServer.port}`);
        console.log(`\u{1F4F1} Device: ${selectedDeviceId}`);
        console.log(`\u{1F511} Generated Server ID: ${playgroundServer.id}`);
        console.log('');
        open(`http://localhost:${playgroundServer.port}`);
    } catch (error) {
        console.error('Failed to start servers:', error);
        process.exit(1);
    }
};
main();
