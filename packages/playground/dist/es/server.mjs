import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getTmpDir } from "@sqai/core/utils";
import { PLAYGROUND_SERVER_PORT } from "@sqai/shared/constants";
import { overrideAIConfig } from "@sqai/shared/env";
import { uuid as utils_uuid } from "@sqai/shared/utils";
import express from "express";
import { executeAction, formatErrorMessage } from "./common.mjs";
import "dotenv/config";
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
const defaultPort = PLAYGROUND_SERVER_PORT;
const server_filename = fileURLToPath(import.meta.url);
const server_dirname = dirname(server_filename);
const STATIC_PATH = join(server_dirname, '..', '..', 'static');
const errorHandler = (err, req, res, next)=>{
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({
        error: errorMessage
    });
};
class PlaygroundServer {
    get app() {
        return this._app;
    }
    initializeApp() {
        if (this._initialized) return;
        this._app.use(express.json({
            limit: '50mb'
        }));
        this._app.use((req, _res, next)=>{
            const { context } = req.body || {};
            if (context && 'updateContext' in this.agent.interface && 'function' == typeof this.agent.interface.updateContext) {
                this.agent.interface.updateContext(context);
                console.log('Context updated by PlaygroundServer middleware');
            }
            next();
        });
        this.setupRoutes();
        this.setupStaticRoutes();
        this._app.use(errorHandler);
        this._initialized = true;
    }
    filePathForUuid(uuid) {
        return join(this.tmpDir, `${uuid}.json`);
    }
    saveContextFile(uuid, context) {
        const tmpFile = this.filePathForUuid(uuid);
        console.log(`save context file: ${tmpFile}`);
        writeFileSync(tmpFile, context);
        return tmpFile;
    }
    async recreateAgent() {
        if (!this.agentFactory) return void console.warn('Cannot recreate agent: factory function not provided. Agent recreation is only available when using factory mode.');
        console.log('Recreating agent to cancel current task...');
        try {
            if (this.agent && 'function' == typeof this.agent.destroy) await this.agent.destroy();
        } catch (error) {
            console.warn('Failed to destroy old agent:', error);
        }
        try {
            this.agent = await this.agentFactory();
            console.log('Agent recreated successfully');
        } catch (error) {
            console.error('Failed to recreate agent:', error);
            throw error;
        }
    }
    setupRoutes() {
        this._app.get('/status', async (req, res)=>{
            res.send({
                status: 'ok',
                id: this.id
            });
        });
        this._app.get('/context/:uuid', async (req, res)=>{
            const { uuid } = req.params;
            const contextFile = this.filePathForUuid(uuid);
            if (!existsSync(contextFile)) return res.status(404).json({
                error: 'Context not found'
            });
            const context = readFileSync(contextFile, 'utf8');
            res.json({
                context
            });
        });
        this._app.get('/task-progress/:requestId', async (req, res)=>{
            const { requestId } = req.params;
            res.json({
                tip: this.taskProgressTips[requestId] || ''
            });
        });
        this._app.post('/action-space', async (req, res)=>{
            try {
                let actionSpace = [];
                actionSpace = await this.agent.interface.actionSpace();
                const processedActionSpace = actionSpace.map((action)=>{
                    if (action && 'object' == typeof action && 'paramSchema' in action) {
                        const typedAction = action;
                        if (typedAction.paramSchema && 'object' == typeof typedAction.paramSchema) {
                            let processedSchema = null;
                            try {
                                if (typedAction.paramSchema.shape && 'object' == typeof typedAction.paramSchema.shape) processedSchema = {
                                    type: 'ZodObject',
                                    shape: typedAction.paramSchema.shape
                                };
                            } catch (e) {
                                const actionName = 'name' in typedAction && 'string' == typeof typedAction.name ? typedAction.name : 'unknown';
                                console.warn('Failed to process paramSchema for action:', actionName, e);
                            }
                            return {
                                ...typedAction,
                                paramSchema: processedSchema
                            };
                        }
                    }
                    return action;
                });
                res.json(processedActionSpace);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error('Failed to get action space:', error);
                res.status(500).json({
                    error: errorMessage
                });
            }
        });
        this._app.post('/playground-with-context', async (req, res)=>{
            const context = req.body.context;
            if (!context) return res.status(400).json({
                error: 'context is required'
            });
            const requestId = utils_uuid();
            this.saveContextFile(requestId, context);
            return res.json({
                location: `/playground/${requestId}`,
                uuid: requestId
            });
        });
        this._app.post('/execute', async (req, res)=>{
            const { type, prompt, params, requestId, deepThink, screenshotIncluded, domIncluded } = req.body;
            if (!type) return res.status(400).json({
                error: 'type is required'
            });
            if (this.currentTaskId) return res.status(409).json({
                error: 'Another task is already running',
                currentTaskId: this.currentTaskId
            });
            if (requestId) {
                this.currentTaskId = requestId;
                this.taskProgressTips[requestId] = '';
                this.agent.onTaskStartTip = (tip)=>{
                    this.taskProgressTips[requestId] = tip;
                };
            }
            const response = {
                result: null,
                dump: null,
                error: null,
                reportHTML: null,
                requestId
            };
            const startTime = Date.now();
            try {
                const actionSpace = await this.agent.interface.actionSpace();
                const value = {
                    type,
                    prompt,
                    params
                };
                response.result = await executeAction(this.agent, type, actionSpace, value, {
                    deepThink,
                    screenshotIncluded,
                    domIncluded
                });
            } catch (error) {
                response.error = formatErrorMessage(error);
            }
            try {
                response.dump = JSON.parse(this.agent.dumpDataString());
                response.reportHTML = this.agent.reportHTMLString() || null;
                this.agent.writeOutActionDumps();
                this.agent.resetDump();
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`write out dump failed: requestId: ${requestId}, ${errorMessage}`);
            }
            res.send(response);
            const timeCost = Date.now() - startTime;
            if (response.error) console.error(`handle request failed after ${timeCost}ms: requestId: ${requestId}, ${response.error}`);
            else console.log(`handle request done after ${timeCost}ms: requestId: ${requestId}`);
            if (requestId) {
                delete this.taskProgressTips[requestId];
                if (this.currentTaskId === requestId) this.currentTaskId = null;
            }
        });
        this._app.post('/cancel/:requestId', async (req, res)=>{
            const { requestId } = req.params;
            if (!requestId) return res.status(400).json({
                error: 'requestId is required'
            });
            try {
                if (this.currentTaskId !== requestId) return res.json({
                    status: 'not_found',
                    message: 'Task not found or already completed'
                });
                console.log(`Cancelling task: ${requestId}`);
                await this.recreateAgent();
                delete this.taskProgressTips[requestId];
                this.currentTaskId = null;
                res.json({
                    status: 'cancelled',
                    message: 'Task cancelled successfully by recreating agent'
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`Failed to cancel: ${errorMessage}`);
                res.status(500).json({
                    error: `Failed to cancel: ${errorMessage}`
                });
            }
        });
        this._app.get('/screenshot', async (_req, res)=>{
            try {
                if ('function' != typeof this.agent.interface.screenshotBase64) return res.status(500).json({
                    error: 'Screenshot method not available on current interface'
                });
                const base64Screenshot = await this.agent.interface.screenshotBase64();
                res.json({
                    screenshot: base64Screenshot,
                    timestamp: Date.now()
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`Failed to take screenshot: ${errorMessage}`);
                res.status(500).json({
                    error: `Failed to take screenshot: ${errorMessage}`
                });
            }
        });
        this._app.get('/interface-info', async (_req, res)=>{
            try {
                var _this_agent_interface_describe, _this_agent_interface;
                const type = this.agent.interface.interfaceType || 'Unknown';
                const description = (null == (_this_agent_interface_describe = (_this_agent_interface = this.agent.interface).describe) ? void 0 : _this_agent_interface_describe.call(_this_agent_interface)) || void 0;
                res.json({
                    type,
                    description
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`Failed to get interface info: ${errorMessage}`);
                res.status(500).json({
                    error: `Failed to get interface info: ${errorMessage}`
                });
            }
        });
        this.app.post('/config', async (req, res)=>{
            const { aiConfig } = req.body;
            if (!aiConfig || 'object' != typeof aiConfig) return res.status(400).json({
                error: 'aiConfig is required and must be an object'
            });
            if (0 === Object.keys(aiConfig).length) return res.json({
                status: 'ok',
                message: 'AI config not changed due to empty object'
            });
            try {
                overrideAIConfig(aiConfig);
                return res.json({
                    status: 'ok',
                    message: 'AI config updated successfully'
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`Failed to update AI config: ${errorMessage}`);
                return res.status(500).json({
                    error: `Failed to update AI config: ${errorMessage}`
                });
            }
        });
    }
    setupStaticRoutes() {
        this._app.get('/', (_req, res)=>{
            this.serveHtmlWithPorts(res);
        });
        this._app.get('/index.html', (_req, res)=>{
            this.serveHtmlWithPorts(res);
        });
        this._app.use(express["static"](this.staticPath));
        this._app.get('*', (_req, res)=>{
            this.serveHtmlWithPorts(res);
        });
    }
    serveHtmlWithPorts(res) {
        try {
            const htmlPath = join(this.staticPath, 'index.html');
            let html = readFileSync(htmlPath, 'utf8');
            const scrcpyPort = global.scrcpyServerPort || this.port + 1;
            const configScript = `
        <script>
          window.SCRCPY_PORT = ${scrcpyPort};
        </script>
      `;
            html = html.replace('</head>', `${configScript}</head>`);
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } catch (error) {
            console.error('Error serving HTML with ports:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async launch(port) {
        if (this.agentFactory) {
            console.log('Initializing agent from factory function...');
            this.agent = await this.agentFactory();
            console.log('Agent initialized successfully');
        }
        this.initializeApp();
        this.port = port || defaultPort;
        return new Promise((resolve)=>{
            const serverPort = this.port;
            this.server = this._app.listen(serverPort, ()=>{
                resolve(this);
            });
        });
    }
    async close() {
        return new Promise((resolve, reject)=>{
            if (this.server) {
                try {
                    this.agent.destroy();
                } catch (error) {
                    console.warn('Failed to destroy agent:', error);
                }
                this.taskProgressTips = {};
                this.server.close((error)=>{
                    if (error) reject(error);
                    else {
                        this.server = void 0;
                        resolve();
                    }
                });
            } else resolve();
        });
    }
    constructor(agent, staticPath = STATIC_PATH, id){
        _define_property(this, "_app", void 0);
        _define_property(this, "tmpDir", void 0);
        _define_property(this, "server", void 0);
        _define_property(this, "port", void 0);
        _define_property(this, "agent", void 0);
        _define_property(this, "staticPath", void 0);
        _define_property(this, "taskProgressTips", void 0);
        _define_property(this, "id", void 0);
        _define_property(this, "_initialized", false);
        _define_property(this, "agentFactory", void 0);
        _define_property(this, "currentTaskId", null);
        this._app = express();
        this.tmpDir = getTmpDir();
        this.staticPath = staticPath;
        this.taskProgressTips = {};
        this.id = id || utils_uuid();
        if ('function' == typeof agent) {
            this.agentFactory = agent;
            this.agent = null;
        } else {
            this.agent = agent;
            this.agentFactory = null;
        }
    }
}
const server = PlaygroundServer;
export { PlaygroundServer, server as default };

//# sourceMappingURL=server.mjs.map