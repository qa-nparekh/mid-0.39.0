import type React from 'react';
import type { PlaygroundResult as PlaygroundResultType } from '../../types';
import type { ServiceModeType } from '../../types';
import type { ReplayScriptsInfo } from '../../utils/replay-scripts';
import './index.less';
interface PlaygroundResultProps {
    result: PlaygroundResultType | null;
    loading: boolean;
    serverValid?: boolean;
    serviceMode: ServiceModeType;
    replayScriptsInfo: ReplayScriptsInfo | null;
    replayCounter: number;
    loadingProgressText: string;
    verticalMode?: boolean;
    notReadyMessage?: React.ReactNode | string;
    fitMode?: 'width' | 'height';
    autoZoom?: boolean;
}
export declare const PlaygroundResultView: React.FC<PlaygroundResultProps>;
export {};
