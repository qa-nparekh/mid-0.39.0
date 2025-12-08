import node_fs from "node:fs";
import node_path from "node:path";
const createCopyStaticPlugin = (options)=>({
        name: options.pluginName || 'copy-static',
        setup (api) {
            api.onAfterBuild(async ()=>{
                const { srcDir, destDir, faviconPath } = options;
                await node_fs.promises.mkdir(destDir, {
                    recursive: true
                });
                await node_fs.promises.cp(srcDir, destDir, {
                    recursive: true
                });
                console.log(`Copied build artifacts from ${srcDir} to ${destDir}`);
                if (faviconPath) {
                    const faviconDest = node_path.join(destDir, 'favicon.ico');
                    await node_fs.promises.copyFile(faviconPath, faviconDest);
                    console.log(`Copied favicon from ${faviconPath} to ${faviconDest}`);
                }
            });
        }
    });
const createPlaygroundCopyPlugin = (srcDir, destDir, pluginName, faviconSrc)=>createCopyStaticPlugin({
        srcDir,
        destDir,
        faviconPath: faviconSrc,
        pluginName
    });
export { createCopyStaticPlugin, createPlaygroundCopyPlugin };
