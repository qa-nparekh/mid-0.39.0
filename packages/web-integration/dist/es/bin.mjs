import { PlaygroundServer } from "@sqai/playground";
import cors from "cors";
import { StaticPage, StaticPageAgent } from "./static/index.mjs";
import "dotenv/config";
const page = new StaticPage({
    tree: {
        node: null,
        children: []
    },
    size: {
        width: 800,
        height: 600
    },
    screenshotBase64: ''
});
const agent = new StaticPageAgent(page);
const server = new PlaygroundServer(agent);
server.app.use(cors({
    origin: '*',
    credentials: true
}));
Promise.resolve().then(()=>server.launch()).then(()=>{
    console.log(`Midscene playground server is running on http://localhost:${server.port}`);
});

//# sourceMappingURL=bin.mjs.map