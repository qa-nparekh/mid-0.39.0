import 'pixi.js/unsafe-eval';
import './index.less';
import type { AnimationScript } from '../../utils/replay-scripts';
export declare function Player(props?: {
    replayScripts?: AnimationScript[];
    imageWidth?: number;
    imageHeight?: number;
    reportFileContent?: string | null;
    key?: string | number;
    fitMode?: 'width' | 'height';
    autoZoom?: boolean;
    elementsVisible?: boolean;
}): import("react").JSX.Element;
