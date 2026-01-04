import { spawn } from "node:child_process";
import { PLAYGROUND_SERVER_PORT } from "@sqaitech/shared/constants";
import cors from "cors";
import server_0 from "./server.mjs";
function playgroundForAgent(agent) {
    return {
        async launch (options = {}) {
            const { port = PLAYGROUND_SERVER_PORT, openBrowser = true, browserCommand, verbose = true, id, enableCors = false, corsOptions = {
                origin: '*',
                credentials: true
            } } = options;
            const webPage = agent.interface;
            if (!webPage) throw new Error('Agent must have an interface property');
            if (verbose) {
                console.log("\uD83D\uDE80 Starting Midscene Playground...");
                console.log(`\u{1F4F1} Agent: ${agent.constructor.name}`);
                console.log(`\u{1F5A5}\u{FE0F} Page: ${webPage.constructor.name}`);
                console.log(`\u{1F310} Port: ${port}`);
                if (enableCors) console.log("\uD83D\uDD13 CORS enabled");
            }
            const server = new server_0(agent, void 0, id);
            if (enableCors) server.app.use(cors(corsOptions));
            const launchedServer = await server.launch(port);
            if (verbose) console.log(`\u{2705} Playground server started on port ${port}`);
            const url = `http://127.0.0.1:${port}`;
            if (openBrowser) await openInBrowser(url, browserCommand, verbose);
            return {
                server: launchedServer,
                port,
                host: '127.0.0.1',
                close: async ()=>{
                    if (verbose) console.log("\uD83D\uDED1 Shutting down Midscene Playground...");
                    try {
                        await launchedServer.close();
                        if (verbose) console.log("\u2705 Playground shutdown complete");
                    } catch (error) {
                        if (verbose) console.error("\u274C Error during playground shutdown:", error);
                        throw error;
                    }
                }
            };
        }
    };
}
async function openInBrowser(url, customCommand, verbose = true) {
    return new Promise((resolve, reject)=>{
        let command;
        let args;
        if (customCommand) {
            command = customCommand;
            args = [
                url
            ];
        } else switch(process.platform){
            case 'darwin':
                command = 'open';
                args = [
                    url
                ];
                break;
            case 'win32':
                command = 'start';
                args = [
                    '',
                    url
                ];
                break;
            default:
                command = 'xdg-open';
                args = [
                    url
                ];
                break;
        }
        if (verbose) console.log(`\u{1F310} Opening browser: ${command} ${args.join(' ')}`);
        const child = spawn(command, args, {
            detached: true,
            stdio: 'ignore'
        });
        child.on('error', (error)=>{
            if (verbose) {
                console.warn("\u26A0\uFE0F  Failed to open browser automatically:", error.message);
                console.log(`\u{1F310} Please open manually: ${url}`);
            }
            resolve();
        });
        child.on('close', ()=>{
            resolve();
        });
        child.unref();
    });
}
export { playgroundForAgent };

//# sourceMappingURL=launcher.mjs.map