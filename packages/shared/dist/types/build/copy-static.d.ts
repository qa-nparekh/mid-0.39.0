export interface CopyStaticOptions {
    /** Source directory to copy from */
    srcDir: string;
    /** Destination directory to copy to */
    destDir: string;
    /** Optional favicon source path (relative to directory containing srcDir) */
    faviconPath?: string;
    /** Name for the rsbuild plugin */
    pluginName?: string;
}
/**
 * Creates an rsbuild plugin that copies static files after build
 * @param options Configuration options for copying static files
 * @returns Rsbuild plugin object
 */
export declare const createCopyStaticPlugin: (options: CopyStaticOptions) => {
    name: string;
    setup(api: any): void;
};
/**
 * Helper function to create a copy static plugin for playground builds
 * @param srcDir Source directory (usually dist directory)
 * @param destDir Destination directory
 * @param pluginName Optional plugin name
 * @param faviconSrc Optional favicon source path
 * @returns Rsbuild plugin
 */
export declare const createPlaygroundCopyPlugin: (srcDir: string, destDir: string, pluginName?: string, faviconSrc?: string) => {
    name: string;
    setup(api: any): void;
};
